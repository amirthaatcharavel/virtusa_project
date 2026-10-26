<template>
  <DashboardLayout
    roleBadgeText="Dual-Control Governance"
    operatorName="Vikram Mehta"
    pageTitle="Compliance Sign-off & Audit Decision Center"
    pageSubtitle="Independent evaluation of candidate rule versions against authentic regulatory citations, deterministic test evidence, and simulated borrower impact."
    :metricCards="metricCards"
    :moduleTabs="moduleTabs"
    v-model:activeTab="activeTab"
  >
    <template #header-actions>
      <AppButton variant="primary" size="sm" @click="activeTab = 'module-a'">
        <AppIcon name="approvals" :size="14" />
        Sign-off Center
      </AppButton>
      <AppButton variant="outline" size="sm" @click="activeTab = 'module-b'">
        <AppIcon name="file-text" :size="14" />
        Evidence Dossier
      </AppButton>
    </template>

    <!-- ======================================================== -->
    <!-- MODULE A: APPROVAL CENTER AND QUEUE                      -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'module-a'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module A: Formal Approval Queue</h2>
            <span class="px-2 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#14263D]/10 text-[#14263D] border border-[#14263D]/20 font-medium">
              Dual-Control Enforced
            </span>
          </div>
          <p class="text-xs text-[#526173]">Submissions awaiting independent compliance officer determination. Author cannot sign off on own submissions.</p>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            v-for="st in ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED']"
            :key="st"
            @click="submissionFilter = st"
            class="px-2.5 py-1 text-xs rounded-[3px] border font-mono transition-colors"
            :class="submissionFilter === st ? 'bg-[#14263D] text-white border-[#14263D] font-medium' : 'bg-white border-[#E1E5E8] text-[#526173] hover:bg-[#F6F5F0]'"
          >
            {{ st }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Submissions Table -->
        <div class="lg:col-span-7 space-y-3">
          <AppCard title="Candidate Rule Submissions" subtitle="Click any submission to inspect dossier and record determination" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div
                v-for="sub in filteredSubmissions"
                :key="sub.id"
                @click="selectedSubmission = sub"
                class="p-3.5 text-xs cursor-pointer transition-colors"
                :class="selectedSubmission?.id === sub.id ? 'bg-[#167D83]/10 border-l-2 border-[#167D83]' : 'hover:bg-[#F6F5F0]'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-[#14263D]">{{ sub.id }} · {{ sub.rule_version }}</span>
                  <div class="flex items-center gap-1.5">
                    <AppBadge :variant="sub.priority === 'HIGH' || sub.priority === 'CRITICAL' ? 'warning' : 'navy'">
                      {{ sub.priority }}
                    </AppBadge>
                    <AppBadge :variant="sub.status === 'APPROVED' ? 'success' : sub.status === 'PENDING' ? 'warning' : 'error'">
                      {{ sub.status }}
                    </AppBadge>
                  </div>
                </div>

                <div class="font-semibold text-[#182533] mt-1.5">{{ sub.summary }}</div>
                <div class="text-[11px] text-[#526173] mt-1 flex items-center justify-between">
                  <span>Author: <strong class="text-[#182533]">{{ sub.submitter }}</strong></span>
                  <span class="font-mono">{{ new Date(sub.submitted_date).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Submission Detail & Interactive Decision Panel -->
        <div class="lg:col-span-5">
          <AppCard v-if="selectedSubmission" title="Approval Decision Desk" subtitle="Mandatory compliance determination actions" noPadding>
            <div class="p-4 space-y-4 text-xs">
              <div class="p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-[#14263D]">{{ selectedSubmission.rule_code }}</span>
                  <AppBadge :variant="selectedSubmission.status === 'APPROVED' ? 'success' : 'warning'">
                    {{ selectedSubmission.status }}
                  </AppBadge>
                </div>
                <div class="text-[11px] text-[#182533] font-medium leading-relaxed">
                  {{ selectedSubmission.summary }}
                </div>
                <div class="text-[10px] text-[#526173] pt-1 border-t border-[#E1E5E8] flex items-center justify-between font-mono">
                  <span>Submitter: {{ selectedSubmission.submitter }}</span>
                  <span>Version: {{ selectedSubmission.rule_version }}</span>
                </div>
              </div>

              <!-- Quick Verification Indicators -->
              <div class="grid grid-cols-2 gap-2 text-[11px]">
                <div class="p-2.5 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <span class="text-[10px] uppercase font-semibold text-[#526173] font-mono">Test Suite Status</span>
                  <div class="font-bold text-[#247653] mt-0.5 font-mono">5 / 5 Assertions Pass</div>
                </div>
                <div class="p-2.5 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <span class="text-[10px] uppercase font-semibold text-[#526173] font-mono">Dual Control</span>
                  <div class="font-bold text-[#247653] mt-0.5 font-mono">Arun != Vikram (OK)</div>
                </div>
              </div>

              <!-- Navigation shortcuts to Evidence and Tests -->
              <div class="flex items-center gap-2 pt-1">
                <AppButton variant="outline" size="sm" customClass="flex-1" @click="activeTab = 'module-b'">
                  <AppIcon name="file-text" :size="12" />
                  View Evidence
                </AppButton>
                <AppButton variant="outline" size="sm" customClass="flex-1" @click="activeTab = 'module-c'">
                  <AppIcon name="simulator" :size="12" />
                  View Test Results
                </AppButton>
              </div>

              <!-- Action Controls: Approve, Reject, Request Changes -->
              <div class="pt-2 border-t border-[#E1E5E8] space-y-2">
                <div class="text-[11px] font-semibold text-[#182533] uppercase font-mono">Record Determination:</div>
                <div class="grid grid-cols-3 gap-2">
                  <AppButton
                    variant="primary"
                    size="sm"
                    :disabled="selectedSubmission.status === 'APPROVED'"
                    @click="triggerDecision('APPROVED')"
                  >
                    Approve
                  </AppButton>
                  <AppButton
                    variant="outline"
                    size="sm"
                    @click="triggerDecision('CHANGES_REQUESTED')"
                  >
                    Request Changes
                  </AppButton>
                  <AppButton
                    variant="danger"
                    size="sm"
                    @click="triggerDecision('REJECTED')"
                  >
                    Reject
                  </AppButton>
                </div>
              </div>

              <div v-if="actionSuccessMessage" class="p-2 bg-[#247653]/10 border border-[#247653]/30 rounded-[3px] text-[11px] text-[#247653] text-center font-medium">
                {{ actionSuccessMessage }}
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE B: EVIDENCE AND RISK REVIEW                       -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-b'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module B: Evidence & Risk Review Dossier</h2>
          <p class="text-xs text-[#526173]">Verify citations against authority source texts and review risk indicators before sign-off.</p>
        </div>
        <router-link to="/circulars/circ-rbi-2026-84" class="text-xs font-semibold text-[#167D83] hover:text-[#14263D] flex items-center gap-1 transition-colors">
          Open Original Regulatory Circular →
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Supporting Evidence List -->
        <div class="lg:col-span-7 space-y-3">
          <AppCard title="Regulatory Source Evidence Items" subtitle="Extracted citations supporting candidate rule version" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div v-for="ev in mockStore.evidence" :key="ev.id" class="p-3.5 text-xs space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <AppIcon name="file-text" :size="13" class="text-[#167D83]" />
                    <span class="font-bold text-[#182533]">{{ ev.circular_ref }}</span>
                  </div>
                  <span class="px-2 py-0.5 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[10px] font-mono text-[#14263D] font-semibold">
                    PAGE {{ ev.page_number }}
                  </span>
                </div>

                <blockquote class="text-[11px] text-[#182533] pl-3 border-l-2 border-[#167D83] bg-[#F6F5F0]/60 py-2 rounded-[3px] italic font-sans leading-relaxed">
                  "{{ ev.highlighted_text }}"
                </blockquote>

                <div class="flex items-center justify-between text-[10px] text-[#526173] pt-1 font-mono">
                  <span>Confidence: <strong class="text-[#247653]">{{ (ev.confidence * 100).toFixed(0) }}%</strong></span>
                  <span>Hash: {{ ev.hash.substring(0, 16) }}...</span>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Risk Indicators & Warnings Panel -->
        <div class="lg:col-span-5 space-y-4">
          <AppCard title="Risk Indicators & Missing-Evidence Checklist" subtitle="Automated governance validation guards" noPadding>
            <div class="p-4 space-y-3 text-xs">
              <div class="p-3 bg-[#247653]/10 border border-[#247653]/30 rounded-[3px] text-[#247653] flex items-start gap-2">
                <AppIcon name="check" :size="13" class="mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Authority Citation Present:</strong> Cited Section 3(a) Page 4 matches text hash.
                </div>
              </div>

              <div class="p-3 bg-[#247653]/10 border border-[#247653]/30 rounded-[3px] text-[#247653] flex items-start gap-2">
                <AppIcon name="check" :size="13" class="mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Carve-Out Exemption Verified:</strong> Microfinance Self-Help Group exemption clause verified.
                </div>
              </div>

              <div class="p-3 bg-[#AD741B]/10 border border-[#AD741B]/30 rounded-[3px] text-[#AD741B] flex items-start gap-2">
                <AppIcon name="alert" :size="13" class="mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Supervisory Board Notice:</strong> Quarterly review return requirement remains pending clarification.
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE C: EXACT RULE VERSION AND TEST RESULTS            -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-c'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module C: Exact Rule Version & Test Audit</h2>
          <p class="text-xs text-[#526173]">Inspect immutable AST rule structure, boundary regression run, and portfolio delta.</p>
        </div>
        <span class="text-xs font-mono text-[#526173]">Test Run ID: {{ mockStore.latestTestRun.id }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div class="lg:col-span-6 space-y-4">
          <AppCard title="Submitted AST Specification" subtitle="RULE-CR-2026-01 (v1.1.0-draft)" noPadding>
            <div class="p-4 space-y-3 text-xs">
              <div class="p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] font-mono text-[11px] leading-relaxed">
                <span class="text-[#167D83] font-bold">IF</span> loan_type in ["UNSECURED_PERSONAL_LOAN", "CREDIT_CARD_REVOLVING"]<br/>
                <span class="text-[#167D83] font-bold">AND</span> borrower_type != "MICROFINANCE_SHG"<br/>
                <span class="text-[#167D83] font-bold">THEN</span> decision: "ENHANCED_RISK_WEIGHT" (125%)<br/>
                <span class="text-[#167D83] font-bold">FALLBACK</span> decision: "STANDARD_CARVE_OUT" (100%)
              </div>
              <div class="text-[11px] text-[#526173] flex items-center justify-between font-mono">
                <span>Evaluator: Pure Functional AST</span>
                <span class="text-[#247653] font-bold">Zero Security Flags</span>
              </div>
            </div>
          </AppCard>
        </div>

        <div class="lg:col-span-6 space-y-4">
          <AppCard title="Test Run Verification (tr-01-latest)" subtitle="5 boundary cases certified" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div
                v-for="tc in mockStore.latestTestRun.results_detail"
                :key="tc.test_case_id"
                class="p-3 text-xs flex items-center justify-between"
              >
                <div>
                  <span class="font-mono font-bold text-[#14263D]">{{ tc.test_case_id }}</span>
                  <div class="text-[#182533] font-medium mt-0.5">{{ tc.name }}</div>
                </div>
                <AppBadge variant="success">{{ tc.status }}</AppBadge>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE D: DECISION HISTORY                               -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-d'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module D: Governance Decision History</h2>
          <p class="text-xs text-[#526173]">Audit ledger of dual-control sign-off actions and rationale statements.</p>
        </div>
      </div>

      <AppCard title="Historical Approval Decisions" subtitle="Recorded compliance officer determinations" noPadding>
        <div class="divide-y divide-[#E1E5E8]">
          <div
            v-for="appr in mockStore.approvals"
            :key="appr.id"
            class="p-3.5 text-xs hover:bg-[#F6F5F0] transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-[#14263D]">{{ appr.id }}</span>
                <span class="text-[#526173]">·</span>
                <span class="font-mono font-semibold text-[#182533]">{{ appr.rule_version_id }}</span>
              </div>
              <AppBadge :variant="appr.decision === 'APPROVED' ? 'success' : appr.decision === 'REVISION_REQUESTED' ? 'warning' : 'error'">
                {{ appr.decision }}
              </AppBadge>
            </div>

            <p class="text-[11px] text-[#182533] mt-2 font-sans italic bg-[#F6F5F0]/60 p-2.5 rounded-[3px] border border-[#E1E5E8] leading-relaxed">
              "{{ appr.rationale }}"
            </p>

            <div class="mt-2.5 flex items-center justify-between text-[10px] text-[#526173] font-mono">
              <span>Sign-off Officer: Vikram Mehta</span>
              <span>Decided At: {{ new Date(appr.decided_at).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE E: EVIDENCE AND AUDIT REPORTS                     -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-e'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module E: Evidence & Audit Dossier Reports</h2>
          <p class="text-xs text-[#526173]">Download complete evidence packages containing source citations, test results, and impact matrices.</p>
        </div>
        <AppButton variant="primary" size="sm" @click="exportFullDossierJson">
          <AppIcon name="download" :size="13" />
          Export Complete Dossier (JSON)
        </AppButton>
      </div>

      <AppCard title="Available Compliance Dossiers" subtitle="Certified packages ready for external regulatory auditor review" noPadding>
        <div class="divide-y divide-[#E1E5E8]">
          <div class="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="font-bold text-[#182533] text-sm">RBI 2026/84 Consumer Credit Compliance Dossier</div>
              <div class="text-[11px] text-[#526173] mt-0.5">Includes citation hash, 5 passing test cases, and 10,000 synthetic account impact delta.</div>
              <div class="text-[10px] text-[#167D83] font-mono mt-1 font-semibold">Package ID: DOS-RBI-2026-CR-01</div>
            </div>
            <div class="flex items-center gap-2">
              <AppButton variant="outline" size="sm" @click="previewDossierModal = true">
                <AppIcon name="eye" :size="12" />
                Preview
              </AppButton>
              <AppButton variant="primary" size="sm" @click="exportDossierCsv">
                <AppIcon name="download" :size="12" />
                Export CSV
              </AppButton>
            </div>
          </div>

          <div class="p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div class="font-bold text-[#182533] text-sm">FinCEN Nested Correspondent Wire Audit Dossier</div>
              <div class="text-[11px] text-[#526173] mt-0.5">Approved rule v2.0.1 with $250k real-time screening certification.</div>
              <div class="text-[10px] text-[#167D83] font-mono mt-1 font-semibold">Package ID: DOS-FINCEN-2026-AML-03</div>
            </div>
            <div class="flex items-center gap-2">
              <AppButton variant="outline" size="sm" @click="previewDossierModal = true">
                <AppIcon name="eye" :size="12" />
                Preview
              </AppButton>
              <AppButton variant="primary" size="sm" @click="exportDossierCsv">
                <AppIcon name="download" :size="12" />
                Export CSV
              </AppButton>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- OVERVIEW TAB (DEFAULT)                                   -->
    <!-- ======================================================== -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-4">
          <AppCard title="Candidate Rule Version Under Review" subtitle="RULE-CR-2026-01 (v1.1.0-draft)" noPadding>
            <div class="p-3 bg-[#F6F5F0] border-b border-[#E1E5E8] flex items-center justify-between text-xs">
              <span class="font-mono text-[#14263D] font-bold">RBI Circular 2026/84 Mandate</span>
              <button @click="activeTab = 'module-a'" class="text-[#167D83] hover:text-[#14263D] font-medium text-xs transition-colors">
                Open Sign-off Center →
              </button>
            </div>
            <div class="p-4 space-y-3 text-xs">
              <p class="text-[#182533] italic font-sans leading-relaxed pl-3 border-l-2 border-[#167D83] bg-[#F6F5F0]/60 py-2 rounded-[3px]">
                "Risk weight on unsecured consumer credit enhanced from 100% to 125%... exempting microfinance and self-help group portfolios."
              </p>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="p-2.5 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <span class="text-[10px] uppercase font-semibold text-[#526173] font-mono">Test Suite Evidence</span>
                  <div class="font-mono text-[#247653] font-bold mt-0.5">5 of 5 Assertions Pass</div>
                </div>
                <div class="p-2.5 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <span class="text-[10px] uppercase font-semibold text-[#526173] font-mono">Simulated Loan Impact</span>
                  <div class="font-mono text-[#167D83] font-bold mt-0.5">4,380 Loans Re-weighted</div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <AppCard title="Pending Approver Submissions" subtitle="Items requiring formal action" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div
                v-for="sub in mockStore.submissions.slice(0, 3)"
                :key="sub.id"
                @click="activeTab = 'module-a'; selectedSubmission = sub"
                class="p-3 hover:bg-[#F6F5F0] cursor-pointer transition-colors text-xs"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-[#14263D]">{{ sub.id }}</span>
                  <AppBadge :variant="sub.status === 'APPROVED' ? 'success' : 'warning'">{{ sub.status }}</AppBadge>
                </div>
                <div class="font-semibold text-[#182533] mt-1">{{ sub.summary }}</div>
                <div class="text-[10px] text-[#526173] mt-1 font-mono">Submitter: {{ sub.submitter }}</div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Mandatory Comment & Confirmation Modal for Approvals/Rejections -->
    <ConfirmModal
      :open="confirmModalOpen"
      :title="confirmTitle"
      :subtitle="confirmSubtitle"
      :variant="decisionType === 'REJECTED' ? 'danger' : 'primary'"
      :confirmText="confirmButtonText"
      :requireComment="decisionType !== 'APPROVED'"
      commentLabel="Approver Justification & Review Notes"
      commentPlaceholder="Specify detailed compliance rationale or required changes for the engineering team..."
      v-model:comment="approverComment"
      :commentError="commentError"
      @confirm="executeDecision"
      @cancel="confirmModalOpen = false"
    >
      <p class="text-xs text-[#182533] leading-relaxed">
        You are recording a formal compliance determination for
        <strong class="font-mono text-[#14263D]">{{ selectedSubmission?.rule_code }} ({{ selectedSubmission?.rule_version }})</strong>.
        This demonstration decision will be logged to the immutable audit ledger.
      </p>
    </ConfirmModal>

    <!-- Dossier Preview Modal -->
    <div v-if="previewDossierModal" class="fixed inset-0 z-50 overflow-y-auto bg-[#0B1728]/70 backdrop-blur-2xs flex items-center justify-center p-4">
      <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-xl max-w-xl w-full p-5 space-y-4 text-left">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-sm font-bold text-[#14263D]">Regulatory Compliance Dossier Preview</h3>
            <p class="text-xs text-[#526173] font-mono mt-0.5">DOS-RBI-2026-CR-01</p>
          </div>
          <button @click="previewDossierModal = false" class="text-[#526173] hover:text-[#14263D]">
            <AppIcon name="close" :size="16" />
          </button>
        </div>

        <div class="p-3.5 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-xs space-y-2 font-mono">
          <div class="text-[#14263D] font-bold">--- COMPLIANCE CERTIFICATION DOSSIER ---</div>
          <div class="text-[#182533]">Authority Citation: RBI Circular 2026/84 (Page 4, Sec 3a)</div>
          <div class="text-[#182533]">Target Rule: RULE-CR-2026-01 (v1.1.0-draft)</div>
          <div class="text-[#247653] font-semibold">Test Suite: 5 Passed / 0 Failed (100% Deterministic Pass)</div>
          <div class="text-[#167D83] font-semibold">Simulated Impact: 4,380 Loans Re-weighted (+₹27.50M RWA Delta)</div>
          <div class="text-[#526173]">Sign-off Officer: Vikram Mehta (Compliance Approver)</div>
        </div>

        <div class="pt-2 flex justify-end gap-2">
          <AppButton variant="outline" size="sm" @click="exportDossierCsv">Download CSV</AppButton>
          <AppButton variant="primary" size="sm" @click="previewDossierModal = false">Close</AppButton>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMockDataStore } from '../../stores/mockDataStore';
import type { ApprovalSubmission } from '../../mock/mockData';
import DashboardLayout, { type MetricCardConfig, type ModuleTabConfig } from '../../components/dashboard/DashboardLayout.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';
import ConfirmModal from '../../components/dashboard/ConfirmModal.vue';

const mockStore = useMockDataStore();

const activeTab = ref('overview');
const submissionFilter = ref('ALL');

const selectedSubmission = ref<ApprovalSubmission | null>(mockStore.submissions[0] || null);
const actionSuccessMessage = ref('');

// Confirmation Modal State
const confirmModalOpen = ref(false);
const decisionType = ref<'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'>('APPROVED');
const approverComment = ref('');
const commentError = ref('');

// Preview Modal State
const previewDossierModal = ref(false);

const moduleTabs: ModuleTabConfig[] = [
  { id: 'overview', label: 'Governance Overview', icon: 'overview' },
  { id: 'module-a', label: 'A. Approval Center & Queue', icon: 'approvals', badge: mockStore.pendingSubmissions.length },
  { id: 'module-b', label: 'B. Evidence & Risk Review', icon: 'file-text' },
  { id: 'module-c', label: 'C. Exact Rule & Tests', icon: 'simulator', badge: '5 PASS' },
  { id: 'module-d', label: 'D. Decision History', icon: 'check', badge: mockStore.approvals.length },
  { id: 'module-e', label: 'E. Audit Reports & Dossiers', icon: 'audit' },
];

const metricCards = computed<MetricCardConfig[]>(() => [
  {
    title: 'Pending Submissions',
    value: mockStore.approverMetrics.pending_approvals,
    subtitle: 'Awaiting independent decision',
    valueClass: 'text-[#AD741B]',
    tag: 'Triage Queue',
    tagClass: 'bg-[#AD741B]/10 text-[#AD741B]',
  },
  {
    title: 'Test Assertions',
    value: mockStore.approverMetrics.assertions_verified,
    subtitle: 'Zero regressions verified',
    valueClass: 'text-[#247653]',
  },
  {
    title: 'Portfolio Delta',
    value: mockStore.approverMetrics.rwa_portfolio_delta,
    subtitle: '43.8% loans re-weighted',
    valueClass: 'text-[#167D83]',
  },
  {
    title: 'Dual-Control Audit',
    value: 'Segregation Verified',
    subtitle: 'Arun (Author) != Vikram (Approver)',
    tag: 'Policy Enforced',
    tagClass: 'bg-[#247653]/10 text-[#247653]',
  },
]);

const filteredSubmissions = computed(() => {
  let list = [...mockStore.submissions];
  if (submissionFilter.value !== 'ALL') {
    list = list.filter(s => s.status === submissionFilter.value);
  }
  return list;
});

const confirmTitle = computed(() => {
  switch (decisionType.value) {
    case 'APPROVED': return 'Confirm Compliance Sign-off';
    case 'REJECTED': return 'Confirm Submission Rejection';
    case 'CHANGES_REQUESTED': return 'Request Engineering Changes';
  }
});

const confirmSubtitle = computed(() => {
  switch (decisionType.value) {
    case 'APPROVED': return 'Certify candidate version for sandbox promotion';
    case 'REJECTED': return 'Reject candidate version with mandatory rationale';
    case 'CHANGES_REQUESTED': return 'Return to Rule Engineer with mandatory remediation notes';
  }
});

const confirmButtonText = computed(() => {
  switch (decisionType.value) {
    case 'APPROVED': return 'Sign-off & Approve';
    case 'REJECTED': return 'Reject Submission';
    case 'CHANGES_REQUESTED': return 'Send Change Request';
  }
});

const triggerDecision = (decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED') => {
  decisionType.value = decision;
  commentError.value = '';
  if (decision === 'APPROVED') {
    approverComment.value = 'Certified compliant with RBI Circular 2026/84. 100% test coverage verified.';
  } else {
    approverComment.value = '';
  }
  confirmModalOpen.value = true;
};

const executeDecision = () => {
  if (decisionType.value !== 'APPROVED' && (!approverComment.value || approverComment.value.trim().length < 5)) {
    commentError.value = 'A valid comment (minimum 5 characters) is mandatory when rejecting or requesting changes.';
    return;
  }

  if (selectedSubmission.value) {
    mockStore.submitApprovalDecision(selectedSubmission.value.id, decisionType.value, approverComment.value);
    actionSuccessMessage.value = `Recorded determination: ${decisionType.value} for ${selectedSubmission.value.id}.`;
    setTimeout(() => {
      actionSuccessMessage.value = '';
    }, 3000);
  }
  confirmModalOpen.value = false;
};

const exportFullDossierJson = () => {
  const dossierData = {
    package_id: 'DOS-RBI-2026-CR-01',
    exported_at: new Date().toISOString(),
    approver: 'Vikram Mehta (Compliance Approver)',
    rule: mockStore.rules[0],
    candidate_version: mockStore.candidateVersion,
    test_run: mockStore.latestTestRun,
    impact: mockStore.latestImpactReport,
    evidence: mockStore.evidence,
  };

  const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `compliance_dossier_RBI_2026_84.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportDossierCsv = () => {
  const rows = [
    ['Record ID', 'Loan Type', 'Baseline RWA', 'Candidate RWA', 'Changed', 'Reason'],
    ...mockStore.latestImpactReport.differences.map(d => [
      d.record_id,
      d.input_data.loan_type,
      '100%',
      d.changed ? '125%' : '100%',
      d.changed ? 'YES' : 'NO',
      `"${d.difference_reason}"`
    ])
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'compliance_impact_dossier.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
