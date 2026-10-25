<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="purple" dot>Governance Gating</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary">Authorized Role: <strong class="text-purple-900">Compliance Approver</strong></span>
        </div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Governance & Compliance Approval Center</h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Dual-control certification of candidate rule changes based on reproducible test evidence and impact analysis.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link to="/deployments">
          <AppButton variant="secondary" size="md">
            <AppIcon name="deployments" :size="15" />
            Sandbox Deployment Monitor →
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Candidate Rule Version Review Dossier -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Evidence Summary Pane (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <AppCard title="Candidate Rule Version Dossier" subtitle="Evaluation evidence tied strictly to exact version AST">
          <div class="space-y-4 text-xs">
            <!-- Header Badges -->
            <div class="p-3.5 bg-surface-muted rounded-lg border border-border flex items-center justify-between">
              <div>
                <div class="font-mono font-bold text-purple-900 text-sm">RULE-CR-2026-01 · v1.1.0-draft</div>
                <div class="font-medium text-text-primary mt-0.5">Unsecured Retail Credit Risk Weight & Capital Buffer Rule</div>
              </div>
              <AppBadge variant="purple" dot>TESTED & VALIDATED</AppBadge>
            </div>

            <!-- Provenance & Source Evidence Chain -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-surface-muted rounded border border-border">
                <span class="text-[10px] font-bold text-text-secondary uppercase block">Regulatory Source</span>
                <span class="font-semibold text-text-primary mt-0.5 block">RBI Circular 2026/84</span>
                <span class="text-[11px] text-purple-700">Obligation: OBL-CR-001 (Page 1)</span>
              </div>
              <div class="p-3 bg-surface-muted rounded border border-border">
                <span class="text-[10px] font-bold text-text-secondary uppercase block">Internal Policy Alignment</span>
                <span class="font-semibold text-text-primary mt-0.5 block">POL-CR-01 (Credit Risk Policy)</span>
                <span class="text-[11px] text-emerald-700 font-semibold">Exact 96% Match Verified</span>
              </div>
            </div>

            <!-- Deterministic Test Suite Proof -->
            <div class="p-3.5 bg-[#E8F5EE] border border-[#B2DEC7] rounded-lg space-y-1.5">
              <div class="flex items-center justify-between font-semibold text-[#16845B] text-xs">
                <span class="flex items-center gap-1.5">
                  <AppIcon name="check" :size="14" class="text-[#16845B]" />
                  Deterministic Test Suite Evidence (Test Run tr-01)
                </span>
                <span class="font-mono text-[#16845B]">5 / 5 PASSED (100%)</span>
              </div>
              <p class="text-[11px] text-[#172B3A] leading-relaxed">
                Bound to exact version AST. Confirmed correct 125% risk weight on > ₹50,000 unsecured loans, correct 2.5% Tier-1 buffer, and statutory priority sector exemption.
              </p>
            </div>

            <!-- Impact Simulator Output -->
            <div class="p-3.5 bg-[#FDF6E9] border border-[#E8D2A6] rounded-lg space-y-1.5">
              <div class="flex items-center justify-between font-semibold text-[#B7791F] text-xs">
                <span class="flex items-center gap-1.5">
                  <AppIcon name="simulator" :size="14" class="text-[#B7791F]" />
                  Impact Simulation Summary (Dataset: SYNTHETIC_RETAIL_LOANS_2026_Q1)
                </span>
                <span class="font-mono text-[#B7791F]">47% Changed (47 / 100)</span>
              </div>
              <p class="text-[11px] text-[#172B3A] leading-relaxed">
                Simulated 100 synthetic profiles: 53 unchanged outcomes (secured/prime below ₹50k); 47 transitioned to 125% risk weight in strict compliance with regulatory directive.
              </p>
            </div>

            <div class="text-[11px] text-[#647789] pt-1 flex items-center justify-between">
              <span>Author: Arun Patel (Rule Engineer)</span>
              <span class="font-mono text-[#647789]">Rule ID: rule-cr-01</span>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Approver Decision Panel (5 cols) -->
      <div class="lg:col-span-5 space-y-4">
        <AppCard title="Formal Compliance Decision" subtitle="Separation of duties and approval certification">
          <!-- Role Warning if current user is not Approver -->
          <div
            v-if="!authStore.isApprover"
            class="p-3 bg-[#FEF3F2] border border-[#FECDCA] rounded text-xs text-[#B42318] flex items-start gap-2 mb-4"
          >
            <AppIcon name="alert" :size="15" class="text-[#B42318] mt-0.5 flex-shrink-0" />
            <div>
              <strong>Separation of Duties Alert: </strong>
              You are currently viewing as <strong>{{ authStore.currentUser.full_name }} ({{ authStore.roleLabel }})</strong>. Only authorized <strong>Compliance Approvers</strong> can certify and sign regulatory changes. Please switch role in top-right header to Vikram Mehta.
            </div>
          </div>

          <form @submit.prevent="submitDecision" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-[#172B3A] mb-1">Approval Decision *</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  @click="decision = 'APPROVED'"
                  :class="[
                    'py-2 px-3 rounded text-xs font-semibold border transition-all text-center',
                    decision === 'APPROVED'
                      ? 'bg-[#16845B] text-white border-[#16845B] ring-2 ring-emerald-200'
                      : 'bg-white border-[#D8E3EC] text-[#172B3A] hover:bg-[#F1F6FA]'
                  ]"
                >
                  Approve
                </button>
                <button
                  type="button"
                  @click="decision = 'REVISION_REQUESTED'"
                  :class="[
                    'py-2 px-3 rounded text-xs font-semibold border transition-all text-center',
                    decision === 'REVISION_REQUESTED'
                      ? 'bg-[#B7791F] text-white border-[#B7791F] ring-2 ring-amber-200'
                      : 'bg-white border-[#D8E3EC] text-[#172B3A] hover:bg-[#F1F6FA]'
                  ]"
                >
                  Request Rev.
                </button>
                <button
                  type="button"
                  @click="decision = 'REJECTED'"
                  :class="[
                    'py-2 px-3 rounded text-xs font-semibold border transition-all text-center',
                    decision === 'REJECTED'
                      ? 'bg-[#B42318] text-white border-[#B42318] ring-2 ring-rose-200'
                      : 'bg-white border-[#D8E3EC] text-[#172B3A] hover:bg-[#F1F6FA]'
                  ]"
                >
                  Reject
                </button>
              </div>
            </div>

            <div>
              <label class="block font-semibold text-[#172B3A] mb-1">
                Decision Justification & Compliance Rationale *
              </label>
              <textarea
                v-model="rationale"
                rows="4"
                required
                placeholder="Certify that the candidate rule version has been verified against regulatory source text, passing test runs, and impact consequences..."
                class="w-full px-3 py-2 border border-[#D8E3EC] rounded focus:ring-1 focus:ring-purple-600 text-[#172B3A]"
              ></textarea>
            </div>

            <div v-if="submissionError" class="p-2.5 bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] rounded text-xs">
              {{ submissionError }}
            </div>

            <div v-if="submissionSuccess" class="p-2.5 bg-[#E8F5EE] border border-[#B2DEC7] text-[#16845B] rounded flex items-center gap-1.5 text-xs">
              <AppIcon name="check" :size="14" class="text-[#16845B]" />
              <span>Decision formally recorded by backend! Rule version certified for Sandbox Deployment.</span>
            </div>

            <div class="pt-2">
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                customClass="w-full"
                :loading="submitting"
                :disabled="!authStore.isApprover"
              >
                Sign & Record Formal Decision
              </AppButton>
            </div>
          </form>
        </AppCard>

        <!-- Previous Approvals History -->
        <AppCard title="Historical Decisions" subtitle="Past governance records" compact>
          <div v-if="approvalsHistory.length === 0" class="text-xs text-text-secondary py-2 text-center">
            No previous approval records logged.
          </div>
          <div v-else class="space-y-2.5 max-h-48 overflow-y-auto">
            <div
              v-for="appr in approvalsHistory"
              :key="appr.id"
              class="p-2.5 rounded bg-surface-muted border border-border text-xs"
            >
              <div class="flex items-center justify-between mb-1">
                <AppBadge :variant="appr.decision === 'APPROVED' ? 'success' : 'error'">
                  {{ appr.decision }}
                </AppBadge>
                <span class="text-[10px] text-text-secondary font-mono">{{ new Date(appr.decided_at).toLocaleString() }}</span>
              </div>
              <p class="text-[11px] text-text-secondary line-clamp-2">
                {{ appr.rationale }}
              </p>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { Approval } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const authStore = useAuthStore();
const decision = ref<'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED'>('APPROVED');
const rationale = ref('Verified against RBI Circular 2026/84 requirements; regression tests passing on candidate AST.');
const submitting = ref(false);
const submissionError = ref('');
const submissionSuccess = ref(false);
const approvalsHistory = ref<Approval[]>([]);

onMounted(async () => {
  try {
    const list = await apiService.getApprovals();
    approvalsHistory.value = list;
  } catch (err) {
    console.error('Failed loading approvals', err);
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
    }, authStore.currentUser.id);

    submissionSuccess.value = true;
    approvalsHistory.value.unshift(res);
  } catch (err: any) {
    submissionError.value = err?.response?.data?.detail || 'Failed recording approval decision.';
  } finally {
    submitting.value = false;
  }
};
</script>
