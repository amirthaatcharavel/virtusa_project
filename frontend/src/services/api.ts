import axios from 'axios';
import type {
  Circular, Obligation, Policy, ObligationMapping,
  Rule, RuleVersion, TestCase, TestRun, ImpactReport,
  Approval, Deployment, AuditEvent, User
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject authenticated user ID into every request for backend RBAC enforcement
apiClient.interceptors.request.use((config) => {
  const currentUserId = localStorage.getItem('current_user_id') || 'usr-analyst-01';
  config.headers['X-User-Id'] = currentUserId;
  return config;
});

export const apiService = {
  // Users
  getUsers: async (): Promise<User[]> => {
    const res = await apiClient.get<User[]>('/auth/users');
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },

  // Role-Specific Real Dashboard Metrics
  getRoleDashboardMetrics: async (): Promise<any> => {
    const res = await apiClient.get('/dashboard/metrics');
    return res.data;
  },

  // Circulars
  getCirculars: async (query?: string, authority?: string): Promise<Circular[]> => {
    const res = await apiClient.get<Circular[]>('/circulars', {
      params: { query, authority },
    });
    return res.data;
  },

  getCircularDetail: async (id: string): Promise<Circular> => {
    const res = await apiClient.get<Circular>(`/circulars/${id}`);
    return res.data;
  },

  uploadCircular: async (formData: FormData): Promise<any> => {
    const res = await apiClient.post('/circulars/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Obligations
  getObligations: async (circularId?: string, applicability?: string, reviewStatus?: string): Promise<Obligation[]> => {
    const res = await apiClient.get<Obligation[]>('/obligations', {
      params: {
        circular_id: circularId,
        applicability,
        review_status: reviewStatus,
      },
    });
    return res.data;
  },

  getObligation: async (id: string): Promise<Obligation> => {
    const res = await apiClient.get<Obligation>(`/obligations/${id}`);
    return res.data;
  },

  reviewObligation: async (id: string, payload: Partial<Obligation>, _userId?: string): Promise<Obligation> => {
    const res = await apiClient.put<Obligation>(`/obligations/${id}/review`, payload);
    return res.data;
  },

  // Policies
  getPolicies: async (query?: string, category?: string): Promise<Policy[]> => {
    const res = await apiClient.get<Policy[]>('/policies', {
      params: { query, category },
    });
    return res.data;
  },

  saveMapping: async (obligationId: string, mapping: any, _userId?: string): Promise<ObligationMapping> => {
    const res = await apiClient.post<ObligationMapping>(`/obligations/${obligationId}/mapping`, mapping);
    return res.data;
  },

  // Rules
  getRules: async (): Promise<Rule[]> => {
    const res = await apiClient.get<Rule[]>('/rules');
    return res.data;
  },

  getRule: async (id: string): Promise<Rule> => {
    const res = await apiClient.get<Rule>(`/rules/${id}`);
    return res.data;
  },

  getRuleVersions: async (ruleId: string): Promise<RuleVersion[]> => {
    const res = await apiClient.get<RuleVersion[]>(`/rules/${ruleId}/versions`);
    return res.data;
  },

  getRuleVersionDetail: async (ruleId: string, versionId: string): Promise<RuleVersion> => {
    const res = await apiClient.get<RuleVersion>(`/rules/${ruleId}/versions/${versionId}`);
    return res.data;
  },

  validateRuleDsl: async (dslDefinition: Record<string, any>): Promise<{ is_valid: boolean; errors: string[] }> => {
    const res = await apiClient.post('/rules/validate-dsl', { dsl_definition: dslDefinition });
    return res.data;
  },

  createRuleVersionDraft: async (ruleId: string, draft: { version_number: string; dsl_definition: any; change_summary: string }, _userId?: string): Promise<RuleVersion> => {
    const res = await apiClient.post<RuleVersion>(`/rules/${ruleId}/versions`, draft);
    return res.data;
  },

  // Test Suite
  getTestCases: async (ruleId: string): Promise<TestCase[]> => {
    const res = await apiClient.get<TestCase[]>(`/rules/${ruleId}/test-cases`);
    return res.data;
  },

  executeTestRun: async (ruleId: string, versionId: string, _userId?: string): Promise<TestRun> => {
    const res = await apiClient.post<TestRun>(`/rules/${ruleId}/versions/${versionId}/test-run`);
    return res.data;
  },

  getVersionTestRuns: async (ruleId: string, versionId: string): Promise<TestRun[]> => {
    const res = await apiClient.get<TestRun[]>(`/rules/${ruleId}/versions/${versionId}/test-runs`);
    return res.data;
  },

  // Impact Simulator
  simulateImpact: async (baselineVersionId: string, candidateVersionId: string, datasetVersion?: string, _userId?: string): Promise<ImpactReport> => {
    const res = await apiClient.post<ImpactReport>('/impact/simulate', {
      baseline_version_id: baselineVersionId,
      candidate_version_id: candidateVersionId,
      dataset_version: datasetVersion || 'SYNTHETIC_RETAIL_LOANS_2026_Q1',
    });
    return res.data;
  },

  getImpactReport: async (id: string): Promise<ImpactReport> => {
    const res = await apiClient.get<ImpactReport>(`/impact/${id}`);
    return res.data;
  },

  // Approvals
  getApprovals: async (): Promise<Approval[]> => {
    const res = await apiClient.get<Approval[]>('/approvals');
    return res.data;
  },

  recordApproval: async (payload: { rule_version_id: string; test_run_id: string; impact_report_id?: string; decision: string; rationale: string }, _userId?: string): Promise<Approval> => {
    const res = await apiClient.post<Approval>('/approvals', payload);
    return res.data;
  },

  // Deployments
  getDeployments: async (): Promise<Deployment[]> => {
    const res = await apiClient.get<Deployment[]>('/deployments');
    return res.data;
  },

  deployToSandbox: async (payload: { rule_version_id: string; approval_id: string; notes?: string }, _userId?: string): Promise<Deployment> => {
    const res = await apiClient.post<Deployment>('/deployments', payload);
    return res.data;
  },

  rollbackDeployment: async (payload: { deployment_id: string; target_version_id: string; reason: string }, _userId?: string): Promise<Deployment> => {
    const res = await apiClient.post<Deployment>('/deployments/rollback', payload);
    return res.data;
  },

  // Admin User & System Management
  updateUserRole: async (userId: string, newRole: string): Promise<any> => {
    const formData = new FormData();
    formData.append('new_role', newRole);
    const res = await apiClient.put(`/admin/users/${userId}/role`, formData);
    return res.data;
  },

  updateUserStatus: async (userId: string, isActive: boolean): Promise<any> => {
    const formData = new FormData();
    formData.append('is_active', String(isActive));
    const res = await apiClient.put(`/admin/users/${userId}/status`, formData);
    return res.data;
  },

  // Audit & Evidence
  getAuditEvents: async (eventType?: string, entityType?: string, limit?: number): Promise<AuditEvent[]> => {
    const res = await apiClient.get<AuditEvent[]>('/audit', {
      params: { event_type: eventType, entity_type: entityType, limit: limit || 100 },
    });
    return res.data;
  },

  getEvidenceDossier: async (ruleVersionId: string): Promise<any> => {
    const res = await apiClient.get(`/evidence/${ruleVersionId}`);
    return res.data;
  },

  getHealth: async (): Promise<any> => {
    const res = await axios.get('http://127.0.0.1:8000/health');
    return res.data;
  }
};
