<template>
  <div class="space-y-6">
    <!-- Purpose-Built Governance Header -->
    <div class="bg-white border border-border rounded-lg p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <AppBadge variant="purple">Dual-Control Governance</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary font-mono">Sign-off Authority: Vikram Mehta</span>
        </div>
        <h1 class="text-lg font-bold text-text-primary tracking-tight">
          Compliance Sign-off & Audit Decision Center
        </h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Independent evaluation of candidate rule versions against authentic regulatory citations, deterministic test evidence, and simulated borrower impact.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link to="/approvals">
          <AppButton variant="primary" size="sm">
            <AppIcon name="approvals" :size="14" />
            Sign-off Center
          </AppButton>
        </router-link>
        <router-link to="/approver/evidence">
          <AppButton variant="outline" size="sm">
            <AppIcon name="file-text" :size="14" />
            Evidence Dossier
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Governance Status Ribbon (Clear Governance Indicators, NOT 4 Cliché Cards) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#B7791F]">Pending Review</div>
        <div class="text-sm font-bold text-[#B7791F] mt-1 font-mono">1 Candidate Version</div>
        <div class="text-[11px] text-[#647789] mt-0.5">RULE-CR-2026-01 (v1.1.0)</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#16845B]">Test Verification</div>
        <div class="text-sm font-bold text-[#16845B] mt-1 font-mono">5 / 5 Assertions Passed</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Test Run ID: tr-01</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-purple-700">Portfolio Impact</div>
        <div class="text-sm font-bold text-purple-900 mt-1 font-mono">43.8% Loans Affected</div>
        <div class="text-[11px] text-[#647789] mt-0.5">+₹27.50M RWA Increase</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#647789]">Dual-Control Audit</div>
        <div class="text-sm font-bold text-[#172B3A] mt-1 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
          Segregation Verified
        </div>
        <div class="text-[11px] text-[#647789] mt-0.5">Author (Arun) != Approver (Vikram)</div>
      </div>
    </div>

    <!-- Approval Workspace: Evidence Evaluation & Decision Controls -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Candidate Evidence Dossier & Impact Summary -->
      <div class="lg:col-span-7 space-y-4">
        <AppCard title="Candidate Rule Version Dossier" subtitle="Regulatory submission details under formal review" noPadding>
          <div class="p-3.5 bg-[#F1F6FA] border-b border-[#D8E3EC] flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="font-mono text-purple-900 font-bold">RULE-CR-2026-01 (v1.1.0-draft)</span>
              <span class="text-[#647789]">·</span>
              <span class="text-[#647789]">Authored by Arun Patel</span>
            </div>
            <AppBadge variant="warning">PENDING APPROVAL</AppBadge>
          </div>

          <div class="p-4 space-y-3.5 text-xs">
            <!-- Regulatory Origin -->
            <div class="p-3 bg-[#F1F6FA] border border-[#D8E3EC] rounded">
              <div class="text-[10px] uppercase font-semibold text-[#647789]">Source Publication</div>
              <div class="font-medium text-[#172B3A] mt-0.5">RBI Circular 2026/84 · Section 3(a), Page 4</div>
              <div class="text-[11px] text-[#647789] mt-1 italic font-serif">
                "Risk weight on unsecured consumer credit enhanced from 100% to 125%... exempting microfinance/SHG portfolios."
              </div>
            </div>

            <!-- Deterministic Verification Evidence -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-white border border-[#D8E3EC] rounded">
                <div class="text-[10px] text-[#647789] uppercase font-semibold">Test Evidence Run</div>
                <div class="font-mono font-bold text-[#16845B] mt-0.5">Run tr-01 · 100% PASS</div>
                <div class="text-[10px] text-[#647789] mt-0.5">5 boundary cases tested</div>
              </div>
              <div class="p-3 bg-white border border-[#D8E3EC] rounded">
                <div class="text-[10px] text-[#647789] uppercase font-semibold">Impact Simulation</div>
                <div class="font-mono font-bold text-purple-900 mt-0.5">4,380 of 10,000 Loans</div>
                <div class="text-[10px] text-[#647789] mt-0.5">₹27.50M RWA delta</div>
              </div>
            </div>

            <div class="p-3 bg-purple-50/50 border border-purple-200/80 rounded flex items-center justify-between text-[11px]">
              <span class="text-[#172B3A]">Complete verification evidence pack is ready for sign-off.</span>
              <router-link to="/approver/evidence" class="text-purple-700 hover:text-purple-900 font-semibold underline">
                Inspect Full Dossier →
              </router-link>
            </div>
          </div>
        </AppCard>

        <!-- Historical Approval Ledger -->
        <AppCard title="Recent Dual-Control Ledger" subtitle="Immutably recorded governance actions" noPadding>
          <div class="divide-y divide-border text-xs">
            <div
              v-for="a in approvalHistory"
              :key="a.id"
              class="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div>
                <div class="font-mono font-bold text-slate-900">{{ a.rule_version_id }}</div>
                <div class="text-slate-500 text-[11px] mt-0.5 truncate max-w-sm">{{ a.rationale }}</div>
              </div>
              <div class="text-right">
                <AppBadge :variant="a.decision === 'APPROVED' ? 'success' : 'error'">{{ a.decision }}</AppBadge>
                <div class="text-[10px] font-mono text-slate-400 mt-0.5">{{ new Date(a.decided_at).toLocaleDateString() }}</div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Right Column: Formal Decision Controls -->
      <div class="lg:col-span-5 space-y-4">
        <AppCard title="Formal Sign-off Controls" subtitle="Mandatory dual-control compliance sign-off" noPadding>
          <div class="p-4 space-y-4 text-xs">
            <div>
              <label class="block text-[11px] font-semibold text-[#172B3A] uppercase mb-1.5">
                Compliance Decision
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="decision = 'APPROVED'"
                  class="py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  :class="decision === 'APPROVED' ? 'bg-[#16845B] text-white border-[#16845B]' : 'bg-white border-[#D8E3EC] text-[#172B3A] hover:bg-[#F1F6FA]'"
                >
                  <AppIcon name="check" :size="13" />
                  APPROVE
                </button>
                <button
                  type="button"
                  @click="decision = 'REJECTED'"
                  class="py-2 px-3 rounded border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  :class="decision === 'REJECTED' ? 'bg-[#B42318] text-white border-[#B42318]' : 'bg-white border-[#D8E3EC] text-[#172B3A] hover:bg-[#F1F6FA]'"
                >
                  <AppIcon name="alert" :size="13" />
                  REJECT
                </button>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#172B3A] uppercase mb-1.5">
                Audit Rationale & Compliance Justification
              </label>
              <textarea
                v-model="rationale"
                rows="4"
                class="w-full text-xs p-2.5 border border-[#D8E3EC] rounded bg-white focus:ring-1 focus:ring-purple-600 focus:outline-none text-[#172B3A]"
                placeholder="Enter regulatory justification, verification notes, and sign-off basis..."
              />
            </div>

            <div class="p-3 bg-[#F1F6FA] border border-[#D8E3EC] rounded text-[11px] text-[#647789] leading-relaxed">
              <strong class="text-[#172B3A]">Governance Notice:</strong> This action will be immutably recorded in the system audit trail with your digital credentials (<code>usr-approver-01</code>) and timestamp.
            </div>

            <div v-if="submissionSuccess" class="p-3 bg-[#E8F5EE] border border-[#B2DEC7] rounded text-xs text-[#16845B]">
              ✓ Decision recorded successfully in governance ledger.
            </div>

            <div v-if="submissionError" class="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded text-xs text-[#B42318]">
              {{ submissionError }}
            </div>

            <AppButton
              variant="primary"
              size="sm"
              customClass="w-full"
              :disabled="submitting || !rationale.trim()"
              @click="submitDecision"
            >
              {{ submitting ? 'Recording Decision...' : 'Submit Formal Sign-off' }}
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '../../services/api';
import type { Approval } from '../../types';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const metrics = ref<Record<string, any>>({});
const approvalHistory = ref<Approval[]>([]);
const decision = ref<'APPROVED' | 'REJECTED'>('APPROVED');
const rationale = ref('Verified against RBI Circular 2026/84 citations and 100% test pass on run tr-01. Microfinance exemption verified.');
const submitting = ref(false);
const submissionSuccess = ref(false);
const submissionError = ref('');

onMounted(async () => {
  try {
    const [mRes, aRes] = await Promise.all([
      apiService.getRoleDashboardMetrics(),
      apiService.getApprovals(),
    ]);
    metrics.value = mRes.metrics || {};
    approvalHistory.value = aRes.slice(0, 5) || [];
  } catch (err) {
    console.error('Failed loading approver dashboard:', err);
  }
});

const submitDecision = async () => {
  try {
    submitting.value = true;
    submissionError.value = '';
    submissionSuccess.value = false;
    const res = await apiService.recordApproval({
      rule_version_id: 'ver-cand-01',
      test_run_id: 'tr-01',
      impact_report_id: 'ir-01',
      decision: decision.value,
      rationale: rationale.value,
    });
    submissionSuccess.value = true;
    approvalHistory.value.unshift(res);
  } catch (err: any) {
    submissionError.value = err?.response?.data?.detail || 'Failed recording decision.';
  } finally {
    submitting.value = false;
  }
};
</script>
