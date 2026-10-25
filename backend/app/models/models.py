import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(50), nullable=False) # COMPLIANCE_ANALYST, COMPLIANCE_APPROVER, RULE_ENGINEER, PLATFORM_ADMIN
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Circular(Base):
    __tablename__ = "circulars"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    filename = Column(String(255), nullable=False)
    file_hash = Column(String(64), nullable=True)
    source_authority = Column(String(100), nullable=False) # e.g. Reserve Bank of India, EBA, FinCEN
    circular_number = Column(String(100), nullable=True)
    publication_date = Column(String(50), nullable=True)
    effective_date = Column(String(50), nullable=True)
    status = Column(String(50), default="PARSED") # UPLOADED, PARSING, PARSED, FAILED
    page_count = Column(Integer, default=1)
    extracted_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    pages = relationship("DocumentPage", back_populates="circular", cascade="all, delete-orphan")
    obligations = relationship("Obligation", back_populates="circular", cascade="all, delete-orphan")

class DocumentPage(Base):
    __tablename__ = "document_pages"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    circular_id = Column(String(36), ForeignKey("circulars.id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    text_content = Column(Text, nullable=False)

    circular = relationship("Circular", back_populates="pages")

class Obligation(Base):
    __tablename__ = "obligations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    circular_id = Column(String(36), ForeignKey("circulars.id"), nullable=False)
    obligation_code = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    extracted_text = Column(Text, nullable=False)
    source_page = Column(Integer, nullable=False)
    source_span = Column(String(255), nullable=True)
    actor = Column(String(255), nullable=True)
    action = Column(String(255), nullable=True)
    conditions = Column(Text, nullable=True)
    threshold = Column(String(255), nullable=True)
    deadline = Column(String(100), nullable=True)
    review_status = Column(String(50), default="PENDING") # PENDING, ACCEPTED, EDITED, REJECTED, UNRESOLVED
    applicability = Column(String(50), default="UNRESOLVED") # APPLICABLE, NOT_APPLICABLE, UNRESOLVED
    reviewer_notes = Column(Text, nullable=True)
    reviewed_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    flags = Column(JSON, default=list) # e.g. ["Ambiguous effective deadline", "Implicit exception"]

    circular = relationship("Circular", back_populates="obligations")
    mapping = relationship("ObligationMapping", back_populates="obligation", uselist=False)

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    policy_code = Column(String(50), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    active_rules_count = Column(Integer, default=1)
    version = Column(String(20), default="1.0")

class ObligationMapping(Base):
    __tablename__ = "obligation_mappings"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    obligation_id = Column(String(36), ForeignKey("obligations.id"), nullable=False, unique=True)
    policy_id = Column(String(36), ForeignKey("policies.id"), nullable=True)
    mapping_status = Column(String(50), default="MAPPED") # MAPPED, UNMAPPED, UNRESOLVED
    match_type = Column(String(50), default="EXACT") # EXACT, PARTIAL, NEW_POLICY_NEEDED, UNMAPPED
    match_score = Column(Float, default=1.0)
    rationale = Column(Text, nullable=True)
    mapped_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    mapped_at = Column(DateTime, default=datetime.utcnow)

    obligation = relationship("Obligation", back_populates="mapping")
    policy = relationship("Policy")

class Rule(Base):
    __tablename__ = "rules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_code = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    policy_id = Column(String(36), ForeignKey("policies.id"), nullable=True)
    category = Column(String(100), nullable=False)
    current_version_id = Column(String(36), nullable=True)
    status = Column(String(50), default="DRAFT") # DRAFT, VALIDATED, TESTED, PENDING_APPROVAL, APPROVED, DEPLOYED, REJECTED, ROLLED_BACK
    created_at = Column(DateTime, default=datetime.utcnow)

    policy = relationship("Policy")
    versions = relationship("RuleVersion", back_populates="rule", cascade="all, delete-orphan", foreign_keys="RuleVersion.rule_id")

class RuleVersion(Base):
    __tablename__ = "rule_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_id = Column(String(36), ForeignKey("rules.id"), nullable=False)
    version_number = Column(String(50), nullable=False)
    dsl_definition = Column(JSON, nullable=False)
    change_summary = Column(Text, nullable=True)
    is_valid = Column(Boolean, default=False)
    validation_errors = Column(JSON, default=list)
    created_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    rule = relationship("Rule", back_populates="versions", foreign_keys=[rule_id])
    test_runs = relationship("TestRun", back_populates="rule_version")

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_id = Column(String(36), ForeignKey("rules.id"), nullable=False)
    suite_name = Column(String(100), default="Standard Regulatory Baseline Suite")
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    input_payload = Column(JSON, nullable=False)
    expected_outcome = Column(JSON, nullable=False)
    is_edge_case = Column(Boolean, default=False)

class TestRun(Base):
    __tablename__ = "test_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_version_id = Column(String(36), ForeignKey("rule_versions.id"), nullable=False)
    executed_by_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    total_tests = Column(Integer, default=0)
    passed_tests = Column(Integer, default=0)
    failed_tests = Column(Integer, default=0)
    status = Column(String(50), default="PASSED") # PASSED, FAILED
    results_detail = Column(JSON, default=list)
    executed_at = Column(DateTime, default=datetime.utcnow)

    rule_version = relationship("RuleVersion", back_populates="test_runs")

class ImpactReport(Base):
    __tablename__ = "impact_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    baseline_version_id = Column(String(36), ForeignKey("rule_versions.id"), nullable=False)
    candidate_version_id = Column(String(36), ForeignKey("rule_versions.id"), nullable=False)
    dataset_version = Column(String(50), default="SYNTHETIC_RETAIL_LOANS_2026_Q1")
    total_evaluated = Column(Integer, default=0)
    unchanged_count = Column(Integer, default=0)
    changed_count = Column(Integer, default=0)
    differences = Column(JSON, default=list)
    synthetic_disclosure = Column(Text, default="Simulated portfolio of 200 synthetic retail credit borrower profiles. Not actual production banking records.")
    generated_at = Column(DateTime, default=datetime.utcnow)

class Approval(Base):
    __tablename__ = "approvals"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_version_id = Column(String(36), ForeignKey("rule_versions.id"), nullable=False)
    test_run_id = Column(String(36), ForeignKey("test_runs.id"), nullable=True)
    impact_report_id = Column(String(36), ForeignKey("impact_reports.id"), nullable=True)
    approver_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    decision = Column(String(50), nullable=False) # APPROVED, REJECTED, REVISION_REQUESTED
    rationale = Column(Text, nullable=False)
    decided_at = Column(DateTime, default=datetime.utcnow)

class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rule_version_id = Column(String(36), ForeignKey("rule_versions.id"), nullable=False)
    approval_id = Column(String(36), ForeignKey("approvals.id"), nullable=False)
    environment = Column(String(50), default="SANDBOX")
    status = Column(String(50), default="DEPLOYED") # DEPLOYED, FAILED, ROLLED_BACK
    deployed_by_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    deployed_at = Column(DateTime, default=datetime.utcnow)
    rollback_of_id = Column(String(36), nullable=True)
    rollback_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    event_type = Column(String(100), nullable=False)
    actor_id = Column(String(36), nullable=True)
    actor_name = Column(String(100), nullable=False)
    actor_role = Column(String(50), nullable=False)
    entity_type = Column(String(50), nullable=False) # CIRCULAR, OBLIGATION, RULE, APPROVAL, DEPLOYMENT
    entity_id = Column(String(36), nullable=False)
    action = Column(String(100), nullable=False)
    details = Column(JSON, default=dict)
    timestamp = Column(DateTime, default=datetime.utcnow)
