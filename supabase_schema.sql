-- ========================================================================
-- Regulatory Change Intelligence Platform - Supabase PostgreSQL Schema & Seed
-- ========================================================================
-- Execute this entire script in your Supabase Project's SQL Editor
-- (https://supabase.com/dashboard/project/<your-project-id>/sql)
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL, -- COMPLIANCE_ANALYST, COMPLIANCE_APPROVER, RULE_ENGINEER, PLATFORM_ADMIN
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CIRCULARS TABLE
CREATE TABLE IF NOT EXISTS circulars (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_hash VARCHAR(64),
    source_authority VARCHAR(100) NOT NULL,
    circular_number VARCHAR(100),
    publication_date VARCHAR(50),
    effective_date VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PARSED',
    page_count INTEGER DEFAULT 1,
    extracted_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DOCUMENT PAGES TABLE
CREATE TABLE IF NOT EXISTS document_pages (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    circular_id VARCHAR(36) NOT NULL REFERENCES circulars(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    text_content TEXT NOT NULL
);

-- 4. OBLIGATIONS TABLE
CREATE TABLE IF NOT EXISTS obligations (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    circular_id VARCHAR(36) NOT NULL REFERENCES circulars(id) ON DELETE CASCADE,
    obligation_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    extracted_text TEXT NOT NULL,
    source_page INTEGER NOT NULL,
    source_span VARCHAR(255),
    actor VARCHAR(255),
    action VARCHAR(255),
    conditions TEXT,
    threshold VARCHAR(255),
    deadline VARCHAR(100),
    review_status VARCHAR(50) DEFAULT 'PENDING',
    applicability VARCHAR(50) DEFAULT 'UNRESOLVED',
    reviewer_notes TEXT,
    reviewed_by_id VARCHAR(36) REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    flags JSONB DEFAULT '[]'::jsonb
);

-- 5. POLICIES TABLE
CREATE TABLE IF NOT EXISTS policies (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    policy_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    active_rules_count INTEGER DEFAULT 1,
    version VARCHAR(20) DEFAULT '1.0'
);

-- 6. OBLIGATION MAPPINGS TABLE
CREATE TABLE IF NOT EXISTS obligation_mappings (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    obligation_id VARCHAR(36) NOT NULL UNIQUE REFERENCES obligations(id) ON DELETE CASCADE,
    policy_id VARCHAR(36) REFERENCES policies(id),
    mapping_status VARCHAR(50) DEFAULT 'MAPPED',
    match_type VARCHAR(50) DEFAULT 'EXACT',
    match_score FLOAT DEFAULT 1.0,
    rationale TEXT,
    mapped_by_id VARCHAR(36) REFERENCES users(id),
    mapped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RULES TABLE
CREATE TABLE IF NOT EXISTS rules (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    rule_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    policy_id VARCHAR(36) REFERENCES policies(id),
    status VARCHAR(50) DEFAULT 'CANDIDATE_DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. RULE VERSIONS TABLE
CREATE TABLE IF NOT EXISTS rule_versions (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    rule_id VARCHAR(36) NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
    version_number VARCHAR(20) NOT NULL,
    rule_dsl JSONB NOT NULL,
    change_summary TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    created_by_id VARCHAR(36) REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TEST CASES TABLE
CREATE TABLE IF NOT EXISTS test_cases (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    rule_id VARCHAR(36) NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    input_payload JSONB NOT NULL,
    expected_output JSONB NOT NULL,
    is_edge_case BOOLEAN DEFAULT FALSE
);

-- 10. TEST RUNS TABLE
CREATE TABLE IF NOT EXISTS test_runs (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    rule_version_id VARCHAR(36) NOT NULL REFERENCES rule_versions(id) ON DELETE CASCADE,
    passed_tests INTEGER DEFAULT 0,
    failed_tests INTEGER DEFAULT 0,
    total_tests INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PASSED',
    execution_time_ms FLOAT DEFAULT 0.0,
    details JSONB DEFAULT '[]'::jsonb,
    executed_by_id VARCHAR(36) REFERENCES users(id),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. IMPACT REPORTS TABLE
CREATE TABLE IF NOT EXISTS impact_reports (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    rule_id VARCHAR(36) NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
    baseline_version_id VARCHAR(36) REFERENCES rule_versions(id),
    candidate_version_id VARCHAR(36) REFERENCES rule_versions(id),
    total_evaluated INTEGER DEFAULT 100,
    changed_count INTEGER DEFAULT 0,
    unchanged_count INTEGER DEFAULT 0,
    differences JSONB DEFAULT '[]'::jsonb,
    synthetic_disclosure TEXT,
    dataset_version VARCHAR(100),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. APPROVALS TABLE
CREATE TABLE IF NOT EXISTS approvals (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    rule_version_id VARCHAR(36) NOT NULL REFERENCES rule_versions(id) ON DELETE CASCADE,
    decision VARCHAR(50) NOT NULL, -- APPROVED, REJECTED, CHANGES_REQUESTED
    rationale TEXT NOT NULL,
    risk_assessment TEXT,
    approved_by_id VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. DEPLOYMENTS TABLE
CREATE TABLE IF NOT EXISTS deployments (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    rule_version_id VARCHAR(36) NOT NULL REFERENCES rule_versions(id) ON DELETE CASCADE,
    environment VARCHAR(50) DEFAULT 'demo-sandbox-v1',
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, ROLLED_BACK
    deployed_by_id VARCHAR(36) NOT NULL REFERENCES users(id),
    deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rollback_notes TEXT
);

-- 14. AUDIT EVENTS TABLE (Immutable Ledger)
CREATE TABLE IF NOT EXISTS audit_events (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actor_id VARCHAR(36) REFERENCES users(id),
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
-- Enable RLS and grant read/write access to authenticated & anon roles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulars ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligation_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Allow Anon & Authenticated full access for workbench demo
DO $$ 
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
        AND tablename IN (
            'users', 'circulars', 'document_pages', 'obligations', 'policies', 
            'obligation_mappings', 'rules', 'rule_versions', 'test_cases', 
            'test_runs', 'impact_reports', 'approvals', 'deployments', 'audit_events'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Public access policy" ON %I;', tbl);
        EXECUTE format('CREATE POLICY "Public access policy" ON %I FOR ALL USING (true) WITH CHECK (true);', tbl);
    END LOOP;
END $$;

-- Enable Realtime for live audit and notification tracking
ALTER PUBLICATION supabase_realtime ADD TABLE audit_events;
ALTER PUBLICATION supabase_realtime ADD TABLE approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE deployments;
ALTER PUBLICATION supabase_realtime ADD TABLE obligations;

-- ========================================================================
-- SEED INITIAL INSTITUTIONAL DATA
-- ========================================================================

-- Insert 4 Institutional Users
INSERT INTO users (id, username, full_name, email, role) VALUES
('usr-analyst-01', 'analyst_maya', 'Maya Sen', 'maya.sen@compliance.bank.internal', 'COMPLIANCE_ANALYST'),
('usr-approver-01', 'approver_vikram', 'Vikram Mehta', 'vikram.mehta@compliance.bank.internal', 'COMPLIANCE_APPROVER'),
('usr-engineer-01', 'engineer_arun', 'Arun Patel', 'arun.patel@engineering.bank.internal', 'RULE_ENGINEER'),
('usr-admin-01', 'admin_elena', 'Elena Rostova', 'elena.rostova@risk.bank.internal', 'PLATFORM_ADMIN')
ON CONFLICT (id) DO NOTHING;

-- Insert 4 Internal Policies
INSERT INTO policies (id, policy_code, title, category, description, active_rules_count, version) VALUES
('pol-01', 'POL-CR-01', 'Retail Credit Risk & Capital Adequacy Policy', 'Credit Risk & Capital Management', 'Governs risk-weight assignment, Tier-1 capital conservation buffers, and capital adequacy ratio (CAR) computations for all retail consumer credit assets.', 3, '2.4'),
('pol-02', 'POL-UW-04', 'Debt Serviceability & DTI Underwriting Standards', 'Credit Underwriting & Risk Appetite', 'Defines permissible Debt-to-Income (DTI) bounds, maximum allowable installment-to-income ratios, and mandatory proof-of-income validation rules.', 2, '1.8'),
('pol-03', 'POL-PSL-12', 'Priority Sector Lending & Financial Inclusion Framework', 'Statutory Compliance & Inclusion', 'Preserves statutory exemptions, sub-target tracking, and subsidized risk treatment for Self-Help Groups (SHGs) and microfinance portfolios.', 1, '3.0'),
('pol-04', 'POL-AML-08', 'Anti-Money Laundering & Source of Funds Verification', 'Financial Crime Prevention', 'Mandates beneficial ownership discovery and automated pre-disbursal sanction screening against domestic and global watchlists.', 4, '4.1')
ON CONFLICT (id) DO NOTHING;

-- Insert RBI Benchmark Circular
INSERT INTO circulars (id, title, filename, file_hash, source_authority, circular_number, publication_date, effective_date, status, page_count, extracted_text) VALUES
('circ-rbi-2026-84', 'Regulatory Measures on Consumer Credit, Capital Adequacy and Risk-Weight Calibration', 'RBI_Circular_2026_84_Consumer_Credit.pdf', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'Reserve Bank of India', 'RBI/2026-27/84', '2026-03-15', '2026-06-30', 'PARSED', 2, 'RESERVE BANK OF INDIA - NOTIFICATION\nRBI/2026-27/84 - DOR.STR.REC.57/21.06.001/2026-27\nMarch 15, 2026\n\nSubject: Regulatory Measures towards Consumer Credit, Risk-Weights and Capital Buffer Alignment\n\n1. Background and Macroprudential Assessment\nA calibrated assessment of the growth in unsecured consumer credit exposures across Scheduled Commercial Banks (SCBs) and Non-Banking Financial Companies (NBFCs) indicates elevated risk accumulation. To strengthen institutional resilience against credit stress, the following regulatory measures are prescribed.\n\n2. Mandatory Risk-Weight Escalation on Consumer Credit\n(a) Consumer credit exposure of commercial banks (outstanding as well as fresh sanction), categorized under personal loans, credit card receivables, and consumer durable financing exceeding an aggregate ticket size of INR 50,000, shall attract a risk weight of 125% (up from 100%).\n(b) Priority sector lending advances, housing loans, and educational credit commitments shall be strictly exempted from this surcharge and remain calibrated at standard baseline weights.')
ON CONFLICT (id) DO NOTHING;

-- Insert Document Pages
INSERT INTO document_pages (id, circular_id, page_number, text_content) VALUES
('page-01', 'circ-rbi-2026-84', 1, 'Paragraph 2(a): Consumer credit exposure of commercial banks exceeding ticket size of INR 50,000 shall attract a risk weight of 125% (up from 100%).'),
('page-02', 'circ-rbi-2026-84', 2, 'Paragraph 2(b): Priority sector lending advances and educational credit commitments shall be strictly exempted.')
ON CONFLICT (id) DO NOTHING;

-- Insert Obligation
INSERT INTO obligations (id, circular_id, obligation_code, title, extracted_text, source_page, source_span, actor, action, conditions, threshold, deadline, review_status, applicability, reviewer_notes, reviewed_by_id, flags) VALUES
('obl-01', 'circ-rbi-2026-84', 'OBL-CR-001', 'Unsecured Consumer Credit Risk Weight Calibration to 125%', 'Consumer credit exposure exceeding INR 50,000 shall attract a risk weight of 125%. Priority sector advances exempted.', 1, 'Page 1, Paragraph 2(a)', 'Scheduled Commercial Banks & NBFCs', 'Assign 125% Risk Weight & Additional Tier-1 Capital Buffer', 'Loan amount > INR 50,000 AND Loan Category = Unsecured Consumer Credit', 'INR 50,000', '2026-06-30', 'ACCEPTED', 'APPLICABLE', 'Certified applicable for retail credit decision engine. Priority sector lending exemption verified.', 'usr-analyst-01', '["Statutory Exemption for Priority Sector Lending", "Mandatory Risk-Weight Floor"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert Mapping
INSERT INTO obligation_mappings (id, obligation_id, policy_id, mapping_status, match_type, match_score, rationale, mapped_by_id) VALUES
('map-01', 'obl-01', 'pol-01', 'MAPPED', 'EXACT', 0.96, 'Maps to POL-CR-01 Risk-Weight Assignment Table, specifically consumer credit schedules.', 'usr-analyst-01')
ON CONFLICT (id) DO NOTHING;

-- Insert Rule
INSERT INTO rules (id, rule_code, name, description, policy_id, status) VALUES
('rule-01', 'RULE-CR-2026-01', 'Unsecured Retail Credit Risk Weight & Capital Buffer Rule', 'Pure functional deterministic rule assigning capital adequacy risk weight and surcharge based on borrower exposure and regulatory circular RBI/2026/84.', 'pol-01', 'APPROVED_READY')
ON CONFLICT (id) DO NOTHING;

-- Insert Rule Versions
INSERT INTO rule_versions (id, rule_id, version_number, rule_dsl, change_summary, status, created_by_id) VALUES
('ver-01-baseline', 'rule-01', 'v1.0.0', '{"rule_id": "RULE-CR-2026-01", "name": "Baseline Unsecured Consumer Credit Rule", "steps": [{"step_id": "DEFAULT_WEIGHT", "decision": {"risk_weight": 1.0, "capital_buffer_percent": 0.0}}]}'::jsonb, 'Baseline historical consumer credit capital risk weight (100% flat).', 'SUPERSEDED', 'usr-engineer-01'),
('ver-02-candidate', 'rule-01', 'v1.1.0-draft', '{"rule_id": "RULE-CR-2026-01", "name": "RBI 2026 Surcharge Consumer Credit Rule", "steps": [{"step_id": "PRIORITY_SECTOR_EXEMPTION", "condition": {"operator": "EQUALS", "field": "is_priority_sector", "value": true}, "decision": {"risk_weight": 1.0, "capital_buffer_percent": 0.0, "rationale": "Statutory PSL Exemption"}}, {"step_id": "UNSECURED_SURCHARGE", "condition": {"operator": "AND", "operands": [{"operator": "GREATER_THAN", "field": "loan_amount", "value": 50000}, {"operator": "EQUALS", "field": "is_secured", "value": false}]}, "decision": {"risk_weight": 1.25, "capital_buffer_percent": 2.5, "rationale": "RBI Circular 2026/84 Compliance"}}, {"step_id": "STANDARD_FALLBACK", "decision": {"risk_weight": 1.0, "capital_buffer_percent": 0.0, "rationale": "Standard Retail Portfolio Baseline"}}]}'::jsonb, 'Implements RBI/2026/84 risk weight elevation to 125% and 2.5% Tier-1 buffer with explicit PSL exemption.', 'APPROVED', 'usr-engineer-01')
ON CONFLICT (id) DO NOTHING;

-- Insert Initial Audit Events
INSERT INTO audit_events (id, timestamp, actor_id, actor_name, actor_role, event_type, entity_type, entity_id, action, details) VALUES
('aud-01', NOW() - INTERVAL '3 days', 'usr-analyst-01', 'Maya Sen', 'COMPLIANCE_ANALYST', 'CIRCULAR_INGESTION', 'CIRCULAR', 'circ-rbi-2026-84', 'Ingested RBI Circular 2026/84 (DOR.STR.REC.57)', '{"source": "RBI", "pages": 2}'::jsonb),
('aud-02', NOW() - INTERVAL '2 days', 'usr-analyst-01', 'Maya Sen', 'COMPLIANCE_ANALYST', 'OBLIGATION_REVIEWED', 'OBLIGATION', 'obl-01', 'Certified obligation OBL-CR-001 as APPLICABLE', '{"threshold": 50000, "status": "ACCEPTED"}'::jsonb),
('aud-03', NOW() - INTERVAL '2 days', 'usr-analyst-01', 'Maya Sen', 'COMPLIANCE_ANALYST', 'POLICY_MAPPED', 'POLICY_MAPPING', 'map-01', 'Mapped OBL-CR-001 to POL-CR-01 [Match Score: 96%]', '{"policy_code": "POL-CR-01"}'::jsonb),
('aud-04', NOW() - INTERVAL '1 day', 'usr-engineer-01', 'Arun Patel', 'RULE_ENGINEER', 'RULE_VERSION_DRAFTED', 'RULE_VERSION', 'ver-02-candidate', 'Created candidate AST Rule v1.1.0-draft for RULE-CR-2026-01', '{"rule_code": "RULE-CR-2026-01", "version": "v1.1.0-draft"}'::jsonb),
('aud-05', NOW() - INTERVAL '1 day', 'usr-engineer-01', 'Arun Patel', 'RULE_ENGINEER', 'TEST_SUITE_RUN', 'TEST_RUN', 'tr-01', 'Executed test runner suite (5 of 5 tests passed, 100%)', '{"passed": 5, "failed": 0}'::jsonb),
('aud-06', NOW() - INTERVAL '18 hours', 'usr-engineer-01', 'Arun Patel', 'RULE_ENGINEER', 'IMPACT_SIMULATED', 'IMPACT_REPORT', 'imp-01', 'Generated impact report on 100 synthetic loans (47% re-weighted)', '{"evaluated": 100, "changed": 47}'::jsonb),
('aud-07', NOW() - INTERVAL '12 hours', 'usr-approver-01', 'Vikram Mehta', 'COMPLIANCE_APPROVER', 'APPROVAL_DECISION', 'APPROVAL', 'appr-01', 'Approved RULE-CR-2026-01 (v1.1.0-draft) for isolated sandbox promotion', '{"decision": "APPROVED", "approver": "Vikram Mehta"}'::jsonb)
ON CONFLICT (id) DO NOTHING;
