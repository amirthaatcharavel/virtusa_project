export type UserRole = 
  | 'COMPLIANCE_ANALYST' 
  | 'COMPLIANCE_APPROVER' 
  | 'RULE_ENGINEER' 
  | 'PLATFORM_ADMIN';

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface DocumentPage {
  id: string;
  page_number: number;
  text_content: string;
}

export interface Circular {
  id: string;
  title: string;
  filename: string;
  file_hash?: string;
  source_authority: string;
  circular_number?: string;
  publication_date?: string;
  effective_date?: string;
  status: 'UPLOADED' | 'PARSING' | 'PARSED' | 'FAILED';
  page_count: number;
  created_at: string;
  obligations_count?: number;
  extracted_text?: string;
  pages?: DocumentPage[];
}

export type ApplicabilityState = 'APPLICABLE' | 'NOT_APPLICABLE' | 'UNRESOLVED';
export type ReviewStatus = 'PENDING' | 'ACCEPTED' | 'EDITED' | 'REJECTED' | 'UNRESOLVED';

export interface Obligation {
  id: string;
  circular_id: string;
  obligation_code: string;
  title: string;
  extracted_text: string;
  source_page: number;
  source_span?: string;
  actor?: string;
  action?: string;
  conditions?: string;
  threshold?: string;
  deadline?: string;
  review_status: ReviewStatus;
  applicability: ApplicabilityState;
  reviewer_notes?: string;
  reviewed_by_id?: string;
  reviewed_at?: string;
  flags: string[];
  policy_code?: string;
  policy_title?: string;
}

export interface Policy {
  id: string;
  policy_code: string;
  title: string;
  category: string;
  description: string;
  active_rules_count: number;
  version: string;
}

export interface ObligationMapping {
  id: string;
  obligation_id: string;
  policy_id?: string;
  mapping_status: 'MAPPED' | 'UNMAPPED' | 'UNRESOLVED';
  match_type: 'EXACT' | 'PARTIAL' | 'NEW_POLICY_NEEDED' | 'UNMAPPED';
  match_score: number;
  rationale?: string;
  mapped_at: string;
  policy?: Policy;
}

export interface Rule {
  id: string;
  rule_code: string;
  name: string;
  description: string;
  policy_id?: string;
  category: string;
  current_version_id?: string;
  status: 'DRAFT' | 'VALIDATED' | 'TESTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'DEPLOYED' | 'REJECTED' | 'ROLLED_BACK';
  created_at: string;
}

export interface RuleVersion {
  id: string;
  rule_id: string;
  version_number: string;
  dsl_definition: Record<string, any>;
  change_summary?: string;
  is_valid: boolean;
  validation_errors: string[];
  created_at: string;
}

export interface TestCase {
  id: string;
  rule_id: string;
  suite_name: string;
  name: string;
  description?: string;
  input_payload: Record<string, any>;
  expected_outcome: Record<string, any>;
  is_edge_case: boolean;
}

export interface TestResultItem {
  test_case_id: string;
  name: string;
  input_payload: Record<string, any>;
  expected: Record<string, any>;
  actual: Record<string, any>;
  matched_step?: string;
  status: 'PASS' | 'FAIL';
  triggered_clauses?: any[];
}

export interface TestRun {
  id: string;
  rule_version_id: string;
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  status: 'PASSED' | 'FAILED';
  results_detail: TestResultItem[];
  executed_at: string;
}

export interface DifferentialField {
  field: string;
  baseline_value: any;
  candidate_value: any;
}

export interface ChangedCase {
  record_id: string;
  input_data: Record<string, any>;
  baseline_step: string;
  baseline_action: Record<string, any>;
  candidate_step: string;
  candidate_action: Record<string, any>;
  differential_fields: DifferentialField[];
  difference_reason: string;
  changed: boolean;
}

export interface ImpactReport {
  id: string;
  baseline_version_id: string;
  candidate_version_id: string;
  dataset_version: string;
  total_evaluated: number;
  unchanged_count: number;
  changed_count: number;
  differences: ChangedCase[];
  synthetic_disclosure: string;
  generated_at: string;
}

export interface Approval {
  id: string;
  rule_version_id: string;
  test_run_id?: string;
  impact_report_id?: string;
  approver_id: string;
  decision: 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  rationale: string;
  decided_at: string;
}

export interface Deployment {
  id: string;
  rule_version_id: string;
  approval_id: string;
  environment: string;
  status: 'DEPLOYED' | 'FAILED' | 'ROLLED_BACK';
  deployed_by_id: string;
  deployed_at: string;
  rollback_of_id?: string;
  rollback_at?: string;
  notes?: string;
}

export interface AuditEvent {
  id: string;
  event_type: string;
  actor_id?: string;
  actor_name: string;
  actor_role: string;
  entity_type: string;
  entity_id: string;
  action: string;
  details: Record<string, any>;
  timestamp: string;
}
