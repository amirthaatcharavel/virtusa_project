import { defineStore } from 'pinia';

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    selectedCircularId: 'circ-rbi-2026-84' as string | null,
    selectedObligationId: 'obl-01' as string | null,
    selectedRuleId: 'rule-cr-01' as string | null,
    selectedCandidateVersionId: 'ver-cand-01' as string | null,
    selectedBaselineVersionId: 'ver-base-01' as string | null,
    lastTestRunId: 'tr-01' as string | null,
    lastImpactReportId: 'ir-01' as string | null,
  }),

  actions: {
    selectCircular(id: string) {
      this.selectedCircularId = id;
    },
    selectObligation(id: string) {
      this.selectedObligationId = id;
    },
    selectRule(id: string) {
      this.selectedRuleId = id;
    },
    setVersionContext(candidateId: string, baselineId: string) {
      this.selectedCandidateVersionId = candidateId;
      this.selectedBaselineVersionId = baselineId;
    },
    setExecutionEvidence(testRunId: string, impactReportId?: string) {
      this.lastTestRunId = testRunId;
      if (impactReportId) this.lastImpactReportId = impactReportId;
    }
  }
});
