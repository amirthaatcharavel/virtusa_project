import type {
  Circular,
  Obligation,
  Policy,
  ObligationMapping,
  Rule,
  RuleVersion,
  TestCase,
  TestRun,
  ImpactReport,
  Approval,
  Deployment,
  AuditEvent,
  User,
} from '../types';

export interface EngineeringTask {
  id: string;
  rule_id: string;
  rule_code: string;
  title: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  owner: string;
  owner_id: string;
  due_date: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  updated_at: string;
}

export interface ApprovalSubmission {
  id: string;
  submission_type: 'RULE_VERSION_RELEASE' | 'POLICY_EXCEPTION' | 'OBLIGATION_OVERRIDE';
  rule_id: string;
  rule_code: string;
  rule_version: string;
  submitter: string;
  submitter_id: string;
  submitted_date: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  test_run_id: string;
  impact_report_id?: string;
  summary: string;
  comments?: string;
  decision_maker?: string;
  decision_date?: string;
}

export interface SourceEvidenceItem {
  id: string;
  circular_id: string;
  circular_ref: string;
  obligation_id: string;
  obligation_code: string;
  page_number: number;
  section_title: string;
  highlighted_text: string;
  context_paragraph: string;
  extracted_at: string;
  hash: string;
  confidence: number;
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface IntegrationHealth {
  id: string;
  name: string;
  category: 'REGULATORY_FEED' | 'EVENT_BUS' | 'CORE_BANKING' | 'AI_ENGINE';
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  last_execution: string;
  latency_ms: number;
  uptime_pct: number;
  details: string;
}

export interface ProcessingPipelineJob {
  id: string;
  pipeline_name: string;
  target_entity: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'QUEUED';
  last_execution: string;
  duration_sec: number;
  error_indicator?: string;
}

export interface SystemConfiguration {
  audit_retention_days: number;
  minimum_test_coverage_pct: number;
  auto_triage_confidence_threshold: number;
  sandbox_isolation_mode: 'STRICT_AIRGAP' | 'SYNTHETIC_SHADOW';
  session_timeout_minutes: number;
  dual_control_enforced: boolean;
  alert_email_recipients: string;
}

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-analyst-01',
    username: 'analyst_maya',
    full_name: 'Maya Sen',
    email: 'maya.sen@compliance.bank.internal',
    role: 'COMPLIANCE_ANALYST',
    is_active: true,
  },
  {
    id: 'usr-engineer-01',
    username: 'eng_arun',
    full_name: 'Arun Patel',
    email: 'arun.patel@compliance.bank.internal',
    role: 'RULE_ENGINEER',
    is_active: true,
  },
  {
    id: 'usr-approver-01',
    username: 'approver_vikram',
    full_name: 'Vikram Mehta',
    email: 'vikram.mehta@compliance.bank.internal',
    role: 'COMPLIANCE_APPROVER',
    is_active: true,
  },
  {
    id: 'usr-admin-01',
    username: 'admin_elena',
    full_name: 'Elena Rostova',
    email: 'elena.rostova@compliance.bank.internal',
    role: 'PLATFORM_ADMIN',
    is_active: true,
  },
  {
    id: 'usr-analyst-02',
    username: 'analyst_rohit',
    full_name: 'Rohit Kulkarni',
    email: 'rohit.k@compliance.bank.internal',
    role: 'COMPLIANCE_ANALYST',
    is_active: true,
  },
];

export const INITIAL_CIRCULARS: Circular[] = [
  {
    id: 'circ-rbi-2026-84',
    title: 'Regulatory Measures on Consumer Credit and Bank Exposure Limits',
    filename: 'RBI_2026_84_Consumer_Credit_Limits.pdf',
    file_hash: 'e9c15fa38d72110c',
    source_authority: 'Reserve Bank of India',
    circular_number: 'DOR.STR.REC.57/21.06.001/2026-27',
    publication_date: '2026-03-15',
    effective_date: '2026-11-01',
    status: 'PARSED',
    page_count: 8,
    created_at: '2026-03-16T10:30:00Z',
    obligations_count: 3,
    extracted_text: 'Risk weight on unsecured consumer credit by commercial banks is enhanced from 100% to 125%. Microfinance loans and self-help group advances remain carved out at 100%.',
    pages: [
      { id: 'p1', page_number: 1, text_content: 'Notification to all Scheduled Commercial Banks (excluding RRBs) on Consumer Credit Exposures.' },
      { id: 'p4', page_number: 4, text_content: 'Section 3(a): Risk weight on unsecured consumer credit by scheduled commercial banks is hereby enhanced from 100% to 125%. Credit extended to microfinance loans and self-help groups shall continue to attract the existing 100% risk weight.' },
      { id: 'p5', page_number: 5, text_content: 'Section 3(b): Regulated entities shall institute quarterly supervisory boards reviewing portfolio growth in non-collateralized retail credit.' }
    ]
  },
  {
    id: 'circ-eba-2026-12',
    title: 'Prudential Framework for ESG Risks and Pillar 2 Disclosures',
    filename: 'EBA_GL_2026_12_ESG_Prudential.pdf',
    file_hash: '8f773b09aa26c51e',
    source_authority: 'European Banking Authority',
    circular_number: 'EBA/GL/2026/12',
    publication_date: '2026-02-28',
    effective_date: '2026-12-31',
    status: 'PARSED',
    page_count: 24,
    created_at: '2026-03-01T08:15:00Z',
    obligations_count: 5,
    extracted_text: 'Institutions shall assess physical climate vulnerability scores across commercial real estate portfolios and report Pillar 2 capital buffers.',
  },
  {
    id: 'circ-fincen-2026-03',
    title: 'Advisory on Illicit Cross-Border Wires and Shell Entities',
    filename: 'FinCEN_Adv_2026_03_CrossBorder.pdf',
    file_hash: '12ba883ccde45689',
    source_authority: 'FinCEN',
    circular_number: 'FIN-2026-A003',
    publication_date: '2026-01-20',
    effective_date: '2026-06-01',
    status: 'PARSED',
    page_count: 12,
    created_at: '2026-01-22T14:40:00Z',
    obligations_count: 2,
    extracted_text: 'Financial institutions must implement real-time screening for nested correspondent accounts transacting sums greater than USD 250,000.',
  },
  {
    id: 'circ-sec-2026-45',
    title: 'Modernization of Beneficial Ownership Reporting and Timelines',
    filename: 'SEC_Rel_34_99845_BeneficialOwnership.pdf',
    file_hash: '90cd431100fbaa32',
    source_authority: 'Securities and Exchange Commission',
    circular_number: 'SEC-34-99845',
    publication_date: '2026-04-05',
    effective_date: '2026-10-15',
    status: 'UPLOADED',
    page_count: 16,
    created_at: '2026-04-06T11:20:00Z',
    obligations_count: 0,
    extracted_text: 'Accelerating filing deadlines for Schedule 13D and 13G beneficial ownership reports.',
  }
];

export const INITIAL_OBLIGATIONS: Obligation[] = [
  {
    id: 'obl-rbi-01',
    circular_id: 'circ-rbi-2026-84',
    obligation_code: 'OBL-CR-2026-001',
    title: '125% Risk Weight Enhancement on Unsecured Consumer Credit',
    extracted_text: 'Risk weight on unsecured consumer credit by scheduled commercial banks is hereby enhanced from 100% to 125%.',
    source_page: 4,
    source_span: 'Section 3(a), Paragraph 2',
    actor: 'Scheduled Commercial Banks',
    action: 'Apply Enhanced 125% Risk Weight (RWA)',
    conditions: 'Loan type is UNSECURED_PERSONAL_LOAN and borrower is not MICROFINANCE_SHG',
    threshold: 'Risk Weight: 125%',
    deadline: '2026-11-01',
    review_status: 'ACCEPTED',
    applicability: 'APPLICABLE',
    reviewer_notes: 'Verified against credit portfolio. Internal credit policy POL-CR-001 must be amended from 100% ceiling to 125%.',
    reviewed_by_id: 'usr-analyst-01',
    reviewed_at: '2026-03-18T11:00:00Z',
    flags: ['CAPITAL_IMPACT', 'CORE_BANKING_CHANGE'],
    policy_code: 'POL-CR-001',
    policy_title: 'Retail Credit Risk & Capital Adequacy Policy',
  },
  {
    id: 'obl-rbi-02',
    circular_id: 'circ-rbi-2026-84',
    obligation_code: 'OBL-CR-2026-002',
    title: 'Microfinance and Self-Help Group Carve-Out Exemption',
    extracted_text: 'Credit extended to microfinance loans and self-help groups shall continue to attract the existing 100% risk weight.',
    source_page: 4,
    source_span: 'Section 3(a), Sentence 2',
    actor: 'Lending Operations',
    action: 'Preserve 100% Baseline Risk Weight',
    conditions: 'Borrower sector is MICROFINANCE or SELF_HELP_GROUP',
    threshold: 'Risk Weight: 100%',
    deadline: '2026-11-01',
    review_status: 'ACCEPTED',
    applicability: 'APPLICABLE',
    reviewer_notes: 'Carve-out rule condition confirmed in Rule Studio test cases.',
    reviewed_by_id: 'usr-analyst-01',
    reviewed_at: '2026-03-18T11:20:00Z',
    flags: ['EXEMPTION_CRITERIA'],
    policy_code: 'POL-CR-001',
    policy_title: 'Retail Credit Risk & Capital Adequacy Policy',
  },
  {
    id: 'obl-rbi-03',
    circular_id: 'circ-rbi-2026-84',
    obligation_code: 'OBL-CR-2026-003',
    title: 'Quarterly Board Review of Top 50 Unsecured Retail Exposures',
    extracted_text: 'Regulated entities shall institute quarterly supervisory boards reviewing portfolio growth in non-collateralized retail credit.',
    source_page: 5,
    source_span: 'Section 3(b)',
    actor: 'Risk Management Committee',
    action: 'Generate Quarterly Supervisory Exposure Pack',
    conditions: 'Quarterly calendar schedule',
    threshold: 'Top 50 exposures by outstanding balance',
    deadline: '2026-11-30',
    review_status: 'PENDING',
    applicability: 'UNRESOLVED',
    reviewer_notes: 'Clarification required with legal whether this applies to subsidiary NBFCs.',
    flags: ['GOVERNANCE', 'BOARD_REPORTING'],
  },
  {
    id: 'obl-eba-01',
    circular_id: 'circ-eba-2026-12',
    obligation_code: 'OBL-ESG-2026-001',
    title: 'Physical Climate Risk Vulnerability Scoring for Commercial Real Estate',
    extracted_text: 'Institutions shall assess physical climate vulnerability scores across commercial real estate portfolios and report Pillar 2 capital buffers.',
    source_page: 8,
    source_span: 'Section 4.2',
    actor: 'Credit Risk / Climate Desk',
    action: 'Compute Physical Flood/Drought Vulnerability Factor',
    conditions: 'Asset type in [COMMERCIAL_REAL_ESTATE, INDUSTRIAL_FACILITIES]',
    threshold: 'Score scale 1-100; Buffer trigger >= 70',
    deadline: '2026-12-31',
    review_status: 'PENDING',
    applicability: 'APPLICABLE',
    flags: ['PILLAR_2', 'ESG_CLIMATE'],
    policy_code: 'POL-ESG-002',
    policy_title: 'Environmental and Sustainability Risk Policy',
  },
  {
    id: 'obl-fincen-01',
    circular_id: 'circ-fincen-2026-03',
    obligation_code: 'OBL-AML-2026-001',
    title: 'Real-Time Screening for Nested Correspondent Accounts > $250k',
    extracted_text: 'Financial institutions must implement real-time screening for nested correspondent accounts transacting sums greater than USD 250,000.',
    source_page: 3,
    source_span: 'Section 2, Paragraph 1',
    actor: 'AML Surveillance Operations',
    action: 'Trigger L2 Enhanced Due Diligence Review',
    conditions: 'Account type is NESTED_CORRESPONDENT and amount_usd >= 250000',
    threshold: '$250,000 USD',
    deadline: '2026-06-01',
    review_status: 'ACCEPTED',
    applicability: 'APPLICABLE',
    reviewed_by_id: 'usr-analyst-01',
    reviewed_at: '2026-02-05T09:30:00Z',
    flags: ['REALTIME_SCREENING', 'AML_SANCTIONS'],
    policy_code: 'POL-AML-004',
    policy_title: 'Anti-Money Laundering & Sanctions Standard',
  }
];

export const INITIAL_EVIDENCE: SourceEvidenceItem[] = [
  {
    id: 'ev-01',
    circular_id: 'circ-rbi-2026-84',
    circular_ref: 'RBI Circular 2026/84',
    obligation_id: 'obl-rbi-01',
    obligation_code: 'OBL-CR-2026-001',
    page_number: 4,
    section_title: 'Section 3(a) · Regulatory Mandate',
    highlighted_text: 'Risk weight on unsecured consumer credit by scheduled commercial banks is hereby enhanced from 100% to 125%.',
    context_paragraph: '3. Consumer Credit and Personal Loans — (a) On a review of the rapid growth in consumer credit, it has been decided to enhance the risk weight on unsecured consumer credit by scheduled commercial banks from 100% to 125%. Credit extended to microfinance loans and self-help groups shall continue to attract the existing 100% risk weight.',
    extracted_at: '2026-03-16T10:35:12Z',
    hash: 'e9c15fa38d72110cb8241470e8a93945',
    confidence: 0.98,
    risk_level: 'HIGH',
  },
  {
    id: 'ev-02',
    circular_id: 'circ-rbi-2026-84',
    circular_ref: 'RBI Circular 2026/84',
    obligation_id: 'obl-rbi-02',
    obligation_code: 'OBL-CR-2026-002',
    page_number: 4,
    section_title: 'Section 3(a) · Microfinance Exemption',
    highlighted_text: 'Credit extended to microfinance loans and self-help groups shall continue to attract the existing 100% risk weight.',
    context_paragraph: 'Credit extended to microfinance loans and self-help groups shall continue to attract the existing 100% risk weight, provided borrower classification conforms to Master Directions on Microfinance Loans.',
    extracted_at: '2026-03-16T10:35:12Z',
    hash: '3bc9412d44901f4a9b23ec019800ff81',
    confidence: 0.96,
    risk_level: 'LOW',
  },
  {
    id: 'ev-03',
    circular_id: 'circ-rbi-2026-84',
    circular_ref: 'RBI Circular 2026/84',
    obligation_id: 'obl-rbi-03',
    obligation_code: 'OBL-CR-2026-003',
    page_number: 5,
    section_title: 'Section 3(b) · Board Oversight',
    highlighted_text: 'Regulated entities shall institute quarterly supervisory boards reviewing portfolio growth in non-collateralized retail credit.',
    context_paragraph: 'Entities shall submit quarterly supervisory returns detailing concentration metrics and default migration across top retail tranches.',
    extracted_at: '2026-03-16T10:35:12Z',
    hash: '6a0f441029dfcc8123bcdef8891456aa',
    confidence: 0.91,
    risk_level: 'MEDIUM',
  },
  {
    id: 'ev-04',
    circular_id: 'circ-eba-2026-12',
    circular_ref: 'EBA/GL/2026/12',
    obligation_id: 'obl-eba-01',
    obligation_code: 'OBL-ESG-2026-001',
    page_number: 8,
    section_title: 'Section 4.2 · Physical Climate Hazards',
    highlighted_text: 'Institutions shall assess physical climate vulnerability scores across commercial real estate portfolios and report Pillar 2 capital buffers.',
    context_paragraph: 'Institutions shall incorporate geospatial hazard metrics into borrower debt-service coverage calculations.',
    extracted_at: '2026-03-01T08:20:00Z',
    hash: '8f773b09aa26c51e00a12b3c4d5e6f7a',
    confidence: 0.94,
    risk_level: 'MEDIUM',
  }
];

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-cr-001',
    policy_code: 'POL-CR-001',
    title: 'Retail Credit Risk & Capital Adequacy Policy',
    category: 'Credit Risk',
    description: 'Corporate limits and risk-weight assignments for consumer loans, auto loans, credit cards, and microfinance.',
    active_rules_count: 3,
    version: 'v4.2',
  },
  {
    id: 'pol-esg-002',
    policy_code: 'POL-ESG-002',
    title: 'Environmental and Sustainability Risk Policy',
    category: 'Governance & ESG',
    description: 'Pillar 2 capital assessment criteria incorporating climate physical and transition risk scoring.',
    active_rules_count: 1,
    version: 'v1.0',
  },
  {
    id: 'pol-aml-004',
    policy_code: 'POL-AML-004',
    title: 'Anti-Money Laundering & Sanctions Standard',
    category: 'Financial Crime',
    description: 'Screening criteria, correspondent banking controls, and nested payment surveillance.',
    active_rules_count: 4,
    version: 'v3.1',
  },
  {
    id: 'pol-cap-005',
    policy_code: 'POL-CAP-005',
    title: 'ICAAP Capital Buffers & Stress Testing Guideline',
    category: 'Capital Management',
    description: 'Internal Capital Adequacy Assessment Process procedures and quarterly stress thresholds.',
    active_rules_count: 2,
    version: 'v2.0',
  }
];

export const INITIAL_MAPPINGS: ObligationMapping[] = [
  {
    id: 'map-01',
    obligation_id: 'obl-rbi-01',
    policy_id: 'pol-cr-001',
    mapping_status: 'MAPPED',
    match_type: 'PARTIAL',
    match_score: 0.88,
    rationale: 'Conflict identified: POL-CR-001 caps unsecured personal loan risk weights at 100%. Circular mandates 125% starting 2026-11-01.',
    mapped_at: '2026-03-19T14:10:00Z',
  },
  {
    id: 'map-02',
    obligation_id: 'obl-rbi-02',
    policy_id: 'pol-cr-001',
    mapping_status: 'MAPPED',
    match_type: 'EXACT',
    match_score: 0.95,
    rationale: 'Microfinance carve-out aligns with current 100% treatment in Section 4.3.',
    mapped_at: '2026-03-19T14:15:00Z',
  },
  {
    id: 'map-03',
    obligation_id: 'obl-eba-01',
    policy_id: 'pol-esg-002',
    mapping_status: 'MAPPED',
    match_type: 'PARTIAL',
    match_score: 0.82,
    rationale: 'Requires updating ESG scoring model weights to include flood zone spatial index.',
    mapped_at: '2026-03-05T10:00:00Z',
  },
  {
    id: 'map-04',
    obligation_id: 'obl-fincen-01',
    policy_id: 'pol-aml-004',
    mapping_status: 'MAPPED',
    match_type: 'EXACT',
    match_score: 0.99,
    rationale: 'Correspondent transaction rule updated to trigger automated STR queue.',
    mapped_at: '2026-02-10T16:00:00Z',
  }
];

export const INITIAL_ENGINEERING_TASKS: EngineeringTask[] = [
  {
    id: 'task-eng-01',
    rule_id: 'rule-cr-2026-01',
    rule_code: 'RULE-CR-2026-01',
    title: 'Implement 125% Risk Weight for Unsecured Consumer Credit',
    description: 'Update the functional JSON AST evaluator condition branch for personal loans and revolving balances.',
    priority: 'HIGH',
    owner: 'Arun Patel',
    owner_id: 'usr-engineer-01',
    due_date: '2026-11-01',
    status: 'IN_PROGRESS',
    updated_at: '2026-10-24T12:00:00Z',
  },
  {
    id: 'task-eng-02',
    rule_id: 'rule-cr-2026-01',
    rule_code: 'RULE-CR-2026-01',
    title: 'Preserve 100% Microfinance / SHG Carve-Out Guard',
    description: 'Add negated conjunction condition preventing microfinance loans from receiving enhanced RWA weight.',
    priority: 'CRITICAL',
    owner: 'Arun Patel',
    owner_id: 'usr-engineer-01',
    due_date: '2026-11-01',
    status: 'COMPLETED',
    updated_at: '2026-10-24T16:30:00Z',
  },
  {
    id: 'task-eng-03',
    rule_id: 'rule-esg-2026-02',
    rule_code: 'RULE-ESG-2026-02',
    title: 'EBA Physical Climate Hazard Scoring Engine Plugin',
    description: 'Connect geospatial risk factor table to Pillar 2 capital add-on evaluator.',
    priority: 'MEDIUM',
    owner: 'Arun Patel',
    owner_id: 'usr-engineer-01',
    due_date: '2026-12-15',
    status: 'ASSIGNED',
    updated_at: '2026-10-22T09:00:00Z',
  },
  {
    id: 'task-eng-04',
    rule_id: 'rule-aml-2026-03',
    rule_code: 'RULE-AML-2026-03',
    title: 'Nested Wire Real-Time Screening Classifier ($250k threshold)',
    description: 'Validated stream classifier deployed to production sandbox with 0 false drops.',
    priority: 'HIGH',
    owner: 'Arun Patel',
    owner_id: 'usr-engineer-01',
    due_date: '2026-05-30',
    status: 'COMPLETED',
    updated_at: '2026-05-28T14:15:00Z',
  }
];

export const INITIAL_RULES: Rule[] = [
  {
    id: 'rule-cr-2026-01',
    rule_code: 'RULE-CR-2026-01',
    name: 'Consumer Credit Risk Weight Calculation',
    description: 'Pure functional AST rule assigning RWA percentages based on loan classification and borrower carve-outs.',
    policy_id: 'pol-cr-001',
    category: 'Credit Risk',
    current_version_id: 'ver-cr-v100',
    status: 'PENDING_APPROVAL',
    created_at: '2026-03-20T09:00:00Z',
  },
  {
    id: 'rule-aml-2026-03',
    rule_code: 'RULE-AML-2026-03',
    name: 'Cross-Border Correspondent Wire Triage',
    description: 'Real-time nested transaction monitoring and regulatory thresholds.',
    policy_id: 'pol-aml-004',
    category: 'AML',
    current_version_id: 'ver-aml-v201',
    status: 'DEPLOYED',
    created_at: '2026-02-12T11:00:00Z',
  },
  {
    id: 'rule-esg-2026-02',
    rule_code: 'RULE-ESG-2026-02',
    name: 'Pillar 2 ESG Climate Buffer Calculator',
    description: 'Computes commercial real estate climate exposure add-ons.',
    policy_id: 'pol-esg-002',
    category: 'ESG',
    current_version_id: 'ver-esg-v090',
    status: 'DRAFT',
    created_at: '2026-03-25T14:00:00Z',
  }
];

export const INITIAL_RULE_VERSIONS: RuleVersion[] = [
  {
    id: 'ver-cr-v100',
    rule_id: 'rule-cr-2026-01',
    version_number: 'v1.0.0',
    dsl_definition: {
      rule_code: 'RULE-CR-2026-01',
      version: '1.0.0',
      description: 'Baseline flat 100% risk weight for all retail credit',
      conditions: [
        {
          operator: 'OR',
          clauses: [
            { field: 'loan_type', comparator: 'EQUALS', value: 'UNSECURED_PERSONAL_LOAN' },
            { field: 'loan_type', comparator: 'EQUALS', value: 'CREDIT_CARD_REVOLVING' },
            { field: 'loan_type', comparator: 'EQUALS', value: 'MICROFINANCE_LOAN' }
          ]
        }
      ],
      consequence: {
        risk_weight_percentage: 100,
        decision: 'STANDARD_RISK_WEIGHT',
        capital_tier: 'TIER_1_STANDARD'
      }
    },
    change_summary: 'Initial baseline production version',
    is_valid: true,
    validation_errors: [],
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'ver-cr-v110-draft',
    rule_id: 'rule-cr-2026-01',
    version_number: 'v1.1.0-draft',
    dsl_definition: {
      rule_code: 'RULE-CR-2026-01',
      version: '1.1.0-draft',
      description: 'RBI 2026/84 Mandate: Enhanced 125% Risk Weight with Microfinance Carve-Out',
      conditions: [
        {
          operator: 'AND',
          clauses: [
            {
              operator: 'OR',
              clauses: [
                { field: 'loan_type', comparator: 'EQUALS', value: 'UNSECURED_PERSONAL_LOAN' },
                { field: 'loan_type', comparator: 'EQUALS', value: 'CREDIT_CARD_REVOLVING' }
              ]
            },
            {
              field: 'borrower_type',
              comparator: 'NOT_EQUALS',
              value: 'MICROFINANCE_SHG'
            }
          ]
        }
      ],
      consequence: {
        risk_weight_percentage: 125,
        decision: 'ENHANCED_RISK_WEIGHT',
        capital_tier: 'TIER_1_ENHANCED',
        regulatory_reference: 'RBI/2026-27/84 Section 3(a)'
      },
      fallback_consequence: {
        risk_weight_percentage: 100,
        decision: 'STANDARD_CARVE_OUT',
        capital_tier: 'TIER_1_STANDARD'
      }
    },
    change_summary: 'Enhanced risk weight to 125% for consumer loans; carved out microfinance and self-help groups at 100%',
    is_valid: true,
    validation_errors: [],
    created_at: '2026-10-24T15:20:00Z',
  }
];

export const INITIAL_TEST_CASES: TestCase[] = [
  {
    id: 'TC-CR-001',
    rule_id: 'rule-cr-2026-01',
    suite_name: 'Consumer Credit RWA Suite',
    name: 'Unsecured Personal Loan over ₹100k -> 125% RWA',
    description: 'Standard retail consumer loan should attract enhanced 125% risk weight.',
    input_payload: {
      loan_id: 'LN-99120',
      loan_type: 'UNSECURED_PERSONAL_LOAN',
      borrower_type: 'SALARIED_INDIVIDUAL',
      outstanding_amount_inr: 450000,
    },
    expected_outcome: {
      decision: 'ENHANCED_RISK_WEIGHT',
      risk_weight_percentage: 125,
    },
    is_edge_case: false,
  },
  {
    id: 'TC-CR-002',
    rule_id: 'rule-cr-2026-01',
    suite_name: 'Consumer Credit RWA Suite',
    name: 'Microfinance Self-Help Group Loan -> 100% RWA Carve-Out',
    description: 'Exempted group loans must remain at 100% standard weight.',
    input_payload: {
      loan_id: 'LN-77210',
      loan_type: 'UNSECURED_PERSONAL_LOAN',
      borrower_type: 'MICROFINANCE_SHG',
      outstanding_amount_inr: 85000,
    },
    expected_outcome: {
      decision: 'STANDARD_CARVE_OUT',
      risk_weight_percentage: 100,
    },
    is_edge_case: false,
  },
  {
    id: 'TC-CR-003',
    rule_id: 'rule-cr-2026-01',
    suite_name: 'Consumer Credit RWA Suite',
    name: 'Secured Automobile Loan -> 100% Unchanged',
    description: 'Secured collateralized vehicle credit should not trigger enhanced weighting.',
    input_payload: {
      loan_id: 'LN-33410',
      loan_type: 'SECURED_AUTO_LOAN',
      borrower_type: 'SALARIED_INDIVIDUAL',
      outstanding_amount_inr: 900000,
    },
    expected_outcome: {
      decision: 'STANDARD_CARVE_OUT',
      risk_weight_percentage: 100,
    },
    is_edge_case: false,
  },
  {
    id: 'TC-CR-004',
    rule_id: 'rule-cr-2026-01',
    suite_name: 'Consumer Credit RWA Suite',
    name: 'Credit Card Revolving Debt -> 125% Enhanced RWA',
    description: 'Revolving card balance attracts enhanced 125% risk weight.',
    input_payload: {
      loan_id: 'LN-55280',
      loan_type: 'CREDIT_CARD_REVOLVING',
      borrower_type: 'INDIVIDUAL',
      outstanding_amount_inr: 120000,
    },
    expected_outcome: {
      decision: 'ENHANCED_RISK_WEIGHT',
      risk_weight_percentage: 125,
    },
    is_edge_case: false,
  },
  {
    id: 'TC-CR-005',
    rule_id: 'rule-cr-2026-01',
    suite_name: 'Consumer Credit RWA Suite',
    name: 'Boundary: Zero Exposure Inactive Account',
    description: 'Accounts with zero balance evaluate safely without zero-division error.',
    input_payload: {
      loan_id: 'LN-00001',
      loan_type: 'UNSECURED_PERSONAL_LOAN',
      borrower_type: 'MICROFINANCE_SHG',
      outstanding_amount_inr: 0,
    },
    expected_outcome: {
      decision: 'STANDARD_CARVE_OUT',
      risk_weight_percentage: 100,
    },
    is_edge_case: true,
  }
];

export const INITIAL_TEST_RUN: TestRun = {
  id: 'tr-01-latest',
  rule_version_id: 'ver-cr-v110-draft',
  total_tests: 5,
  passed_tests: 5,
  failed_tests: 0,
  status: 'PASSED',
  executed_at: '2026-10-24T16:45:00Z',
  results_detail: [
    {
      test_case_id: 'TC-CR-001',
      name: 'Unsecured Personal Loan over ₹100k -> 125% RWA',
      input_payload: { loan_type: 'UNSECURED_PERSONAL_LOAN', borrower_type: 'SALARIED_INDIVIDUAL' },
      expected: { decision: 'ENHANCED_RISK_WEIGHT', risk_weight_percentage: 125 },
      actual: { decision: 'ENHANCED_RISK_WEIGHT', risk_weight_percentage: 125 },
      status: 'PASS',
    },
    {
      test_case_id: 'TC-CR-002',
      name: 'Microfinance Self-Help Group Loan -> 100% RWA Carve-Out',
      input_payload: { loan_type: 'UNSECURED_PERSONAL_LOAN', borrower_type: 'MICROFINANCE_SHG' },
      expected: { decision: 'STANDARD_CARVE_OUT', risk_weight_percentage: 100 },
      actual: { decision: 'STANDARD_CARVE_OUT', risk_weight_percentage: 100 },
      status: 'PASS',
    },
    {
      test_case_id: 'TC-CR-003',
      name: 'Secured Automobile Loan -> 100% Unchanged',
      input_payload: { loan_type: 'SECURED_AUTO_LOAN', borrower_type: 'SALARIED_INDIVIDUAL' },
      expected: { decision: 'STANDARD_CARVE_OUT', risk_weight_percentage: 100 },
      actual: { decision: 'STANDARD_CARVE_OUT', risk_weight_percentage: 100 },
      status: 'PASS',
    },
    {
      test_case_id: 'TC-CR-004',
      name: 'Credit Card Revolving Debt -> 125% Enhanced RWA',
      input_payload: { loan_type: 'CREDIT_CARD_REVOLVING', borrower_type: 'INDIVIDUAL' },
      expected: { decision: 'ENHANCED_RISK_WEIGHT', risk_weight_percentage: 125 },
      actual: { decision: 'ENHANCED_RISK_WEIGHT', risk_weight_percentage: 125 },
      status: 'PASS',
    },
    {
      test_case_id: 'TC-CR-005',
      name: 'Boundary: Zero Exposure Inactive Account',
      input_payload: { loan_type: 'UNSECURED_PERSONAL_LOAN', borrower_type: 'MICROFINANCE_SHG' },
      expected: { decision: 'STANDARD_CARVE_OUT', risk_weight_percentage: 100 },
      actual: { decision: 'STANDARD_CARVE_OUT', risk_weight_percentage: 100 },
      status: 'PASS',
    }
  ]
};

export const INITIAL_IMPACT_REPORT: ImpactReport = {
  id: 'imp-cr-2026-latest',
  baseline_version_id: 'ver-cr-v100',
  candidate_version_id: 'ver-cr-v110-draft',
  dataset_version: 'SYNTHETIC_RETAIL_LOANS_2026_Q1',
  total_evaluated: 10000,
  unchanged_count: 5620,
  changed_count: 4380,
  synthetic_disclosure: 'Simulated impact evaluated on 10,000 anonymized synthetic bank accounts without real customer data.',
  generated_at: '2026-10-24T17:00:00Z',
  differences: [
    {
      record_id: 'REC-RET-00142',
      input_data: { loan_type: 'UNSECURED_PERSONAL_LOAN', amount: 350000, borrower: 'Private Salaried' },
      baseline_step: 'RULE-CR-2026-01:v1.0.0',
      baseline_action: { decision: 'STANDARD_RISK_WEIGHT', rwa_pct: 100 },
      candidate_step: 'RULE-CR-2026-01:v1.1.0-draft',
      candidate_action: { decision: 'ENHANCED_RISK_WEIGHT', rwa_pct: 125 },
      differential_fields: [
        { field: 'risk_weight_percentage', baseline_value: 100, candidate_value: 125 },
        { field: 'decision', baseline_value: 'STANDARD_RISK_WEIGHT', candidate_value: 'ENHANCED_RISK_WEIGHT' }
      ],
      difference_reason: 'Unsecured personal loan re-weighted to 125% per RBI mandate',
      changed: true,
    },
    {
      record_id: 'REC-RET-00891',
      input_data: { loan_type: 'CREDIT_CARD_REVOLVING', amount: 140000, borrower: 'Self-Employed' },
      baseline_step: 'RULE-CR-2026-01:v1.0.0',
      baseline_action: { decision: 'STANDARD_RISK_WEIGHT', rwa_pct: 100 },
      candidate_step: 'RULE-CR-2026-01:v1.1.0-draft',
      candidate_action: { decision: 'ENHANCED_RISK_WEIGHT', rwa_pct: 125 },
      differential_fields: [
        { field: 'risk_weight_percentage', baseline_value: 100, candidate_value: 125 }
      ],
      difference_reason: 'Revolving card debt re-weighted to 125%',
      changed: true,
    },
    {
      record_id: 'REC-RET-01205',
      input_data: { loan_type: 'UNSECURED_PERSONAL_LOAN', amount: 65000, borrower: 'MICROFINANCE_SHG' },
      baseline_step: 'RULE-CR-2026-01:v1.0.0',
      baseline_action: { decision: 'STANDARD_RISK_WEIGHT', rwa_pct: 100 },
      candidate_step: 'RULE-CR-2026-01:v1.1.0-draft',
      candidate_action: { decision: 'STANDARD_CARVE_OUT', rwa_pct: 100 },
      differential_fields: [],
      difference_reason: 'Microfinance carve-out maintained at 100%',
      changed: false,
    },
    {
      record_id: 'REC-RET-02450',
      input_data: { loan_type: 'SECURED_AUTO_LOAN', amount: 800000, borrower: 'Individual' },
      baseline_step: 'RULE-CR-2026-01:v1.0.0',
      baseline_action: { decision: 'STANDARD_RISK_WEIGHT', rwa_pct: 100 },
      candidate_step: 'RULE-CR-2026-01:v1.1.0-draft',
      candidate_action: { decision: 'STANDARD_CARVE_OUT', rwa_pct: 100 },
      differential_fields: [],
      difference_reason: 'Collateralized loan exempt from enhanced weighting',
      changed: false,
    }
  ]
};

export const INITIAL_SUBMISSIONS: ApprovalSubmission[] = [
  {
    id: 'SUB-2026-001',
    submission_type: 'RULE_VERSION_RELEASE',
    rule_id: 'rule-cr-2026-01',
    rule_code: 'RULE-CR-2026-01',
    rule_version: 'v1.1.0-draft',
    submitter: 'Arun Patel',
    submitter_id: 'usr-engineer-01',
    submitted_date: '2026-10-24T17:15:00Z',
    priority: 'HIGH',
    status: 'PENDING',
    test_run_id: 'tr-01-latest',
    impact_report_id: 'imp-cr-2026-latest',
    summary: 'Implementation of RBI 2026/84: Enhanced 125% risk weight on unsecured consumer credit with strict microfinance carve-out.',
  },
  {
    id: 'SUB-2026-002',
    submission_type: 'RULE_VERSION_RELEASE',
    rule_id: 'rule-aml-2026-03',
    rule_code: 'RULE-AML-2026-03',
    rule_version: 'v2.0.1',
    submitter: 'Arun Patel',
    submitter_id: 'usr-engineer-01',
    submitted_date: '2026-05-20T11:00:00Z',
    priority: 'MEDIUM',
    status: 'APPROVED',
    test_run_id: 'tr-aml-99',
    summary: 'FinCEN cross-border correspondent account surveillance rule release.',
    decision_maker: 'Vikram Mehta',
    decision_date: '2026-05-22T14:30:00Z',
    comments: 'Certified against FinCEN circular citations. 100% test coverage confirmed.',
  },
  {
    id: 'SUB-2026-003',
    submission_type: 'POLICY_EXCEPTION',
    rule_id: 'rule-esg-2026-02',
    rule_code: 'RULE-ESG-2026-02',
    rule_version: 'v0.9.0-rc1',
    submitter: 'Arun Patel',
    submitter_id: 'usr-engineer-01',
    submitted_date: '2026-04-12T09:30:00Z',
    priority: 'HIGH',
    status: 'CHANGES_REQUESTED',
    test_run_id: 'tr-esg-01',
    summary: 'EBA Pillar 2 flood zone add-on calculation prototype.',
    decision_maker: 'Vikram Mehta',
    decision_date: '2026-04-14T16:00:00Z',
    comments: 'Request changes: Boundary tests for coastal storm surges were missing from regression matrix. Resubmit with at least 8 test cases.',
  }
];

export const INITIAL_APPROVALS: Approval[] = [
  {
    id: 'appr-01',
    rule_version_id: 'ver-aml-v201',
    test_run_id: 'tr-aml-99',
    approver_id: 'usr-approver-01',
    decision: 'APPROVED',
    rationale: 'Fully certified against FinCEN circular citations. Dual-control requirements satisfied.',
    decided_at: '2026-05-22T14:30:00Z',
  },
  {
    id: 'appr-02',
    rule_version_id: 'ver-esg-v090',
    test_run_id: 'tr-esg-01',
    approver_id: 'usr-approver-01',
    decision: 'REVISION_REQUESTED',
    rationale: 'Missing coastal storm surge boundary tests in test runner. Resubmit with full suite.',
    decided_at: '2026-04-14T16:00:00Z',
  }
];

export const INITIAL_DEPLOYMENTS: Deployment[] = [
  {
    id: 'dep-01',
    rule_version_id: 'ver-cr-v100',
    approval_id: 'appr-prod-00',
    environment: 'SANDBOX_PRIMARY',
    status: 'DEPLOYED',
    deployed_by_id: 'usr-engineer-01',
    deployed_at: '2026-01-15T12:00:00Z',
    notes: 'Initial production sandbox deployment.',
  },
  {
    id: 'dep-02',
    rule_version_id: 'ver-aml-v201',
    approval_id: 'appr-01',
    environment: 'SANDBOX_PRIMARY',
    status: 'DEPLOYED',
    deployed_by_id: 'usr-engineer-01',
    deployed_at: '2026-05-25T09:00:00Z',
    notes: 'AML nested wire rule activated in sandbox.',
  }
];

export const INITIAL_INTEGRATIONS: IntegrationHealth[] = [
  {
    id: 'int-01',
    name: 'RBI Regulatory RSS & API Scraper',
    category: 'REGULATORY_FEED',
    status: 'HEALTHY',
    last_execution: '2026-10-25T11:45:00Z',
    latency_ms: 180,
    uptime_pct: 99.98,
    details: 'Polling active every 15 minutes. 8 circulars parsed this cycle.',
  },
  {
    id: 'int-02',
    name: 'FinCEN Advisories & Treasury Gateway',
    category: 'REGULATORY_FEED',
    status: 'HEALTHY',
    last_execution: '2026-10-25T11:30:00Z',
    latency_ms: 220,
    uptime_pct: 99.95,
    details: 'TLS 1.3 mTLS connection established. Certificate valid.',
  },
  {
    id: 'int-03',
    name: 'Kafka Transaction Stream (Retail Ledger)',
    category: 'EVENT_BUS',
    status: 'HEALTHY',
    last_execution: '2026-10-25T11:58:30Z',
    latency_ms: 12,
    uptime_pct: 100.0,
    details: '0 dead-letter queue messages. Consumer lag < 20ms.',
  },
  {
    id: 'int-04',
    name: 'AST Compiler & Safe Evaluator Node',
    category: 'AI_ENGINE',
    status: 'HEALTHY',
    last_execution: '2026-10-25T11:59:00Z',
    latency_ms: 4,
    uptime_pct: 100.0,
    details: 'Pure functional evaluator sandbox active. Zero eval() vulnerabilities.',
  }
];

export const INITIAL_PIPELINE_JOBS: ProcessingPipelineJob[] = [
  {
    id: 'job-parse-8821',
    pipeline_name: 'Document Ingestion & OCR Clause Splitter',
    target_entity: 'RBI_2026_84_Consumer_Credit_Limits.pdf',
    status: 'SUCCESS',
    last_execution: '2026-03-16T10:32:00Z',
    duration_sec: 14.2,
  },
  {
    id: 'job-eval-9940',
    pipeline_name: 'Deterministic Regression Test Matrix',
    target_entity: 'RULE-CR-2026-01:v1.1.0-draft',
    status: 'SUCCESS',
    last_execution: '2026-10-24T16:45:00Z',
    duration_sec: 3.8,
  },
  {
    id: 'job-sim-4011',
    pipeline_name: 'Synthetic Portfolio Impact Evaluator',
    target_entity: '10,000 Retail Accounts vs v1.1.0',
    status: 'SUCCESS',
    last_execution: '2026-10-24T17:00:00Z',
    duration_sec: 22.4,
  },
  {
    id: 'job-feed-1002',
    pipeline_name: 'Periodic RSS Publication Sync',
    target_entity: 'Reserve Bank of India Feed',
    status: 'SUCCESS',
    last_execution: '2026-10-25T11:45:00Z',
    duration_sec: 1.1,
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud-01',
    event_type: 'CIRCULAR_INGESTED',
    actor_id: 'usr-analyst-01',
    actor_name: 'Maya Sen',
    actor_role: 'COMPLIANCE_ANALYST',
    entity_type: 'CIRCULAR',
    entity_id: 'circ-rbi-2026-84',
    action: 'Ingested RBI Circular 2026/84 (DOR.STR.REC.57)',
    details: { file_hash: 'e9c15fa38d72110c', page_count: 8 },
    timestamp: '2026-03-16T10:30:00Z',
  },
  {
    id: 'aud-02',
    event_type: 'OBLIGATION_REVIEWED',
    actor_id: 'usr-analyst-01',
    actor_name: 'Maya Sen',
    actor_role: 'COMPLIANCE_ANALYST',
    entity_type: 'OBLIGATION',
    entity_id: 'obl-rbi-01',
    action: 'Certified obligation OBL-CR-2026-001 as APPLICABLE',
    details: { reviewer_notes: 'Verified against credit portfolio' },
    timestamp: '2026-03-18T11:00:00Z',
  },
  {
    id: 'aud-03',
    event_type: 'POLICY_MAPPED',
    actor_id: 'usr-analyst-01',
    actor_name: 'Maya Sen',
    actor_role: 'COMPLIANCE_ANALYST',
    entity_type: 'POLICY_MAPPING',
    entity_id: 'map-01',
    action: 'Mapped OBL-CR-2026-001 to POL-CR-001 (Gap flagged: 100% vs 125%)',
    details: { match_score: 0.88, match_type: 'PARTIAL' },
    timestamp: '2026-03-19T14:10:00Z',
  },
  {
    id: 'aud-04',
    event_type: 'RULE_DRAFT_CREATED',
    actor_id: 'usr-engineer-01',
    actor_name: 'Arun Patel',
    actor_role: 'RULE_ENGINEER',
    entity_type: 'RULE_VERSION',
    entity_id: 'ver-cr-v110-draft',
    action: 'Created candidate AST Rule v1.1.0-draft for RULE-CR-2026-01',
    details: { risk_weight: 125, carve_out: 'MICROFINANCE_SHG' },
    timestamp: '2026-10-24T15:20:00Z',
  },
  {
    id: 'aud-05',
    event_type: 'TEST_RUN_EXECUTED',
    actor_id: 'usr-engineer-01',
    actor_name: 'Arun Patel',
    actor_role: 'RULE_ENGINEER',
    entity_type: 'TEST_RUN',
    entity_id: 'tr-01-latest',
    action: 'Executed test runner suite (5 of 5 tests passed, 100%)',
    details: { passed: 5, failed: 0 },
    timestamp: '2026-10-24T16:45:00Z',
  },
  {
    id: 'aud-06',
    event_type: 'IMPACT_SIMULATED',
    actor_id: 'usr-engineer-01',
    actor_name: 'Arun Patel',
    actor_role: 'RULE_ENGINEER',
    entity_type: 'IMPACT_REPORT',
    entity_id: 'imp-cr-2026-latest',
    action: 'Generated impact report on 10,000 synthetic loans (43.8% re-weighted)',
    details: { total: 10000, changed: 4380 },
    timestamp: '2026-10-24T17:00:00Z',
  },
  {
    id: 'aud-07',
    event_type: 'APPROVAL_SUBMITTED',
    actor_id: 'usr-engineer-01',
    actor_name: 'Arun Patel',
    actor_role: 'RULE_ENGINEER',
    entity_type: 'APPROVAL_SUBMISSION',
    entity_id: 'SUB-2026-001',
    action: 'Submitted RULE-CR-2026-01 (v1.1.0-draft) for independent compliance approval',
    details: { priority: 'HIGH' },
    timestamp: '2026-10-24T17:15:00Z',
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfiguration = {
  audit_retention_days: 2555,
  minimum_test_coverage_pct: 100,
  auto_triage_confidence_threshold: 85,
  sandbox_isolation_mode: 'STRICT_AIRGAP',
  session_timeout_minutes: 30,
  dual_control_enforced: true,
  alert_email_recipients: 'compliance-alerts@bank.internal, risk-audit@bank.internal',
};
