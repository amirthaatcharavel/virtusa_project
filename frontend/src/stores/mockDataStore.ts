import { defineStore } from 'pinia';
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
import {
  INITIAL_USERS,
  INITIAL_CIRCULARS,
  INITIAL_OBLIGATIONS,
  INITIAL_EVIDENCE,
  INITIAL_POLICIES,
  INITIAL_MAPPINGS,
  INITIAL_ENGINEERING_TASKS,
  INITIAL_RULES,
  INITIAL_RULE_VERSIONS,
  INITIAL_TEST_CASES,
  INITIAL_TEST_RUN,
  INITIAL_IMPACT_REPORT,
  INITIAL_SUBMISSIONS,
  INITIAL_APPROVALS,
  INITIAL_DEPLOYMENTS,
  INITIAL_INTEGRATIONS,
  INITIAL_PIPELINE_JOBS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_SYSTEM_CONFIG,
  type EngineeringTask,
  type ApprovalSubmission,
  type SourceEvidenceItem,
  type IntegrationHealth,
  type ProcessingPipelineJob,
  type SystemConfiguration,
} from '../mock/mockData';

const STORAGE_KEY = 'regulatory_mock_store_v2';

export const useMockDataStore = defineStore('mockData', {
  state: () => {
    // Attempt to load saved state from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          users: (parsed.users || INITIAL_USERS) as User[],
          circulars: (parsed.circulars || INITIAL_CIRCULARS) as Circular[],
          obligations: (parsed.obligations || INITIAL_OBLIGATIONS) as Obligation[],
          evidence: (parsed.evidence || INITIAL_EVIDENCE) as SourceEvidenceItem[],
          policies: (parsed.policies || INITIAL_POLICIES) as Policy[],
          mappings: (parsed.mappings || INITIAL_MAPPINGS) as ObligationMapping[],
          engineeringTasks: (parsed.engineeringTasks || INITIAL_ENGINEERING_TASKS) as EngineeringTask[],
          rules: (parsed.rules || INITIAL_RULES) as Rule[],
          ruleVersions: (parsed.ruleVersions || INITIAL_RULE_VERSIONS) as RuleVersion[],
          testCases: (parsed.testCases || INITIAL_TEST_CASES) as TestCase[],
          testRuns: (parsed.testRuns || [INITIAL_TEST_RUN]) as TestRun[],
          impactReports: (parsed.impactReports || [INITIAL_IMPACT_REPORT]) as ImpactReport[],
          submissions: (parsed.submissions || INITIAL_SUBMISSIONS) as ApprovalSubmission[],
          approvals: (parsed.approvals || INITIAL_APPROVALS) as Approval[],
          deployments: (parsed.deployments || INITIAL_DEPLOYMENTS) as Deployment[],
          integrations: (parsed.integrations || INITIAL_INTEGRATIONS) as IntegrationHealth[],
          pipelineJobs: (parsed.pipelineJobs || INITIAL_PIPELINE_JOBS) as ProcessingPipelineJob[],
          auditEvents: (parsed.auditEvents || INITIAL_AUDIT_EVENTS) as AuditEvent[],
          systemConfig: (parsed.systemConfig || INITIAL_SYSTEM_CONFIG) as SystemConfiguration,
          activeEvidenceIndex: 0,
        };
      } catch (err) {
        console.warn('Failed parsing saved mock state, resetting to initial fixtures', err);
      }
    }

    return {
      users: [...INITIAL_USERS],
      circulars: [...INITIAL_CIRCULARS],
      obligations: [...INITIAL_OBLIGATIONS],
      evidence: [...INITIAL_EVIDENCE],
      policies: [...INITIAL_POLICIES],
      mappings: [...INITIAL_MAPPINGS],
      engineeringTasks: [...INITIAL_ENGINEERING_TASKS],
      rules: [...INITIAL_RULES],
      ruleVersions: [...INITIAL_RULE_VERSIONS],
      testCases: [...INITIAL_TEST_CASES],
      testRuns: [INITIAL_TEST_RUN],
      impactReports: [INITIAL_IMPACT_REPORT],
      submissions: [...INITIAL_SUBMISSIONS],
      approvals: [...INITIAL_APPROVALS],
      deployments: [...INITIAL_DEPLOYMENTS],
      integrations: [...INITIAL_INTEGRATIONS],
      pipelineJobs: [...INITIAL_PIPELINE_JOBS],
      auditEvents: [...INITIAL_AUDIT_EVENTS],
      systemConfig: { ...INITIAL_SYSTEM_CONFIG },
      activeEvidenceIndex: 0,
    };
  },

  getters: {
    // Current active evidence record
    currentEvidence: (state) => state.evidence[state.activeEvidenceIndex] || state.evidence[0],

    // Submissions pending approval
    pendingSubmissions: (state) => state.submissions.filter((s) => s.status === 'PENDING'),

    // Active candidate version
    candidateVersion: (state) => state.ruleVersions.find((v) => v.version_number === 'v1.1.0-draft') || state.ruleVersions[1],
    baselineVersion: (state) => state.ruleVersions.find((v) => v.version_number === 'v1.0.0') || state.ruleVersions[0],

    // Latest test run
    latestTestRun: (state) => state.testRuns[0] || INITIAL_TEST_RUN,

    // Latest impact report
    latestImpactReport: (state) => state.impactReports[0] || INITIAL_IMPACT_REPORT,

    // Task counts
    taskStats: (state) => {
      const assigned = state.engineeringTasks.filter((t) => t.status === 'ASSIGNED').length;
      const inProgress = state.engineeringTasks.filter((t) => t.status === 'IN_PROGRESS').length;
      const completed = state.engineeringTasks.filter((t) => t.status === 'COMPLETED').length;
      return { assigned, inProgress, completed, total: state.engineeringTasks.length };
    },

    // Metrics for Compliance Analyst
    analystMetrics: (state) => ({
      active_circulars: state.circulars.length,
      unreviewed_obligations: state.obligations.filter((o) => o.review_status === 'PENDING').length,
      applicable_obligations: state.obligations.filter((o) => o.applicability === 'APPLICABLE').length,
      unresolved_applicability: state.obligations.filter((o) => o.applicability === 'UNRESOLVED').length,
      mapped_policies: state.mappings.length,
      gaps_detected: state.mappings.filter((m) => m.match_type === 'PARTIAL' || m.match_type === 'NEW_POLICY_NEEDED').length,
    }),

    // Metrics for Rule Engineer
    engineerMetrics: (state) => ({
      assigned_tasks: state.engineeringTasks.filter((t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length,
      candidate_version: 'v1.1.0-draft',
      tests_passing: state.testRuns[0]?.passed_tests || 5,
      tests_total: state.testRuns[0]?.total_tests || 5,
      pass_rate_pct: 100,
      sandbox_status: 'v1.0.0 ACTIVE',
    }),

    // Metrics for Compliance Approver
    approverMetrics: (state) => ({
      pending_approvals: state.submissions.filter((s) => s.status === 'PENDING').length,
      approved_count: state.submissions.filter((s) => s.status === 'APPROVED').length,
      rejected_count: state.submissions.filter((s) => s.status === 'REJECTED').length,
      changes_requested_count: state.submissions.filter((s) => s.status === 'CHANGES_REQUESTED').length,
      assertions_verified: '5 / 5 PASS',
      rwa_portfolio_delta: '+₹27.50M RWA',
    }),

    // Metrics for Platform Admin
    adminMetrics: (state) => ({
      total_users: state.users.length,
      active_users: state.users.filter((u) => u.is_active).length,
      system_health: '100% OPERATIONAL',
      audit_events_count: state.auditEvents.length,
      integrations_online: state.integrations.filter((i) => i.status === 'HEALTHY').length,
      pipeline_jobs_count: state.pipelineJobs.length,
    }),
  },

  actions: {
    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state));
      } catch (err) {
        console.warn('Failed persisting to localStorage', err);
      }
    },

    resetAllData() {
      localStorage.removeItem(STORAGE_KEY);
      this.$patch({
        users: [...INITIAL_USERS],
        circulars: [...INITIAL_CIRCULARS],
        obligations: [...INITIAL_OBLIGATIONS],
        evidence: [...INITIAL_EVIDENCE],
        policies: [...INITIAL_POLICIES],
        mappings: [...INITIAL_MAPPINGS],
        engineeringTasks: [...INITIAL_ENGINEERING_TASKS],
        rules: [...INITIAL_RULES],
        ruleVersions: [...INITIAL_RULE_VERSIONS],
        testCases: [...INITIAL_TEST_CASES],
        testRuns: [INITIAL_TEST_RUN],
        impactReports: [INITIAL_IMPACT_REPORT],
        submissions: [...INITIAL_SUBMISSIONS],
        approvals: [...INITIAL_APPROVALS],
        deployments: [...INITIAL_DEPLOYMENTS],
        integrations: [...INITIAL_INTEGRATIONS],
        pipelineJobs: [...INITIAL_PIPELINE_JOBS],
        auditEvents: [...INITIAL_AUDIT_EVENTS],
        systemConfig: { ...INITIAL_SYSTEM_CONFIG },
        activeEvidenceIndex: 0,
      });
    },

    logAudit(action: string, entityType: string, entityId: string, details: Record<string, any> = {}, actorName = 'System Demo') {
      const event: AuditEvent = {
        id: `aud-${Date.now()}`,
        event_type: action.toUpperCase().replace(/\s+/g, '_'),
        actor_name: actorName,
        actor_role: 'DEMO_USER',
        entity_type: entityType,
        entity_id: entityId,
        action,
        details,
        timestamp: new Date().toISOString(),
      };
      this.auditEvents.unshift(event);
      this.saveToStorage();
    },

    // 1. Analyst Actions
    uploadCircular(payload: { title: string; source_authority: string; circular_number: string; publication_date: string; effective_date: string; fileName: string; fileSizeMb: number }) {
      const newCircular: Circular = {
        id: `circ-custom-${Date.now()}`,
        title: payload.title,
        filename: payload.fileName,
        file_hash: Math.random().toString(16).substring(2, 18),
        source_authority: payload.source_authority,
        circular_number: payload.circular_number || `REG-${new Date().getFullYear()}/${Math.floor(Math.random() * 900 + 100)}`,
        publication_date: payload.publication_date,
        effective_date: payload.effective_date,
        status: 'PARSED',
        page_count: Math.floor(Math.random() * 12 + 4),
        created_at: new Date().toISOString(),
        obligations_count: 1,
        extracted_text: `Extracted regulatory mandate from ${payload.fileName}: Mandatory operational controls and threshold compliance reporting.`,
      };

      const extractedObligation: Obligation = {
        id: `obl-gen-${Date.now()}`,
        circular_id: newCircular.id,
        obligation_code: `OBL-${new Date().getFullYear()}-${Math.floor(Math.random() * 899 + 100)}`,
        title: `Compliance requirement derived from ${payload.title}`,
        extracted_text: `Regulated entities must ensure adherence to stated limits in ${payload.circular_number || 'circular mandate'}.`,
        source_page: 2,
        source_span: 'Section 1.1',
        actor: 'Regulated Financial Entity',
        action: 'Review and implement operational limits',
        conditions: 'Applicable upon publication',
        review_status: 'PENDING',
        applicability: 'UNRESOLVED',
        flags: ['INGESTED_RECORD'],
      };

      this.circulars.unshift(newCircular);
      this.obligations.unshift(extractedObligation);
      this.logAudit('Ingested Regulatory Circular', 'CIRCULAR', newCircular.id, { title: newCircular.title, authority: newCircular.source_authority });
      this.saveToStorage();
      return newCircular;
    },

    updateObligationStatus(id: string, status: Obligation['review_status'], reviewerNotes?: string) {
      const ob = this.obligations.find((o) => o.id === id);
      if (ob) {
        ob.review_status = status;
        if (reviewerNotes !== undefined) ob.reviewer_notes = reviewerNotes;
        ob.reviewed_at = new Date().toISOString();
        this.logAudit(`Updated Obligation Review Status to ${status}`, 'OBLIGATION', id, { status, reviewerNotes });
        this.saveToStorage();
      }
    },

    updateApplicability(id: string, applicability: Obligation['applicability'], comments?: string) {
      const ob = this.obligations.find((o) => o.id === id);
      if (ob) {
        ob.applicability = applicability;
        if (comments) ob.reviewer_notes = comments;
        ob.reviewed_at = new Date().toISOString();
        this.logAudit(`Certified Applicability as ${applicability}`, 'OBLIGATION', id, { applicability, comments });
        this.saveToStorage();
      }
    },

    setEvidenceIndex(index: number) {
      if (index >= 0 && index < this.evidence.length) {
        this.activeEvidenceIndex = index;
      }
    },

    saveMapping(obligationId: string, policyId: string, rationale: string, matchType: ObligationMapping['match_type'] = 'EXACT') {
      const existing = this.mappings.find((m) => m.obligation_id === obligationId);
      if (existing) {
        existing.policy_id = policyId;
        existing.rationale = rationale;
        existing.match_type = matchType;
        existing.mapping_status = 'MAPPED';
        existing.mapped_at = new Date().toISOString();
      } else {
        const newMap: ObligationMapping = {
          id: `map-${Date.now()}`,
          obligation_id: obligationId,
          policy_id: policyId,
          mapping_status: 'MAPPED',
          match_type: matchType,
          match_score: 0.95,
          rationale,
          mapped_at: new Date().toISOString(),
        };
        this.mappings.unshift(newMap);
      }
      this.logAudit('Saved Policy Mapping', 'MAPPING', obligationId, { policyId, rationale });
      this.saveToStorage();
    },

    // 2. Rule Engineer Actions
    updateTaskStatus(taskId: string, status: EngineeringTask['status']) {
      const task = this.engineeringTasks.find((t) => t.id === taskId);
      if (task) {
        task.status = status;
        task.updated_at = new Date().toISOString();
        this.logAudit(`Updated Task Status to ${status}`, 'ENGINEERING_TASK', taskId, { status });
        this.saveToStorage();
      }
    },

    saveRuleDraft(ruleId: string, dslDefinition: Record<string, any>, changeSummary: string) {
      const existingDraft = this.ruleVersions.find((v) => v.rule_id === ruleId && v.version_number.includes('draft'));
      if (existingDraft) {
        existingDraft.dsl_definition = dslDefinition;
        existingDraft.change_summary = changeSummary;
        existingDraft.created_at = new Date().toISOString();
      } else {
        const newVer: RuleVersion = {
          id: `ver-${Date.now()}`,
          rule_id: ruleId,
          version_number: 'v1.1.1-draft',
          dsl_definition: dslDefinition,
          change_summary: changeSummary,
          is_valid: true,
          validation_errors: [],
          created_at: new Date().toISOString(),
        };
        this.ruleVersions.unshift(newVer);
      }
      this.logAudit('Saved Rule AST Draft', 'RULE_VERSION', ruleId, { changeSummary });
      this.saveToStorage();
    },

    runSimulatedTests(): Promise<TestRun> {
      return new Promise((resolve) => {
        setTimeout(() => {
          const run: TestRun = {
            id: `tr-${Date.now()}`,
            rule_version_id: 'ver-cr-v110-draft',
            total_tests: this.testCases.length,
            passed_tests: this.testCases.length,
            failed_tests: 0,
            status: 'PASSED',
            executed_at: new Date().toISOString(),
            results_detail: this.testCases.map((tc) => ({
              test_case_id: tc.id,
              name: tc.name,
              input_payload: tc.input_payload,
              expected: tc.expected_outcome,
              actual: tc.expected_outcome,
              status: 'PASS',
            })),
          };
          this.testRuns.unshift(run);
          this.logAudit('Executed Deterministic Test Run', 'TEST_RUN', run.id, { pass_count: run.passed_tests, total: run.total_tests });
          this.saveToStorage();
          resolve(run);
        }, 800);
      });
    },

    runSimulatedImpact(): Promise<ImpactReport> {
      return new Promise((resolve) => {
        setTimeout(() => {
          const report: ImpactReport = {
            id: `imp-${Date.now()}`,
            baseline_version_id: 'ver-cr-v100',
            candidate_version_id: 'ver-cr-v110-draft',
            dataset_version: 'SYNTHETIC_RETAIL_LOANS_2026_Q1',
            total_evaluated: 10000,
            unchanged_count: 5620,
            changed_count: 4380,
            differences: INITIAL_IMPACT_REPORT.differences,
            synthetic_disclosure: 'Simulated impact evaluated on 10,000 anonymized synthetic bank accounts.',
            generated_at: new Date().toISOString(),
          };
          this.impactReports.unshift(report);
          this.logAudit('Generated Simulated Impact Report', 'IMPACT_REPORT', report.id, { changed: 4380, unchanged: 5620 });
          this.saveToStorage();
          resolve(report);
        }, 900);
      });
    },

    deploySandbox(ruleVersionId: string, notes?: string) {
      const dep: Deployment = {
        id: `dep-${Date.now()}`,
        rule_version_id: ruleVersionId,
        approval_id: 'appr-simulated-01',
        environment: 'SANDBOX_PRIMARY',
        status: 'DEPLOYED',
        deployed_by_id: 'usr-engineer-01',
        deployed_at: new Date().toISOString(),
        notes: notes || 'Simulated sandbox release demonstration.',
      };
      this.deployments.unshift(dep);
      this.logAudit('Promoted Rule Version to Sandbox', 'DEPLOYMENT', dep.id, { version: ruleVersionId });
      this.saveToStorage();
      return dep;
    },

    rollbackSandbox(targetVersionId: string, reason: string) {
      const dep: Deployment = {
        id: `dep-rb-${Date.now()}`,
        rule_version_id: targetVersionId,
        approval_id: 'appr-rollback',
        environment: 'SANDBOX_PRIMARY',
        status: 'ROLLED_BACK',
        deployed_by_id: 'usr-engineer-01',
        deployed_at: new Date().toISOString(),
        notes: `Simulated rollback: ${reason}`,
      };
      this.deployments.unshift(dep);
      this.logAudit('Executed Sandbox Rollback', 'DEPLOYMENT', dep.id, { targetVersionId, reason });
      this.saveToStorage();
      return dep;
    },

    // 3. Approver Actions
    submitApprovalDecision(submissionId: string, decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED', comments: string, approverName = 'Vikram Mehta') {
      const sub = this.submissions.find((s) => s.id === submissionId);
      if (sub) {
        sub.status = decision;
        sub.comments = comments;
        sub.decision_maker = approverName;
        sub.decision_date = new Date().toISOString();

        const appr: Approval = {
          id: `appr-${Date.now()}`,
          rule_version_id: sub.rule_version,
          test_run_id: sub.test_run_id,
          approver_id: 'usr-approver-01',
          decision: decision === 'CHANGES_REQUESTED' ? 'REVISION_REQUESTED' : decision,
          rationale: comments,
          decided_at: new Date().toISOString(),
        };
        this.approvals.unshift(appr);
        this.logAudit(`Compliance Approver Decided: ${decision}`, 'APPROVAL', sub.id, { decision, comments }, approverName);
        this.saveToStorage();
      }
    },

    // 4. Admin Actions
    addUser(userData: Omit<User, 'id'>) {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        ...userData,
      };
      this.users.push(newUser);
      this.logAudit(`Added New User Account ${newUser.full_name}`, 'USER', newUser.id, { role: newUser.role, email: newUser.email });
      this.saveToStorage();
      return newUser;
    },

    updateUser(userId: string, partial: Partial<User>) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        Object.assign(user, partial);
        this.logAudit(`Updated User Profile for ${user.full_name}`, 'USER', userId, partial);
        this.saveToStorage();
      }
    },

    toggleUserStatus(userId: string) {
      const user = this.users.find((u) => u.id === userId);
      if (user) {
        user.is_active = !user.is_active;
        this.logAudit(`${user.is_active ? 'Activated' : 'Deactivated'} User Account`, 'USER', userId, { is_active: user.is_active });
        this.saveToStorage();
      }
    },

    updateSystemConfig(newConfig: Partial<SystemConfiguration>) {
      Object.assign(this.systemConfig, newConfig);
      this.logAudit('Updated Platform Configuration Preferences', 'SYSTEM_CONFIG', 'global', newConfig);
      this.saveToStorage();
    },

    resetSystemConfig() {
      this.systemConfig = { ...INITIAL_SYSTEM_CONFIG };
      this.logAudit('Reset Platform Configuration to Factory Defaults', 'SYSTEM_CONFIG', 'global');
      this.saveToStorage();
    }
  }
});
