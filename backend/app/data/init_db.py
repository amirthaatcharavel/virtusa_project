"""
Database Initialization & Seeder.
Creates tables and seeds initial demo users, policies, circulars, rules, and test suites.
"""

from datetime import datetime
import json
from sqlalchemy.orm import Session
from app.core.database import engine, Base, SessionLocal
from app.models.models import (
    User, Circular, DocumentPage, Obligation, Policy,
    ObligationMapping, Rule, RuleVersion, TestCase, TestRun,
    ImpactReport, AuditEvent
)
from app.data.seed_data import (
    SAMPLE_CIRCULAR_TEXT_P1, SAMPLE_CIRCULAR_TEXT_P2,
    BASELINE_RULE_DSL, CANDIDATE_RULE_DSL, generate_synthetic_dataset
)
from app.engine.impact_comparator import ImpactComparator
from app.engine.rule_dsl import DeterministicRuleEngine

def init_db():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if users already exist
        if db.query(User).count() > 0:
            return

        print("Seeding database with regulatory compliance fixtures...")

        # 1. Users
        users = [
            User(id="usr-analyst-01", username="analyst_maya", full_name="Maya Sen", email="maya.sen@compliance.bank.internal", role="COMPLIANCE_ANALYST"),
            User(id="usr-approver-01", username="approver_vikram", full_name="Vikram Mehta", email="vikram.mehta@compliance.bank.internal", role="COMPLIANCE_APPROVER"),
            User(id="usr-engineer-01", username="engineer_arun", full_name="Arun Patel", email="arun.patel@engineering.bank.internal", role="RULE_ENGINEER"),
            User(id="usr-admin-01", username="admin_elena", full_name="Elena Rostova", email="elena.rostova@risk.bank.internal", role="PLATFORM_ADMIN"),
        ]
        db.add_all(users)
        db.commit()

        # 2. Policies
        policies = [
            Policy(
                id="pol-01",
                policy_code="POL-CR-01",
                title="Retail Credit Risk & Capital Adequacy Policy",
                category="Credit Risk & Capital Management",
                description="Governs risk-weight assignment, Tier-1 capital conservation buffers, and capital adequacy ratio (CAR) computations for all retail consumer credit assets.",
                active_rules_count=3,
                version="2.4"
            ),
            Policy(
                id="pol-02",
                policy_code="POL-UW-04",
                title="Debt Serviceability & DTI Underwriting Standards",
                category="Credit Underwriting & Risk Appetite",
                description="Defines permissible Debt-to-Income (DTI) bounds, maximum allowable installment-to-income ratios, and mandatory proof-of-income validation rules.",
                active_rules_count=2,
                version="1.8"
            ),
            Policy(
                id="pol-03",
                policy_code="POL-PSL-12",
                title="Priority Sector Lending & Financial Inclusion Framework",
                category="Statutory Compliance & Inclusion",
                description="Preserves statutory exemptions, sub-target tracking, and subsidized risk treatment for Self-Help Groups (SHGs) and microfinance portfolios.",
                active_rules_count=1,
                version="3.0"
            ),
            Policy(
                id="pol-04",
                policy_code="POL-AML-08",
                title="Anti-Money Laundering & Source of Funds Verification",
                category="Financial Crime Prevention",
                description="Mandates beneficial ownership discovery and automated pre-disbursal sanction screening against domestic and global watchlists.",
                active_rules_count=4,
                version="4.1"
            )
        ]
        db.add_all(policies)
        db.commit()

        # 3. Sample Circular
        circular = Circular(
            id="circ-rbi-2026-84",
            title="Regulatory Measures on Consumer Credit, Capital Adequacy and Risk-Weight Calibration",
            filename="RBI_Circular_2026_84_Consumer_Credit.pdf",
            file_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            source_authority="Reserve Bank of India",
            circular_number="RBI/2026-27/84",
            publication_date="2026-03-15",
            effective_date="2026-06-30",
            status="PARSED",
            page_count=2,
            extracted_text=SAMPLE_CIRCULAR_TEXT_P1 + "\n" + SAMPLE_CIRCULAR_TEXT_P2
        )
        db.add(circular)
        db.commit()

        # Circular Pages
        page1 = DocumentPage(id="pg-01", circular_id=circular.id, page_number=1, text_content=SAMPLE_CIRCULAR_TEXT_P1.strip())
        page2 = DocumentPage(id="pg-02", circular_id=circular.id, page_number=2, text_content=SAMPLE_CIRCULAR_TEXT_P2.strip())
        db.add_all([page1, page2])
        db.commit()

        # 4. Obligations
        obl1 = Obligation(
            id="obl-01",
            circular_id=circular.id,
            obligation_code="OBL-CR-001",
            title="Enhanced 125% Risk Weight Surcharge on Unsecured Retail Credit",
            extracted_text="Consumer credit exposures of commercial banks (outstanding as well as new) shall attract a risk weight of 125% where individual borrower commitments exceed INR 50,000 or credit bureau score is below 700.",
            source_page=1,
            source_span="Section 3(a), Paragraph 1, Lines 12-19",
            actor="All Scheduled Commercial Banks and Tier 1/2 NBFCs",
            action="Apply 125% risk weight and enforce additional 2.5% Tier-1 capital conservation buffer",
            conditions="Loan Type == UNSECURED_PERSONAL AND (Loan Amount > INR 50,000 OR Bureau Credit Score < 700)",
            threshold="Loan Amount > INR 50,000; Risk Weight 125%; Buffer 2.5%",
            deadline="2026-06-30",
            review_status="ACCEPTED",
            applicability="APPLICABLE",
            reviewer_notes="Confirmed applicable to bank's Retail Assets Division. Material impact on Personal Loan portfolio capital consumption.",
            reviewed_by_id="usr-analyst-01",
            reviewed_at=datetime.utcnow(),
            flags=["Statutory priority sector microfinance must be explicitly exempted in rule logic"]
        )
        obl2 = Obligation(
            id="obl-02",
            circular_id=circular.id,
            obligation_code="OBL-CR-002",
            title="Mandatory Pre-Disbursal Debt-to-Income (DTI) Cap at 50%",
            extracted_text="Total verified monthly debt repayment obligations, inclusive of the proposed new sanction, shall not exceed 50.0% of applicant's validated net monthly income for sanctions exceeding INR 200,000.",
            source_page=2,
            source_span="Section 4, Sub-clause (a)-(b)",
            actor="Credit Underwriting & Retail Operations",
            action="Enforce strict algorithmic hard-stop rejection when aggregate DTI exceeds 50.0%",
            conditions="Loan Amount > INR 200,000 AND Debt-to-Income Ratio > 0.50",
            threshold="DTI Cap <= 50.0%; Threshold INR 200,000",
            deadline="2026-06-30",
            review_status="ACCEPTED",
            applicability="APPLICABLE",
            reviewer_notes="Requires integration with Credit Bureau CIC automated pull 72h prior to disbursal.",
            reviewed_by_id="usr-analyst-01",
            reviewed_at=datetime.utcnow(),
            flags=["Seasonal agricultural borrower income smoothing rules need clarification"]
        )
        obl3 = Obligation(
            id="obl-03",
            circular_id=circular.id,
            obligation_code="OBL-CR-003",
            title="Statutory Exemption for Priority Sector & SHG Microfinance",
            extracted_text="Qualifying Self-Help Group (SHG) and Joint Liability Group (JLG) advances under priority sector lending guidelines shall continue to be risk-weighted at the standard baseline of 100%.",
            source_page=2,
            source_span="Section 5, Sub-clauses (a)-(b)",
            actor="Microfinance & Inclusive Banking Business Unit",
            action="Preserve baseline 100% risk weight and exempt from enhanced capital conservation surcharge",
            conditions="is_regulatory_exempt == true",
            threshold="Full exemption for qualifying priority sector credit",
            deadline="2026-06-30",
            review_status="PENDING",
            applicability="UNRESOLVED",
            reviewer_notes="Pending verification from Rural Lending Head regarding annual household income documentation criteria.",
            reviewed_by_id=None,
            reviewed_at=None,
            flags=["Unresolved: documentation standards for household income < INR 300,000"]
        )
        db.add_all([obl1, obl2, obl3])
        db.commit()

        # 5. Obligation Mapping
        mapping1 = ObligationMapping(
            id="map-01",
            obligation_id=obl1.id,
            policy_id="pol-01",
            mapping_status="MAPPED",
            match_type="EXACT",
            match_score=0.96,
            rationale="Directly maps to POL-CR-01 (Retail Credit Risk & Capital Adequacy Policy, Section 4.2: Risk Weight Schedules).",
            mapped_by_id="usr-analyst-01",
            mapped_at=datetime.utcnow()
        )
        mapping2 = ObligationMapping(
            id="map-02",
            obligation_id=obl2.id,
            policy_id="pol-02",
            mapping_status="MAPPED",
            match_type="EXACT",
            match_score=0.92,
            rationale="Directly maps to POL-UW-04 (Debt Serviceability & DTI Underwriting Standards).",
            mapped_by_id="usr-analyst-01",
            mapped_at=datetime.utcnow()
        )
        db.add_all([mapping1, mapping2])
        db.commit()

        # 6. Rule and Rule Versions
        rule = Rule(
            id="rule-cr-01",
            rule_code="RULE-CR-2026-01",
            name="Unsecured Retail Credit Risk Weight & Capital Buffer Rule",
            description="Computes regulatory risk weight and Tier-1 capital conservation buffer for retail credit based on RBI Circular 2026/84.",
            policy_id="pol-01",
            category="Capital Adequacy & Credit Risk",
            status="TESTED"
        )
        db.add(rule)
        db.commit()

        # Baseline Version (v1.0.0)
        v_base = RuleVersion(
            id="ver-base-01",
            rule_id=rule.id,
            version_number="1.0.0",
            dsl_definition=BASELINE_RULE_DSL,
            change_summary="Original baseline: Flat 100% risk weight across all unsecured credit facilities.",
            is_valid=True,
            validation_errors=[],
            created_by_id="usr-engineer-01",
            created_at=datetime(2025, 1, 10, 10, 0, 0)
        )
        # Candidate Version (v1.1.0-draft)
        v_cand = RuleVersion(
            id="ver-cand-01",
            rule_id=rule.id,
            version_number="1.1.0-draft",
            dsl_definition=CANDIDATE_RULE_DSL,
            change_summary="Implements RBI/2026-27/84: Enhanced 125% risk weight and 2.5% buffer for unsecured loans > 50,000 or credit score < 700; preserves statutory priority sector exemption.",
            is_valid=True,
            validation_errors=[],
            created_by_id="usr-engineer-01",
            created_at=datetime.utcnow()
        )
        db.add_all([v_base, v_cand])
        db.commit()

        rule.current_version_id = v_cand.id
        db.commit()

        # 7. Test Cases for Rule
        test_cases = [
            TestCase(
                id="tc-01",
                rule_id=rule.id,
                suite_name="RBI 2026/84 Regression Suite",
                name="TC-01: Low-ticket Prime Unsecured (<= 50k, Score >= 700)",
                description="Verifies low ticket prime borrower retains standard 100% risk weight.",
                input_payload={
                    "loan_type": "UNSECURED_PERSONAL",
                    "loan_amount": 35000,
                    "borrower_credit_score": 760,
                    "debt_to_income_ratio": 0.32,
                    "is_regulatory_exempt": False
                },
                expected_outcome={
                    "decision": "STANDARD_RISK",
                    "risk_weight": 100,
                    "additional_buffer_percent": 0.0,
                    "compliance_flag": "STANDARD_LOW_TICKET_COMPLIANT"
                },
                is_edge_case=False
            ),
            TestCase(
                id="tc-02",
                rule_id=rule.id,
                suite_name="RBI 2026/84 Regression Suite",
                name="TC-02: Enhanced Surcharge on Unsecured Loan > 50,000",
                description="Verifies unsecured loan exceeding INR 50,000 triggers 125% risk weight.",
                input_payload={
                    "loan_type": "UNSECURED_PERSONAL",
                    "loan_amount": 120000,
                    "borrower_credit_score": 740,
                    "debt_to_income_ratio": 0.40,
                    "is_regulatory_exempt": False
                },
                expected_outcome={
                    "decision": "ENHANCED_RISK_WEIGHT",
                    "risk_weight": 125,
                    "additional_buffer_percent": 2.5,
                    "compliance_flag": "MANDATORY_REGULATORY_SURCHARGE"
                },
                is_edge_case=False
            ),
            TestCase(
                id="tc-03",
                rule_id=rule.id,
                suite_name="RBI 2026/84 Regression Suite",
                name="TC-03: Sub-700 Credit Score Surcharge (< 50k)",
                description="Verifies unsecured credit with score < 700 triggers 125% risk weight even if loan <= 50,000.",
                input_payload={
                    "loan_type": "UNSECURED_PERSONAL",
                    "loan_amount": 42000,
                    "borrower_credit_score": 660,
                    "debt_to_income_ratio": 0.44,
                    "is_regulatory_exempt": False
                },
                expected_outcome={
                    "decision": "ENHANCED_RISK_WEIGHT",
                    "risk_weight": 125,
                    "additional_buffer_percent": 2.5,
                    "compliance_flag": "MANDATORY_REGULATORY_SURCHARGE"
                },
                is_edge_case=False
            ),
            TestCase(
                id="tc-04",
                rule_id=rule.id,
                suite_name="RBI 2026/84 Regression Suite",
                name="TC-04: Statutory Priority Sector Exemption Overrides Surcharge",
                description="Verifies microfinance borrower with is_regulatory_exempt=true retains standard 100% risk weight.",
                input_payload={
                    "loan_type": "UNSECURED_PERSONAL",
                    "loan_amount": 80000,
                    "borrower_credit_score": 640,
                    "debt_to_income_ratio": 0.35,
                    "is_regulatory_exempt": True
                },
                expected_outcome={
                    "decision": "STANDARD_RISK",
                    "risk_weight": 100,
                    "additional_buffer_percent": 0.0,
                    "compliance_flag": "PRIORITY_SECTOR_EXEMPT"
                },
                is_edge_case=False
            ),
            TestCase(
                id="tc-05",
                rule_id=rule.id,
                suite_name="RBI 2026/84 Regression Suite",
                name="TC-05: Exact Threshold Boundary Test (Loan = 50,000, Score = 700)",
                description="Edge case test at strict mathematical boundary of INR 50,000 and 700 credit score.",
                input_payload={
                    "loan_type": "UNSECURED_PERSONAL",
                    "loan_amount": 50000,
                    "borrower_credit_score": 700,
                    "debt_to_income_ratio": 0.30,
                    "is_regulatory_exempt": False
                },
                expected_outcome={
                    "decision": "STANDARD_RISK",
                    "risk_weight": 100,
                    "additional_buffer_percent": 0.0,
                    "compliance_flag": "STANDARD_LOW_TICKET_COMPLIANT"
                },
                is_edge_case=True
            )
        ]
        db.add_all(test_cases)
        db.commit()

        # 8. Deterministic Test Run on Candidate Version
        test_results = []
        passed_count = 0
        for tc in test_cases:
            eval_res = DeterministicRuleEngine.evaluate(CANDIDATE_RULE_DSL, tc.input_payload)
            action = eval_res.get("action", {})
            passed = (
                action.get("decision") == tc.expected_outcome.get("decision") and
                action.get("risk_weight") == tc.expected_outcome.get("risk_weight")
            )
            if passed:
                passed_count += 1
            test_results.append({
                "test_case_id": tc.id,
                "name": tc.name,
                "input_payload": tc.input_payload,
                "expected": tc.expected_outcome,
                "actual": action,
                "matched_step": eval_res.get("matched_step_id"),
                "status": "PASS" if passed else "FAIL"
            })

        test_run = TestRun(
            id="tr-01",
            rule_version_id=v_cand.id,
            executed_by_id="usr-engineer-01",
            total_tests=len(test_cases),
            passed_tests=passed_count,
            failed_tests=len(test_cases) - passed_count,
            status="PASSED" if passed_count == len(test_cases) else "FAILED",
            results_detail=test_results,
            executed_at=datetime.utcnow()
        )
        db.add(test_run)
        db.commit()

        # 9. Deterministic Impact Report Comparing Baseline vs Candidate
        synthetic_data = generate_synthetic_dataset(100)
        impact_summary = ImpactComparator.compare_versions(BASELINE_RULE_DSL, CANDIDATE_RULE_DSL, synthetic_data)

        impact_report = ImpactReport(
            id="ir-01",
            baseline_version_id=v_base.id,
            candidate_version_id=v_cand.id,
            dataset_version="SYNTHETIC_RETAIL_LOANS_2026_Q1",
            total_evaluated=impact_summary["total_evaluated"],
            unchanged_count=impact_summary["unchanged_count"],
            changed_count=impact_summary["changed_count"],
            differences=impact_summary["changed_cases"],
            synthetic_disclosure="Simulated portfolio of 100 synthetic retail credit borrower profiles. Not actual production banking records.",
            generated_at=datetime.utcnow()
        )
        db.add(impact_report)
        db.commit()

        # 10. Audit Trail Initial Entries
        audit_events = [
            AuditEvent(
                id="aud-01",
                event_type="CIRCULAR_INGESTION",
                actor_id="usr-analyst-01",
                actor_name="Maya Sen",
                actor_role="COMPLIANCE_ANALYST",
                entity_type="CIRCULAR",
                entity_id=circular.id,
                action="Ingested & Parsed PDF Document",
                details={"file": circular.filename, "pages": circular.page_count, "hash": circular.file_hash},
                timestamp=datetime(2026, 3, 16, 9, 30, 0)
            ),
            AuditEvent(
                id="aud-02",
                event_type="OBLIGATION_EXTRACTED",
                actor_id="usr-analyst-01",
                actor_name="Maya Sen",
                actor_role="COMPLIANCE_ANALYST",
                entity_type="OBLIGATION",
                entity_id=obl1.id,
                action="Extracted Candidate Regulatory Obligation",
                details={"code": obl1.obligation_code, "source_page": obl1.source_page},
                timestamp=datetime(2026, 3, 16, 9, 35, 0)
            ),
            AuditEvent(
                id="aud-03",
                event_type="POLICY_MAPPED",
                actor_id="usr-analyst-01",
                actor_name="Maya Sen",
                actor_role="COMPLIANCE_ANALYST",
                entity_type="OBLIGATION_MAPPING",
                entity_id=mapping1.id,
                action="Mapped Obligation to Internal Policy POL-CR-01",
                details={"match_score": 0.96, "policy": "POL-CR-01"},
                timestamp=datetime(2026, 3, 16, 10, 15, 0)
            ),
            AuditEvent(
                id="aud-04",
                event_type="RULE_VERSION_DRAFTED",
                actor_id="usr-engineer-01",
                actor_name="Arun Patel",
                actor_role="RULE_ENGINEER",
                entity_type="RULE_VERSION",
                entity_id=v_cand.id,
                action="Drafted Candidate Rule Version 1.1.0-draft",
                details={"version": "1.1.0-draft", "rule_id": rule.rule_code},
                timestamp=datetime(2026, 3, 16, 11, 0, 0)
            ),
            AuditEvent(
                id="aud-05",
                event_type="TEST_SUITE_EXECUTED",
                actor_id="usr-engineer-01",
                actor_name="Arun Patel",
                actor_role="RULE_ENGINEER",
                entity_type="TEST_RUN",
                entity_id=test_run.id,
                action="Executed Regression Test Suite (5/5 Passed)",
                details={"passed": 5, "total": 5, "status": "PASSED"},
                timestamp=datetime(2026, 3, 16, 11, 45, 0)
            ),
            AuditEvent(
                id="aud-06",
                event_type="IMPACT_SIMULATED",
                actor_id="usr-engineer-01",
                actor_name="Arun Patel",
                actor_role="RULE_ENGINEER",
                entity_type="IMPACT_REPORT",
                entity_id=impact_report.id,
                action="Generated Baseline vs Candidate Impact Analysis",
                details={"total": 100, "changed": impact_summary["changed_count"], "unchanged": impact_summary["unchanged_count"]},
                timestamp=datetime(2026, 3, 16, 12, 10, 0)
            )
        ]
        db.add_all(audit_events)
        db.commit()

        print("Database successfully initialized with full regulatory change lifecycle data.")
    finally:
        db.close()
