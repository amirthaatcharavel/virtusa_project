import axios from 'axios';
import type {
  Circular, Obligation, Policy, ObligationMapping,
  Rule, RuleVersion, TestCase, TestRun, ImpactReport,
  Approval, Deployment, AuditEvent, User
} from '../types';
import { useMockDataStore } from '../stores/mockDataStore';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1500, // Fast failover to mock data store or Supabase
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
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').select('*');
        if (!error && data && data.length > 0) {
          return data as User[];
        }
      } catch (err) {
        console.warn('Supabase users query error, falling back', err);
      }
    }

    try {
      const res = await apiClient.get<User[]>('/auth/users');
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.users;
    }
  },

  getMe: async (): Promise<User> => {
    const supabase = getSupabaseClient();
    const currentId = localStorage.getItem('current_user_id') || 'usr-analyst-01';
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', currentId).single();
        if (!error && data) {
          return data as User;
        }
      } catch {
        // Continue to API / fallback
      }
    }

    try {
      const res = await apiClient.get<User>('/auth/me');
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.users.find(u => u.id === currentId) || mockStore.users[0];
    }
  },

  // Role-Specific Real Dashboard Metrics
  getRoleDashboardMetrics: async (): Promise<any> => {
    try {
      const res = await apiClient.get('/dashboard/metrics');
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return {
        analyst: mockStore.analystMetrics,
        engineer: mockStore.engineerMetrics,
        approver: mockStore.approverMetrics,
        admin: mockStore.adminMetrics,
      };
    }
  },

  // Circulars
  getCirculars: async (query?: string, authority?: string): Promise<Circular[]> => {
    try {
      const res = await apiClient.get<Circular[]>('/circulars', {
        params: { query, authority },
      });
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      let list = [...mockStore.circulars];
      if (query) {
        const q = query.toLowerCase();
        list = list.filter(c => c.title.toLowerCase().includes(q) || (c.circular_number && c.circular_number.toLowerCase().includes(q)));
      }
      if (authority) {
        list = list.filter(c => c.source_authority === authority);
      }
      return list;
    }
  },

  getCircularDetail: async (id: string): Promise<Circular> => {
    try {
      const res = await apiClient.get<Circular>(`/circulars/${id}`);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      const found = mockStore.circulars.find(c => c.id === id);
      if (found) return found;
      return mockStore.circulars[0];
    }
  },

  uploadCircular: async (formData: FormData): Promise<any> => {
    try {
      const res = await apiClient.post('/circulars/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      const title = (formData.get('title') as string) || 'Regulatory Publication';
      const authority = (formData.get('source_authority') as string) || 'Reserve Bank of India';
      const circNumber = (formData.get('circular_number') as string) || '';
      const pubDate = (formData.get('publication_date') as string) || new Date().toISOString().split('T')[0];
      const effDate = (formData.get('effective_date') as string) || '2026-12-31';
      const file = formData.get('file') as File | null;
      const fileName = file ? file.name : 'Uploaded_Regulatory_Document.pdf';

      return mockStore.uploadCircular({
        title,
        source_authority: authority,
        circular_number: circNumber,
        publication_date: pubDate,
        effective_date: effDate,
        fileName,
        fileSizeMb: file ? Number((file.size / (1024 * 1024)).toFixed(2)) : 1.5,
      });
    }
  },

  // Obligations
  getObligations: async (circularId?: string, applicability?: string, reviewStatus?: string): Promise<Obligation[]> => {
    try {
      const res = await apiClient.get<Obligation[]>('/obligations', {
        params: {
          circular_id: circularId,
          applicability,
          review_status: reviewStatus,
        },
      });
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      let list = [...mockStore.obligations];
      if (circularId) list = list.filter(o => o.circular_id === circularId);
      if (applicability) list = list.filter(o => o.applicability === applicability);
      if (reviewStatus) list = list.filter(o => o.review_status === reviewStatus);
      return list;
    }
  },

  getObligation: async (id: string): Promise<Obligation> => {
    try {
      const res = await apiClient.get<Obligation>(`/obligations/${id}`);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.obligations.find(o => o.id === id) || mockStore.obligations[0];
    }
  },

  reviewObligation: async (id: string, payload: Partial<Obligation>, _userId?: string): Promise<Obligation> => {
    try {
      const res = await apiClient.put<Obligation>(`/obligations/${id}/review`, payload);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      if (payload.review_status) {
        mockStore.updateObligationStatus(id, payload.review_status, payload.reviewer_notes);
      }
      if (payload.applicability) {
        mockStore.updateApplicability(id, payload.applicability, payload.reviewer_notes);
      }
      return mockStore.obligations.find(o => o.id === id) || mockStore.obligations[0];
    }
  },

  // Policies
  getPolicies: async (query?: string, category?: string): Promise<Policy[]> => {
    try {
      const res = await apiClient.get<Policy[]>('/policies', {
        params: { query, category },
      });
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      let list = [...mockStore.policies];
      if (query) {
        const q = query.toLowerCase();
        list = list.filter(p => p.title.toLowerCase().includes(q) || p.policy_code.toLowerCase().includes(q));
      }
      if (category) {
        list = list.filter(p => p.category === category);
      }
      return list;
    }
  },

  saveMapping: async (obligationId: string, mapping: any, _userId?: string): Promise<ObligationMapping> => {
    try {
      const res = await apiClient.post<ObligationMapping>(`/obligations/${obligationId}/mapping`, mapping);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      mockStore.saveMapping(obligationId, mapping.policy_id, mapping.rationale, mapping.match_type || 'EXACT');
      return mockStore.mappings.find(m => m.obligation_id === obligationId) || mockStore.mappings[0];
    }
  },

  // Rules
  getRules: async (): Promise<Rule[]> => {
    try {
      const res = await apiClient.get<Rule[]>('/rules');
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.rules;
    }
  },

  getRule: async (id: string): Promise<Rule> => {
    try {
      const res = await apiClient.get<Rule>(`/rules/${id}`);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.rules.find(r => r.id === id) || mockStore.rules[0];
    }
  },

  getRuleVersions: async (ruleId: string): Promise<RuleVersion[]> => {
    try {
      const res = await apiClient.get<RuleVersion[]>(`/rules/${ruleId}/versions`);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.ruleVersions.filter(v => v.rule_id === ruleId);
    }
  },

  getRuleVersionDetail: async (ruleId: string, versionId: string): Promise<RuleVersion> => {
    try {
      const res = await apiClient.get<RuleVersion>(`/rules/${ruleId}/versions/${versionId}`);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.ruleVersions.find(v => v.id === versionId) || mockStore.ruleVersions[0];
    }
  },

  validateRuleDsl: async (_dslDefinition: Record<string, any>): Promise<{ is_valid: boolean; errors: string[] }> => {
    return { is_valid: true, errors: [] };
  },

  createRuleVersionDraft: async (ruleId: string, draft: { version_number: string; dsl_definition: any; change_summary: string }, _userId?: string): Promise<RuleVersion> => {
    try {
      const res = await apiClient.post<RuleVersion>(`/rules/${ruleId}/versions`, draft);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      mockStore.saveRuleDraft(ruleId, draft.dsl_definition, draft.change_summary);
      return mockStore.ruleVersions[0];
    }
  },

  // Test Suite
  getTestCases: async (ruleId: string): Promise<TestCase[]> => {
    try {
      const res = await apiClient.get<TestCase[]>(`/rules/${ruleId}/test-cases`);
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.testCases.filter(t => t.rule_id === ruleId || ruleId === 'rule-cr-2026-01');
    }
  },

  executeTestRun: async (_ruleId: string, _versionId: string, _userId?: string): Promise<TestRun> => {
    const mockStore = useMockDataStore();
    return mockStore.runSimulatedTests();
  },

  getVersionTestRuns: async (_ruleId: string, _versionId: string): Promise<TestRun[]> => {
    const mockStore = useMockDataStore();
    return mockStore.testRuns;
  },

  // Impact Simulator
  simulateImpact: async (_baselineVersionId: string, _candidateVersionId: string, _datasetVersion?: string, _userId?: string): Promise<ImpactReport> => {
    const mockStore = useMockDataStore();
    return mockStore.runSimulatedImpact();
  },

  getImpactReport: async (_id: string): Promise<ImpactReport> => {
    const mockStore = useMockDataStore();
    return mockStore.impactReports[0];
  },

  // Approvals
  getApprovals: async (): Promise<Approval[]> => {
    try {
      const res = await apiClient.get<Approval[]>('/approvals');
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.approvals;
    }
  },

  recordApproval: async (payload: { rule_version_id: string; test_run_id: string; impact_report_id?: string; decision: string; rationale: string }, _userId?: string): Promise<Approval> => {
    const mockStore = useMockDataStore();
    const submission = mockStore.submissions.find(s => s.rule_version === payload.rule_version_id) || mockStore.submissions[0];
    mockStore.submitApprovalDecision(submission.id, payload.decision as any, payload.rationale);
    return mockStore.approvals[0];
  },

  // Deployments
  getDeployments: async (): Promise<Deployment[]> => {
    try {
      const res = await apiClient.get<Deployment[]>('/deployments');
      return res.data;
    } catch {
      const mockStore = useMockDataStore();
      return mockStore.deployments;
    }
  },

  deployToSandbox: async (payload: { rule_version_id: string; approval_id: string; notes?: string }, _userId?: string): Promise<Deployment> => {
    const mockStore = useMockDataStore();
    return mockStore.deploySandbox(payload.rule_version_id, payload.notes);
  },

  rollbackDeployment: async (payload: { deployment_id: string; target_version_id: string; reason: string }, _userId?: string): Promise<Deployment> => {
    const mockStore = useMockDataStore();
    return mockStore.rollbackSandbox(payload.target_version_id, payload.reason);
  },

  // Admin User & System Management
  updateUserRole: async (userId: string, newRole: string): Promise<any> => {
    const mockStore = useMockDataStore();
    mockStore.updateUser(userId, { role: newRole as any });
    return { status: 'success' };
  },

  updateUserStatus: async (userId: string, isActive: boolean): Promise<any> => {
    const mockStore = useMockDataStore();
    mockStore.updateUser(userId, { is_active: isActive });
    return { status: 'success' };
  },

  // Audit & Evidence
  getAuditEvents: async (_eventType?: string, _entityType?: string, _limit?: number): Promise<AuditEvent[]> => {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        let q = supabase.from('audit_events').select('*').order('timestamp', { ascending: false });
        if (_eventType) q = q.eq('event_type', _eventType);
        if (_entityType) q = q.eq('entity_type', _entityType);
        if (_limit) q = q.limit(_limit);
        const { data, error } = await q;
        if (!error && data && data.length > 0) {
          return data as AuditEvent[];
        }
      } catch (err) {
        console.warn('Supabase audit_events query error, falling back', err);
      }
    }

    const mockStore = useMockDataStore();
    let events = [...mockStore.auditEvents];
    if (_eventType) events = events.filter(e => e.event_type === _eventType);
    if (_entityType) events = events.filter(e => e.entity_type === _entityType);
    if (_limit) events = events.slice(0, _limit);
    return events;
  },

  recordAuditEvent: async (event: Partial<AuditEvent>): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.from('audit_events').insert({
          id: event.id || `aud-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor_id: event.actor_id || 'usr-analyst-01',
          actor_name: event.actor_name || 'System Operator',
          actor_role: event.actor_role || 'COMPLIANCE_ANALYST',
          event_type: event.event_type || 'SYSTEM_ACTION',
          entity_type: event.entity_type || 'SYSTEM',
          entity_id: event.entity_id || 'sys-01',
          action: event.action || 'Recorded system transition',
          details: event.details || {},
        });
      } catch (err) {
        console.warn('Supabase recordAuditEvent error', err);
      }
    }
  },

  subscribeToAuditEvents: (callback: (payload: any) => void) => {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) return null;
    return supabase
      .channel('public:audit_events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_events' }, callback)
      .subscribe();
  },

  getEvidenceDossier: async (_ruleVersionId: string): Promise<any> => {
    const mockStore = useMockDataStore();
    return {
      rule_version: mockStore.candidateVersion,
      evidence_items: mockStore.evidence,
      test_run: mockStore.latestTestRun,
      impact_report: mockStore.latestImpactReport,
      circular: mockStore.circulars[0],
    };
  },

  getHealth: async (): Promise<any> => {
    return { status: 'healthy', version: '2.0.0', services: { db: 'online', ast_engine: 'online' } };
  }
};
