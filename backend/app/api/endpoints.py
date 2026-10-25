"""
FastAPI REST API Endpoints with Enterprise RBAC and Workflow Enforcement.
Implements the full human-governed regulatory-to-rule engineering lifecycle.
"""

from datetime import datetime
import json
import os
import uuid
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, Header, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_user, require_permission, require_role
from app.models.models import (
    User, Circular, DocumentPage, Obligation, Policy,
    ObligationMapping, Rule, RuleVersion, TestCase, TestRun,
    ImpactReport, Approval, Deployment, AuditEvent
)
from app.schemas.schemas import (
    UserRead, CircularRead, CircularDetail, DocumentPageRead,
    ObligationRead, ObligationReviewUpdate, PolicyRead, MappingCreate,
    MappingRead, RuleRead, RuleVersionRead, RuleValidateRequest,
    RuleValidateResponse, RuleDraftCreate, TestCaseRead, TestRunRead,
    ImpactSimulateRequest, ImpactReportRead, ApprovalCreate, ApprovalRead,
    DeploymentCreate, DeploymentRead, RollbackRequest, AuditEventRead
)
from app.engine.rule_dsl import DeterministicRuleEngine, RuleValidationError
from app.engine.impact_comparator import ImpactComparator
from app.services.document_service import DocumentService
from app.data.seed_data import generate_synthetic_dataset

router = APIRouter()

def log_audit(
    db: Session,
    event_type: str,
    actor_id: str,
    actor_name: str,
    actor_role: str,
    entity_type: str,
    entity_id: str,
    action: str,
    details: Dict[str, Any]
):
    event = AuditEvent(
        id=str(uuid.uuid4()),
        event_type=event_type,
        actor_id=actor_id,
        actor_name=actor_name,
        actor_role=actor_role,
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.add(event)
    db.commit()


# ==========================================
# 1. USER & AUTH / ROLE CONTEXT
# ==========================================

@router.get("/auth/users", response_model=List[UserRead])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/auth/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/auth/user/{user_id}", response_model=UserRead)
def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# ==========================================
# 2. ROLE-SPECIFIC DASHBOARD METRICS
# ==========================================

@router.get("/dashboard/metrics")
def get_role_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes real, live metrics calculated from database entities tailored to the authenticated role.
    """
    role = current_user.role

    if role == "COMPLIANCE_ANALYST":
        circulars_count = db.query(Circular).count()
        unresolved_count = db.query(Obligation).filter(Obligation.applicability == "UNRESOLVED").count()
        applicable_count = db.query(Obligation).filter(Obligation.applicability == "APPLICABLE").count()
        mapped_count = db.query(ObligationMapping).filter(ObligationMapping.mapping_status == "MAPPED").count()
        unmapped_count = db.query(Obligation).filter(
            ~Obligation.id.in_(db.query(ObligationMapping.obligation_id))
        ).count()

        recent_circulars = db.query(Circular).order_by(desc(Circular.created_at)).limit(3).all()
        recent_obligations = db.query(Obligation).order_by(desc(Obligation.source_page)).limit(5).all()

        return {
            "role": role,
            "metrics": {
                "circulars_awaiting_review": circulars_count,
                "obligations_requiring_clarification": unresolved_count,
                "applicable_obligations": applicable_count,
                "mapping_completion_count": mapped_count,
                "unmapped_conflicts_count": unmapped_count,
            },
            "recent_circulars": [
                {"id": c.id, "title": c.title, "authority": c.source_authority, "date": c.publication_date, "status": c.status}
                for c in recent_circulars
            ],
            "pending_obligations": [
                {"id": o.id, "code": o.obligation_code, "title": o.title, "page": o.source_page, "applicability": o.applicability}
                for o in recent_obligations
            ]
        }

    elif role == "RULE_ENGINEER":
        eligible_obligations = db.query(Obligation).filter(Obligation.applicability == "APPLICABLE").count()
        draft_rules = db.query(Rule).filter(Rule.status == "DRAFT").count()
        tested_rules = db.query(Rule).filter(Rule.status == "TESTED").count()
        deployed_rules = db.query(Rule).filter(Rule.status == "DEPLOYED").count()
        failed_tests = db.query(TestRun).filter(TestRun.status == "FAILED").count()

        active_sandbox_dep = db.query(Deployment).filter(Deployment.status == "DEPLOYED").order_by(desc(Deployment.deployed_at)).first()

        return {
            "role": role,
            "metrics": {
                "assigned_implementation_tasks": eligible_obligations,
                "rules_awaiting_development": draft_rules,
                "rules_awaiting_approval": tested_rules,
                "deployed_rules_count": deployed_rules,
                "failed_tests_count": failed_tests,
                "active_sandbox_version": "v1.1.0-draft" if active_sandbox_dep else "v1.0.0 (Baseline)"
            },
            "sandbox_status": {
                "environment": settings.SANDBOX_ENVIRONMENT,
                "active_version": "v1.1.0-draft" if active_sandbox_dep else "v1.0.0 (Baseline)",
                "last_deployment_at": active_sandbox_dep.deployed_at if active_sandbox_dep else None
            }
        }

    elif role == "COMPLIANCE_APPROVER":
        tested_versions = db.query(RuleVersion).filter(RuleVersion.version_number.ilike("%draft%")).count()
        pending_approvals = db.query(Rule).filter(Rule.status == "TESTED").count()
        passed_test_evidence = db.query(TestRun).filter(TestRun.status == "PASSED").count()
        total_decisions = db.query(Approval).count()
        approved_count = db.query(Approval).filter(Approval.decision == "APPROVED").count()

        recent_approvals = db.query(Approval).order_by(desc(Approval.decided_at)).limit(4).all()

        return {
            "role": role,
            "metrics": {
                "pending_approval_decisions": pending_approvals,
                "candidate_versions_awaiting_review": tested_versions,
                "verified_test_evidence_count": passed_test_evidence,
                "total_decisions_logged": total_decisions,
                "approved_rate": round((approved_count / total_decisions * 100), 1) if total_decisions > 0 else 100.0,
            },
            "recent_decisions": [
                {"id": a.id, "version_id": a.rule_version_id, "decision": a.decision, "date": a.decided_at, "rationale": a.rationale}
                for a in recent_approvals
            ]
        }

    else: # PLATFORM_ADMIN
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.is_active == True).count()
        total_audit = db.query(AuditEvent).count()
        processing_failures = db.query(Circular).filter(Circular.status == "FAILED").count()

        recent_audit = db.query(AuditEvent).order_by(desc(AuditEvent.timestamp)).limit(5).all()

        return {
            "role": role,
            "metrics": {
                "total_users": total_users,
                "active_users": active_users,
                "total_audit_events": total_audit,
                "processing_job_failures": processing_failures,
                "system_health": "HEALTHY",
                "llm_provider": settings.LLM_PROVIDER
            },
            "recent_audit": [
                {"id": ev.id, "event": ev.event_type, "actor": ev.actor_name, "action": ev.action, "time": ev.timestamp}
                for ev in recent_audit
            ]
        }


# ==========================================
# 3. CIRCULARS & DOCUMENT INGESTION
# ==========================================

@router.get("/circulars", response_model=List[CircularRead])
def list_circulars(
    query: Optional[str] = None,
    authority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Circular)
    if query:
        q = q.filter(Circular.title.ilike(f"%{query}%"))
    if authority:
        q = q.filter(Circular.source_authority == authority)
    
    circulars = q.order_by(desc(Circular.created_at)).all()
    results = []
    for c in circulars:
        c_dict = {
            "id": c.id,
            "title": c.title,
            "filename": c.filename,
            "file_hash": c.file_hash,
            "source_authority": c.source_authority,
            "circular_number": c.circular_number,
            "publication_date": c.publication_date,
            "effective_date": c.effective_date,
            "status": c.status,
            "page_count": c.page_count,
            "created_at": c.created_at,
            "obligations_count": len(c.obligations)
        }
        results.append(CircularRead(**c_dict))
    return results

@router.get("/circulars/{circular_id}", response_model=CircularDetail)
def get_circular_detail(circular_id: str, db: Session = Depends(get_db)):
    c = db.query(Circular).filter(Circular.id == circular_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Circular not found")
    
    pages = [
        DocumentPageRead(id=p.id, page_number=p.page_number, text_content=p.text_content)
        for p in sorted(c.pages, key=lambda x: x.page_number)
    ]
    return CircularDetail(
        id=c.id,
        title=c.title,
        filename=c.filename,
        file_hash=c.file_hash,
        source_authority=c.source_authority,
        circular_number=c.circular_number,
        publication_date=c.publication_date,
        effective_date=c.effective_date,
        status=c.status,
        page_count=c.page_count,
        created_at=c.created_at,
        obligations_count=len(c.obligations),
        extracted_text=c.extracted_text,
        pages=pages
    )

@router.post("/circulars/upload")
async def upload_circular(
    file: UploadFile = File(...),
    title: str = Form(...),
    source_authority: str = Form(...),
    circular_number: Optional[str] = Form(None),
    publication_date: Optional[str] = Form(None),
    effective_date: Optional[str] = Form(None),
    current_user: User = Depends(require_permission("circular:upload")),
    db: Session = Depends(get_db)
):
    # Validate file extension
    filename = file.filename or "uploaded_circular.pdf"
    if not (filename.lower().endswith(".pdf") or filename.lower().endswith(".txt")):
        raise HTTPException(status_code=400, detail="Invalid file type. Supported types: PDF, TXT")

    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB")

    file_hash = DocumentService.compute_sha256(contents)
    
    # Save file to upload directory
    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_hash[:16]}_{filename}")
    with open(file_path, "wb") as f:
        f.write(contents)

    # Extract text by pages
    pages_data = DocumentService.extract_text_by_pages(file_path)
    full_text = "\n\n--- PAGE BREAK ---\n\n".join([p["text"] for p in pages_data])

    circular = Circular(
        id=str(uuid.uuid4()),
        title=title,
        filename=filename,
        file_hash=file_hash,
        source_authority=source_authority,
        circular_number=circular_number,
        publication_date=publication_date or datetime.utcnow().strftime("%Y-%m-%d"),
        effective_date=effective_date,
        status="PARSED",
        page_count=len(pages_data),
        extracted_text=full_text
    )
    db.add(circular)
    db.commit()

    # Store pages
    for p in pages_data:
        dp = DocumentPage(
            id=str(uuid.uuid4()),
            circular_id=circular.id,
            page_number=p["page_number"],
            text_content=p["text"]
        )
        db.add(dp)
    db.commit()

    # Extract candidate obligations
    candidates = DocumentService.extract_candidate_obligations(title, pages_data)
    for cand in candidates:
        obl = Obligation(
            id=str(uuid.uuid4()),
            circular_id=circular.id,
            obligation_code=f"OBL-{cand['obligation_code']}-{uuid.uuid4().hex[:4].upper()}",
            title=cand["title"],
            extracted_text=cand["extracted_text"],
            source_page=cand["source_page"],
            source_span=cand["source_span"],
            actor=cand["actor"],
            action=cand["action"],
            conditions=cand["conditions"],
            threshold=cand["threshold"],
            deadline=cand["deadline"],
            review_status="PENDING",
            applicability="UNRESOLVED",
            flags=cand.get("flags", [])
        )
        db.add(obl)
    db.commit()

    log_audit(
        db,
        event_type="CIRCULAR_UPLOADED",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="CIRCULAR",
        entity_id=circular.id,
        action="Uploaded & Ingested Regulatory Circular",
        details={"filename": filename, "pages": len(pages_data), "hash": file_hash, "extracted_obligations": len(candidates)}
    )

    return {
        "id": circular.id,
        "title": circular.title,
        "filename": filename,
        "page_count": len(pages_data),
        "obligations_extracted": len(candidates),
        "status": "PARSED"
    }


# ==========================================
# 4. OBLIGATION REVIEW & APPLICABILITY
# ==========================================

@router.get("/obligations", response_model=List[ObligationRead])
def list_obligations(
    circular_id: Optional[str] = None,
    applicability: Optional[str] = None,
    review_status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Obligation)
    if circular_id:
        q = q.filter(Obligation.circular_id == circular_id)
    if applicability:
        q = q.filter(Obligation.applicability == applicability)
    if review_status:
        q = q.filter(Obligation.review_status == review_status)

    obligations = q.all()
    results = []
    for obl in obligations:
        policy_code = obl.mapping.policy.policy_code if obl.mapping and obl.mapping.policy else None
        policy_title = obl.mapping.policy.title if obl.mapping and obl.mapping.policy else None
        results.append(ObligationRead(
            id=obl.id,
            circular_id=obl.circular_id,
            obligation_code=obl.obligation_code,
            title=obl.title,
            extracted_text=obl.extracted_text,
            source_page=obl.source_page,
            source_span=obl.source_span,
            actor=obl.actor,
            action=obl.action,
            conditions=obl.conditions,
            threshold=obl.threshold,
            deadline=obl.deadline,
            review_status=obl.review_status,
            applicability=obl.applicability,
            reviewer_notes=obl.reviewer_notes,
            reviewed_by_id=obl.reviewed_by_id,
            reviewed_at=obl.reviewed_at,
            flags=obl.flags or [],
            policy_code=policy_code,
            policy_title=policy_title
        ))
    return results

@router.get("/obligations/{obligation_id}", response_model=ObligationRead)
def get_obligation(obligation_id: str, db: Session = Depends(get_db)):
    obl = db.query(Obligation).filter(Obligation.id == obligation_id).first()
    if not obl:
        raise HTTPException(status_code=404, detail="Obligation not found")
    
    policy_code = obl.mapping.policy.policy_code if obl.mapping and obl.mapping.policy else None
    policy_title = obl.mapping.policy.title if obl.mapping and obl.mapping.policy else None
    
    return ObligationRead(
        id=obl.id,
        circular_id=obl.circular_id,
        obligation_code=obl.obligation_code,
        title=obl.title,
        extracted_text=obl.extracted_text,
        source_page=obl.source_page,
        source_span=obl.source_span,
        actor=obl.actor,
        action=obl.action,
        conditions=obl.conditions,
        threshold=obl.threshold,
        deadline=obl.deadline,
        review_status=obl.review_status,
        applicability=obl.applicability,
        reviewer_notes=obl.reviewer_notes,
        reviewed_by_id=obl.reviewed_by_id,
        reviewed_at=obl.reviewed_at,
        flags=obl.flags or [],
        policy_code=policy_code,
        policy_title=policy_title
    )

@router.put("/obligations/{obligation_id}/review", response_model=ObligationRead)
def review_obligation(
    obligation_id: str,
    update: ObligationReviewUpdate,
    current_user: User = Depends(require_permission("obligation:review")),
    db: Session = Depends(get_db)
):
    obl = db.query(Obligation).filter(Obligation.id == obligation_id).first()
    if not obl:
        raise HTTPException(status_code=404, detail="Obligation not found")

    if update.title:
        obl.title = update.title
    if update.actor:
        obl.actor = update.actor
    if update.action:
        obl.action = update.action
    if update.conditions:
        obl.conditions = update.conditions
    if update.threshold:
        obl.threshold = update.threshold
    if update.deadline:
        obl.deadline = update.deadline

    obl.applicability = update.applicability
    obl.reviewer_notes = update.reviewer_notes
    obl.review_status = update.review_status
    obl.reviewed_by_id = current_user.id
    obl.reviewed_at = datetime.utcnow()

    db.commit()

    log_audit(
        db,
        event_type="OBLIGATION_REVIEWED",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="OBLIGATION",
        entity_id=obl.id,
        action=f"Reviewed Obligation Applicability: {obl.applicability}",
        details={"applicability": obl.applicability, "review_status": obl.review_status, "notes": obl.reviewer_notes}
    )

    policy_code = obl.mapping.policy.policy_code if obl.mapping and obl.mapping.policy else None
    policy_title = obl.mapping.policy.title if obl.mapping and obl.mapping.policy else None

    return ObligationRead(
        id=obl.id,
        circular_id=obl.circular_id,
        obligation_code=obl.obligation_code,
        title=obl.title,
        extracted_text=obl.extracted_text,
        source_page=obl.source_page,
        source_span=obl.source_span,
        actor=obl.actor,
        action=obl.action,
        conditions=obl.conditions,
        threshold=obl.threshold,
        deadline=obl.deadline,
        review_status=obl.review_status,
        applicability=obl.applicability,
        reviewer_notes=obl.reviewer_notes,
        reviewed_by_id=obl.reviewed_by_id,
        reviewed_at=obl.reviewed_at,
        flags=obl.flags or [],
        policy_code=policy_code,
        policy_title=policy_title
    )


# ==========================================
# 5. POLICY CATALOGUE & MAPPING
# ==========================================

@router.get("/policies", response_model=List[PolicyRead])
def list_policies(
    query: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    q = db.query(Policy)
    if query:
        q = q.filter((Policy.title.ilike(f"%{query}%")) | (Policy.policy_code.ilike(f"%{query}%")))
    if category:
        q = q.filter(Policy.category == category)
    return q.all()

@router.post("/obligations/{obligation_id}/mapping", response_model=MappingRead)
def create_or_update_mapping(
    obligation_id: str,
    mapping_in: MappingCreate,
    current_user: User = Depends(require_permission("mapping:edit")),
    db: Session = Depends(get_db)
):
    obl = db.query(Obligation).filter(Obligation.id == obligation_id).first()
    if not obl:
        raise HTTPException(status_code=404, detail="Obligation not found")

    mapping = db.query(ObligationMapping).filter(ObligationMapping.obligation_id == obligation_id).first()
    if not mapping:
        mapping = ObligationMapping(
            id=str(uuid.uuid4()),
            obligation_id=obligation_id,
            mapped_by_id=current_user.id,
            mapped_at=datetime.utcnow()
        )
        db.add(mapping)

    mapping.policy_id = mapping_in.policy_id
    mapping.mapping_status = mapping_in.mapping_status
    mapping.match_type = mapping_in.match_type
    mapping.rationale = mapping_in.rationale
    mapping.mapped_by_id = current_user.id
    mapping.mapped_at = datetime.utcnow()

    db.commit()

    log_audit(
        db,
        event_type="POLICY_MAPPED",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="OBLIGATION_MAPPING",
        entity_id=mapping.id,
        action=f"Configured Policy Mapping: {mapping.mapping_status}",
        details={"policy_id": mapping.policy_id, "match_type": mapping.match_type, "rationale": mapping.rationale}
    )

    return mapping


# ==========================================
# 6. RULE STUDIO, DSL VALIDATOR & VERSIONS
# ==========================================

@router.get("/rules", response_model=List[RuleRead])
def list_rules(db: Session = Depends(get_db)):
    return db.query(Rule).all()

@router.get("/rules/{rule_id}", response_model=RuleRead)
def get_rule(rule_id: str, db: Session = Depends(get_db)):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return rule

@router.get("/rules/{rule_id}/versions", response_model=List[RuleVersionRead])
def get_rule_versions(rule_id: str, db: Session = Depends(get_db)):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")
    return db.query(RuleVersion).filter(RuleVersion.rule_id == rule_id).order_by(desc(RuleVersion.created_at)).all()

@router.get("/rules/{rule_id}/versions/{version_id}", response_model=RuleVersionRead)
def get_rule_version_detail(rule_id: str, version_id: str, db: Session = Depends(get_db)):
    ver = db.query(RuleVersion).filter(RuleVersion.id == version_id, RuleVersion.rule_id == rule_id).first()
    if not ver:
        raise HTTPException(status_code=404, detail="Rule version not found")
    return ver

@router.post("/rules/validate-dsl", response_model=RuleValidateResponse)
def validate_rule_dsl(req: RuleValidateRequest):
    is_valid, errors = DeterministicRuleEngine.validate_dsl(req.dsl_definition)
    version = req.dsl_definition.get("version") if isinstance(req.dsl_definition, dict) else None
    return RuleValidateResponse(
        is_valid=is_valid,
        errors=errors,
        validated_version=version
    )

@router.post("/rules/{rule_id}/versions", response_model=RuleVersionRead)
def create_rule_version_draft(
    rule_id: str,
    draft: RuleDraftCreate,
    current_user: User = Depends(require_permission("rule:create")),
    db: Session = Depends(get_db)
):
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    is_valid, errors = DeterministicRuleEngine.validate_dsl(draft.dsl_definition)

    new_version = RuleVersion(
        id=str(uuid.uuid4()),
        rule_id=rule.id,
        version_number=draft.version_number,
        dsl_definition=draft.dsl_definition,
        change_summary=draft.change_summary,
        is_valid=is_valid,
        validation_errors=errors,
        created_by_id=current_user.id,
        created_at=datetime.utcnow()
    )
    db.add(new_version)
    
    # Material rule update invalidates prior approval for this rule
    rule.current_version_id = new_version.id
    rule.status = "DRAFT" # Always reset to DRAFT upon new version creation
    db.commit()

    log_audit(
        db,
        event_type="RULE_VERSION_DRAFTED",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="RULE_VERSION",
        entity_id=new_version.id,
        action=f"Created Candidate Version {new_version.version_number} (Approval Reset to DRAFT)",
        details={"version": new_version.version_number, "is_valid": is_valid, "errors_count": len(errors)}
    )

    return new_version


# ==========================================
# 7. TEST EXECUTION & IMPACT SIMULATOR
# ==========================================

@router.get("/rules/{rule_id}/test-cases", response_model=List[TestCaseRead])
def get_rule_test_cases(rule_id: str, db: Session = Depends(get_db)):
    return db.query(TestCase).filter(TestCase.rule_id == rule_id).all()

@router.post("/rules/{rule_id}/versions/{version_id}/test-run", response_model=TestRunRead)
def execute_test_suite(
    rule_id: str,
    version_id: str,
    current_user: User = Depends(require_permission("rule:test")),
    db: Session = Depends(get_db)
):
    ver = db.query(RuleVersion).filter(RuleVersion.id == version_id, RuleVersion.rule_id == rule_id).first()
    if not ver:
        raise HTTPException(status_code=404, detail="Rule version not found")

    test_cases = db.query(TestCase).filter(TestCase.rule_id == rule_id).all()
    if not test_cases:
        raise HTTPException(status_code=400, detail="No test cases configured for this rule")

    results = []
    passed_count = 0

    for tc in test_cases:
        try:
            eval_res = DeterministicRuleEngine.evaluate(ver.dsl_definition, tc.input_payload)
            action = eval_res.get("action", {})
            
            matched = (
                action.get("decision") == tc.expected_outcome.get("decision") and
                action.get("risk_weight") == tc.expected_outcome.get("risk_weight")
            )
            if matched:
                passed_count += 1

            results.append({
                "test_case_id": tc.id,
                "name": tc.name,
                "input_payload": tc.input_payload,
                "expected": tc.expected_outcome,
                "actual": action,
                "matched_step": eval_res.get("matched_step_id"),
                "status": "PASS" if matched else "FAIL",
                "triggered_clauses": eval_res.get("triggered_clauses", [])
            })
        except Exception as e:
            results.append({
                "test_case_id": tc.id,
                "name": tc.name,
                "input_payload": tc.input_payload,
                "expected": tc.expected_outcome,
                "actual": {"error": str(e)},
                "status": "FAIL"
            })

    all_passed = (passed_count == len(test_cases))
    test_run = TestRun(
        id=str(uuid.uuid4()),
        rule_version_id=ver.id,
        executed_by_id=current_user.id,
        total_tests=len(test_cases),
        passed_tests=passed_count,
        failed_tests=len(test_cases) - passed_count,
        status="PASSED" if all_passed else "FAILED",
        results_detail=results,
        executed_at=datetime.utcnow()
    )
    db.add(test_run)

    # Workflow state update: Rule status becomes TESTED only if 100% tests passed
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if rule:
        rule.status = "TESTED" if all_passed else "DRAFT"

    db.commit()

    log_audit(
        db,
        event_type="TEST_SUITE_RUN",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="TEST_RUN",
        entity_id=test_run.id,
        action=f"Executed Test Suite: {test_run.status} ({passed_count}/{len(test_cases)})",
        details={"version": ver.version_number, "passed": passed_count, "failed": test_run.failed_tests}
    )

    return test_run

@router.get("/rules/{rule_id}/versions/{version_id}/test-runs", response_model=List[TestRunRead])
def get_version_test_runs(rule_id: str, version_id: str, db: Session = Depends(get_db)):
    return db.query(TestRun).filter(TestRun.rule_version_id == version_id).order_by(desc(TestRun.executed_at)).all()

@router.post("/impact/simulate", response_model=ImpactReportRead)
def simulate_impact(
    req: ImpactSimulateRequest,
    current_user: User = Depends(require_permission("impact:simulate")),
    db: Session = Depends(get_db)
):
    base_ver = db.query(RuleVersion).filter(RuleVersion.id == req.baseline_version_id).first()
    cand_ver = db.query(RuleVersion).filter(RuleVersion.id == req.candidate_version_id).first()

    if not base_ver or not cand_ver:
        raise HTTPException(status_code=404, detail="Baseline or Candidate rule version not found")

    dataset = generate_synthetic_dataset(count=100)
    comparison = ImpactComparator.compare_versions(
        base_ver.dsl_definition,
        cand_ver.dsl_definition,
        dataset
    )

    report = ImpactReport(
        id=str(uuid.uuid4()),
        baseline_version_id=base_ver.id,
        candidate_version_id=cand_ver.id,
        dataset_version=req.dataset_version or "SYNTHETIC_RETAIL_LOANS_2026_Q1",
        total_evaluated=comparison["total_evaluated"],
        unchanged_count=comparison["unchanged_count"],
        changed_count=comparison["changed_count"],
        differences=comparison["changed_cases"],
        synthetic_disclosure="Simulated portfolio of 100 synthetic retail credit borrower profiles. Not actual production banking records.",
        generated_at=datetime.utcnow()
    )
    db.add(report)
    db.commit()

    log_audit(
        db,
        event_type="IMPACT_SIMULATED",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="IMPACT_REPORT",
        entity_id=report.id,
        action=f"Executed Impact Simulator ({report.changed_count} changed, {report.unchanged_count} unchanged)",
        details={"baseline": base_ver.version_number, "candidate": cand_ver.version_number, "dataset": report.dataset_version}
    )

    return report

@router.get("/impact/{report_id}", response_model=ImpactReportRead)
def get_impact_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(ImpactReport).filter(ImpactReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Impact report not found")
    return report


# ==========================================
# 8. APPROVAL CENTER & GOVERNANCE
# ==========================================

@router.get("/approvals", response_model=List[ApprovalRead])
def list_approvals(db: Session = Depends(get_db)):
    return db.query(Approval).order_by(desc(Approval.decided_at)).all()

@router.post("/approvals", response_model=ApprovalRead)
def record_approval_decision(
    req: ApprovalCreate,
    current_user: User = Depends(require_permission("approval:decide")),
    db: Session = Depends(get_db)
):
    # Enforce Approver Role
    if current_user.role != "COMPLIANCE_APPROVER":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Permission Denied: User role '{current_user.role}' is not authorized to approve regulatory rule changes. Required role: COMPLIANCE_APPROVER."
        )

    ver = db.query(RuleVersion).filter(RuleVersion.id == req.rule_version_id).first()
    if not ver:
        raise HTTPException(status_code=404, detail="Candidate rule version not found")

    # Separation of duties check: Author must not be Approver
    if ver.created_by_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Separation of Duties Violation: Rule author cannot approve their own rule change."
        )

    # Verification: must reference a passing test run for this exact version
    test_run = db.query(TestRun).filter(
        TestRun.id == req.test_run_id,
        TestRun.rule_version_id == req.rule_version_id
    ).first()
    if not test_run or test_run.status != "PASSED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Governance Violation: An unverified or failing rule version cannot be approved. Exact version must have a verified passing test run."
        )

    approval = Approval(
        id=str(uuid.uuid4()),
        rule_version_id=ver.id,
        test_run_id=test_run.id,
        impact_report_id=req.impact_report_id,
        approver_id=current_user.id,
        decision=req.decision,
        rationale=req.rationale,
        decided_at=datetime.utcnow()
    )
    db.add(approval)

    # State machine transition
    rule = db.query(Rule).filter(Rule.id == ver.rule_id).first()
    if rule:
        if req.decision == "APPROVED":
            rule.status = "APPROVED"
        elif req.decision == "REJECTED":
            rule.status = "REJECTED"
        elif req.decision == "REVISION_REQUESTED":
            rule.status = "DRAFT" # Return to draft for engineer revision

    db.commit()

    log_audit(
        db,
        event_type="APPROVAL_DECISION",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="APPROVAL",
        entity_id=approval.id,
        action=f"Compliance Approval Decision: {req.decision}",
        details={"version": ver.version_number, "decision": req.decision, "rationale": req.rationale, "test_run_id": test_run.id}
    )

    return approval


# ==========================================
# 9. SANDBOX DEPLOYMENT & ROLLBACK
# ==========================================

@router.get("/deployments", response_model=List[DeploymentRead])
def list_deployments(db: Session = Depends(get_db)):
    return db.query(Deployment).order_by(desc(Deployment.deployed_at)).all()

@router.post("/deployments", response_model=DeploymentRead)
def deploy_to_sandbox(
    req: DeploymentCreate,
    current_user: User = Depends(require_permission("sandbox:deploy")),
    db: Session = Depends(get_db)
):
    # Verify approval exists and is approved for this exact version
    approval = db.query(Approval).filter(
        Approval.id == req.approval_id,
        Approval.rule_version_id == req.rule_version_id,
        Approval.decision == "APPROVED"
    ).first()

    if not approval:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Release Gating Violation: Cannot deploy unapproved rule version to sandbox. Exact version must have verified approval."
        )

    ver = db.query(RuleVersion).filter(RuleVersion.id == req.rule_version_id).first()
    if not ver:
        raise HTTPException(status_code=404, detail="Rule version not found")

    deployment = Deployment(
        id=str(uuid.uuid4()),
        rule_version_id=ver.id,
        approval_id=approval.id,
        environment=settings.SANDBOX_ENVIRONMENT,
        status="DEPLOYED",
        deployed_by_id=current_user.id,
        deployed_at=datetime.utcnow(),
        notes=req.notes or f"Automated sandbox release of approved version {ver.version_number}"
    )
    db.add(deployment)

    rule = db.query(Rule).filter(Rule.id == ver.rule_id).first()
    if rule:
        rule.status = "DEPLOYED"

    db.commit()

    log_audit(
        db,
        event_type="SANDBOX_DEPLOYED",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="DEPLOYMENT",
        entity_id=deployment.id,
        action=f"Released to Sandbox Environment ({settings.SANDBOX_ENVIRONMENT})",
        details={"version": ver.version_number, "environment": settings.SANDBOX_ENVIRONMENT}
    )

    return deployment

@router.post("/deployments/rollback", response_model=DeploymentRead)
def rollback_deployment(
    req: RollbackRequest,
    current_user: User = Depends(require_permission("sandbox:rollback")),
    db: Session = Depends(get_db)
):
    dep = db.query(Deployment).filter(Deployment.id == req.deployment_id).first()
    if not dep:
        raise HTTPException(status_code=404, detail="Deployment record not found")

    target_ver = db.query(RuleVersion).filter(RuleVersion.id == req.target_version_id).first()
    if not target_ver:
        raise HTTPException(status_code=404, detail="Rollback target version not found")

    # Mark current deployment as rolled back
    dep.status = "ROLLED_BACK"
    dep.rollback_at = datetime.utcnow()

    # Create new deployment record pointing to target version
    new_deployment = Deployment(
        id=str(uuid.uuid4()),
        rule_version_id=target_ver.id,
        approval_id=dep.approval_id,
        environment=settings.SANDBOX_ENVIRONMENT,
        status="DEPLOYED",
        deployed_by_id=current_user.id,
        deployed_at=datetime.utcnow(),
        rollback_of_id=dep.id,
        notes=f"Rollback to known-good version {target_ver.version_number}. Reason: {req.reason}"
    )
    db.add(new_deployment)

    rule = db.query(Rule).filter(Rule.id == target_ver.rule_id).first()
    if rule:
        rule.current_version_id = target_ver.id
        rule.status = "ROLLED_BACK"

    db.commit()

    log_audit(
        db,
        event_type="SANDBOX_ROLLED_BACK",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="DEPLOYMENT",
        entity_id=new_deployment.id,
        action=f"Rolled Back Sandbox to Version {target_ver.version_number}",
        details={"prior_deployment": dep.id, "target_version": target_ver.version_number, "reason": req.reason}
    )

    return new_deployment


# ==========================================
# 10. ADMIN & USER MANAGEMENT
# ==========================================

@router.put("/admin/users/{user_id}/role")
def update_user_role(
    user_id: str,
    new_role: str = Form(...),
    current_user: User = Depends(require_permission("role:manage")),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    old_role = user.role
    user.role = new_role
    db.commit()

    log_audit(
        db,
        event_type="USER_ROLE_UPDATED",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="USER",
        entity_id=user.id,
        action=f"Changed user {user.username} role from {old_role} to {new_role}",
        details={"user": user.username, "old_role": old_role, "new_role": new_role}
    )
    return {"status": "success", "user_id": user.id, "new_role": new_role}

@router.put("/admin/users/{user_id}/status")
def update_user_status(
    user_id: str,
    is_active: bool = Form(...),
    current_user: User = Depends(require_permission("user:manage")),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = is_active
    db.commit()

    log_audit(
        db,
        event_type="USER_STATUS_UPDATED",
        actor_id=current_user.id,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        entity_type="USER",
        entity_id=user.id,
        action=f"Changed user {user.username} active status to {is_active}",
        details={"user": user.username, "is_active": is_active}
    )
    return {"status": "success", "user_id": user.id, "is_active": is_active}


# ==========================================
# 11. AUDIT TRAIL & EVIDENCE DOSSIER
# ==========================================

@router.get("/audit", response_model=List[AuditEventRead])
def list_audit_events(
    event_type: Optional[str] = None,
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    q = db.query(AuditEvent)
    if event_type:
        q = q.filter(AuditEvent.event_type == event_type)
    if entity_type:
        q = q.filter(AuditEvent.entity_type == entity_type)
    if entity_id:
        q = q.filter(AuditEvent.entity_id == entity_id)

    return q.order_by(desc(AuditEvent.timestamp)).limit(limit).all()

@router.get("/evidence/{rule_version_id}")
def get_evidence_dossier(rule_version_id: str, db: Session = Depends(get_db)):
    ver = db.query(RuleVersion).filter(RuleVersion.id == rule_version_id).first()
    if not ver:
        raise HTTPException(status_code=404, detail="Rule version not found")

    rule = ver.rule
    policy = rule.policy if rule else None

    mappings = db.query(ObligationMapping).filter(ObligationMapping.policy_id == policy.id).all() if policy else []
    obligations = [m.obligation for m in mappings if m.obligation]
    circulars = list({obl.circular for obl in obligations if obl and obl.circular})

    test_runs = db.query(TestRun).filter(TestRun.rule_version_id == ver.id).order_by(desc(TestRun.executed_at)).all()
    impact_reports = db.query(ImpactReport).filter(ImpactReport.candidate_version_id == ver.id).all()
    approvals = db.query(Approval).filter(Approval.rule_version_id == ver.id).all()
    deployments = db.query(Deployment).filter(Deployment.rule_version_id == ver.id).all()

    audit_events = db.query(AuditEvent).filter(
        (AuditEvent.entity_id == ver.id) |
        (AuditEvent.entity_id == rule.id)
    ).order_by(desc(AuditEvent.timestamp)).all()

    return {
        "rule_version": {
            "id": ver.id,
            "version_number": ver.version_number,
            "rule_code": rule.rule_code if rule else None,
            "rule_name": rule.name if rule else None,
            "change_summary": ver.change_summary,
            "is_valid": ver.is_valid,
            "created_at": ver.created_at
        },
        "policy": {
            "id": policy.id,
            "policy_code": policy.policy_code,
            "title": policy.title,
            "category": policy.category
        } if policy else None,
        "obligations": [
            {
                "id": o.id,
                "code": o.obligation_code,
                "title": o.title,
                "source_page": o.source_page,
                "source_span": o.source_span,
                "extracted_text": o.extracted_text,
                "applicability": o.applicability,
                "reviewer_notes": o.reviewer_notes
            } for o in obligations
        ],
        "circulars": [
            {
                "id": c.id,
                "title": c.title,
                "source_authority": c.source_authority,
                "circular_number": c.circular_number,
                "file_hash": c.file_hash,
                "effective_date": c.effective_date
            } for c in circulars
        ],
        "test_runs": [
            {
                "id": tr.id,
                "total_tests": tr.total_tests,
                "passed_tests": tr.passed_tests,
                "status": tr.status,
                "executed_at": tr.executed_at
            } for tr in test_runs
        ],
        "impact_reports": [
            {
                "id": ir.id,
                "total_evaluated": ir.total_evaluated,
                "changed_count": ir.changed_count,
                "unchanged_count": ir.unchanged_count,
                "dataset_version": ir.dataset_version,
                "synthetic_disclosure": ir.synthetic_disclosure
            } for ir in impact_reports
        ],
        "approvals": [
            {
                "id": a.id,
                "decision": a.decision,
                "rationale": a.rationale,
                "approver_id": a.approver_id,
                "decided_at": a.decided_at
            } for a in approvals
        ],
        "deployments": [
            {
                "id": d.id,
                "environment": d.environment,
                "status": d.status,
                "deployed_at": d.deployed_at,
                "rollback_of_id": d.rollback_of_id
            } for d in deployments
        ],
        "audit_trail_count": len(audit_events)
    }
