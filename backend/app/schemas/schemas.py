from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field

# User
class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    username: str
    full_name: str
    email: str
    role: str
    is_active: bool

# Circular
class DocumentPageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    page_number: int
    text_content: str

class CircularRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    filename: str
    file_hash: Optional[str] = None
    source_authority: str
    circular_number: Optional[str] = None
    publication_date: Optional[str] = None
    effective_date: Optional[str] = None
    status: str
    page_count: int
    created_at: datetime
    obligations_count: Optional[int] = 0

class CircularDetail(CircularRead):
    extracted_text: Optional[str] = None
    pages: List[DocumentPageRead] = []

# Obligation
class ObligationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    circular_id: str
    obligation_code: str
    title: str
    extracted_text: str
    source_page: int
    source_span: Optional[str] = None
    actor: Optional[str] = None
    action: Optional[str] = None
    conditions: Optional[str] = None
    threshold: Optional[str] = None
    deadline: Optional[str] = None
    review_status: str
    applicability: str
    reviewer_notes: Optional[str] = None
    reviewed_by_id: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    flags: List[str] = []
    policy_code: Optional[str] = None
    policy_title: Optional[str] = None

class ObligationReviewUpdate(BaseModel):
    title: Optional[str] = None
    actor: Optional[str] = None
    action: Optional[str] = None
    conditions: Optional[str] = None
    threshold: Optional[str] = None
    deadline: Optional[str] = None
    applicability: str # APPLICABLE, NOT_APPLICABLE, UNRESOLVED
    reviewer_notes: Optional[str] = None
    review_status: str = "ACCEPTED" # ACCEPTED, EDITED, REJECTED, UNRESOLVED

# Policy & Mapping
class PolicyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    policy_code: str
    title: str
    category: str
    description: str
    active_rules_count: int
    version: str

class MappingCreate(BaseModel):
    obligation_id: str
    policy_id: Optional[str] = None # null if marking unmapped
    mapping_status: str = "MAPPED" # MAPPED, UNMAPPED, UNRESOLVED
    match_type: str = "EXACT" # EXACT, PARTIAL, NEW_POLICY_NEEDED, UNMAPPED
    rationale: str

class MappingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    obligation_id: str
    policy_id: Optional[str] = None
    mapping_status: str
    match_type: str
    match_score: float
    rationale: Optional[str] = None
    mapped_at: datetime
    policy: Optional[PolicyRead] = None

# Rule & Rule Versions
class RuleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    rule_code: str
    name: str
    description: str
    policy_id: Optional[str] = None
    category: str
    current_version_id: Optional[str] = None
    status: str
    created_at: datetime

class RuleVersionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    rule_id: str
    version_number: str
    dsl_definition: Dict[str, Any]
    change_summary: Optional[str] = None
    is_valid: bool
    validation_errors: List[str] = []
    created_at: datetime

class RuleValidateRequest(BaseModel):
    dsl_definition: Dict[str, Any]

class RuleValidateResponse(BaseModel):
    is_valid: bool
    errors: List[str]
    validated_version: Optional[str] = None

class RuleDraftCreate(BaseModel):
    version_number: str
    dsl_definition: Dict[str, Any]
    change_summary: str

# Test Execution
class TestCaseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    rule_id: str
    suite_name: str
    name: str
    description: Optional[str] = None
    input_payload: Dict[str, Any]
    expected_outcome: Dict[str, Any]
    is_edge_case: bool

class TestRunRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    rule_version_id: str
    total_tests: int
    passed_tests: int
    failed_tests: int
    status: str
    results_detail: List[Dict[str, Any]]
    executed_at: datetime

# Impact Simulation
class ImpactSimulateRequest(BaseModel):
    baseline_version_id: str
    candidate_version_id: str
    dataset_version: Optional[str] = "SYNTHETIC_RETAIL_LOANS_2026_Q1"

class ImpactReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    baseline_version_id: str
    candidate_version_id: str
    dataset_version: str
    total_evaluated: int
    unchanged_count: int
    changed_count: int
    differences: List[Dict[str, Any]]
    synthetic_disclosure: str
    generated_at: datetime

# Approval
class ApprovalCreate(BaseModel):
    rule_version_id: str
    test_run_id: str
    impact_report_id: Optional[str] = None
    decision: str # APPROVED, REJECTED, REVISION_REQUESTED
    rationale: str

class ApprovalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    rule_version_id: str
    test_run_id: Optional[str] = None
    impact_report_id: Optional[str] = None
    approver_id: str
    decision: str
    rationale: str
    decided_at: datetime

# Deployment & Rollback
class DeploymentCreate(BaseModel):
    rule_version_id: str
    approval_id: str
    notes: Optional[str] = None

class DeploymentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    rule_version_id: str
    approval_id: str
    environment: str
    status: str
    deployed_by_id: str
    deployed_at: datetime
    rollback_of_id: Optional[str] = None
    rollback_at: Optional[datetime] = None
    notes: Optional[str] = None

class RollbackRequest(BaseModel):
    deployment_id: str
    target_version_id: str
    reason: str

# Audit
class AuditEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    event_type: str
    actor_id: Optional[str] = None
    actor_name: str
    actor_role: str
    entity_type: str
    entity_id: str
    action: str
    details: Dict[str, Any]
    timestamp: datetime
