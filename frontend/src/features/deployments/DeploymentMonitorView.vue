<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="purple" dot>Isolated Sandbox</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary">Release Environment: <strong class="text-purple-900">demo-sandbox-v1</strong></span>
        </div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Sandbox Deployment Monitor & Rollback</h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Gated promotion of human-approved decision rule changes to isolated simulation environment with one-click audit-backed rollback.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <AppButton
          variant="primary"
          size="md"
          @click="showDeployModal = true"
        >
          <AppIcon name="deployments" :size="15" />
          Deploy Approved Version
        </AppButton>
        <AppButton
          variant="danger"
          size="md"
          @click="showRollbackModal = true"
          :disabled="deployments.length === 0"
        >
          <AppIcon name="rollback" :size="15" />
          Emergency Rollback
        </AppButton>
      </div>
    </div>

    <!-- Active Sandbox State Card -->
    <AppCard title="Current Live Sandbox Runtime State" subtitle="Active rule evaluator configuration in demo-sandbox-v1">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div class="p-4 bg-purple-50/60 border border-purple-200 rounded-lg">
          <span class="text-[10px] uppercase font-bold text-purple-900 block">Active Sandbox Version</span>
          <div class="text-lg font-mono font-bold text-purple-950 mt-1">
            {{ activeDeployment ? 'v1.1.0-draft' : 'v1.0.0 (Baseline)' }}
          </div>
          <span class="text-[11px] text-purple-800 font-medium">Deterministic Rule AST Active</span>
        </div>

        <div class="p-4 bg-surface-muted border border-border rounded-lg">
          <span class="text-[10px] uppercase font-bold text-text-secondary block">Governance Certification</span>
          <div class="text-sm font-semibold text-emerald-700 mt-1.5 flex items-center gap-1.5">
            <AppIcon name="check" :size="14" class="text-emerald-600" />
            Approved by Vikram Mehta
          </div>
          <span class="text-[11px] text-text-secondary">Dual-control certified</span>
        </div>

        <div class="p-4 bg-surface-muted border border-border rounded-lg">
          <span class="text-[10px] uppercase font-bold text-text-secondary block">Deployment Security Gating</span>
          <div class="text-sm font-semibold text-purple-900 mt-1.5">
            Backend Enforced
          </div>
          <span class="text-[11px] text-text-secondary">Unapproved release blocked</span>
        </div>

        <div class="p-4 bg-surface-muted border border-border rounded-lg">
          <span class="text-[10px] uppercase font-bold text-text-secondary block">Environment Isolation</span>
          <div class="text-sm font-semibold text-text-primary mt-1.5">
            Sandbox Isolated
          </div>
          <span class="text-[11px] text-amber-700 font-medium">Not production banking engine</span>
        </div>
      </div>
    </AppCard>

    <!-- Deployment & Rollback Timeline Table -->
    <AppCard title="Deployment Event History & Audit Log" subtitle="Tracked promotion and rollback lifecycle transitions" noPadding>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-surface-subtle text-text-secondary border-b border-border uppercase tracking-wider text-[10px]">
              <th class="px-5 py-3 font-semibold">Deployment ID / Env</th>
              <th class="px-4 py-3 font-semibold">Rule Version</th>
              <th class="px-4 py-3 font-semibold">Operator / Submitter</th>
              <th class="px-4 py-3 font-semibold">Timestamp</th>
              <th class="px-4 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 font-semibold">Release Notes / Rollback Rationale</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="loading" class="text-center">
              <td colspan="6" class="py-8 text-text-secondary">Loading deployments...</td>
            </tr>
            <tr v-else-if="deployments.length === 0" class="text-center">
              <td colspan="6" class="py-8 text-text-secondary">No sandbox deployment events recorded yet.</td>
            </tr>
            <tr
              v-for="dep in deployments"
              :key="dep.id"
              :class="['hover:bg-slate-50 transition-colors', dep.status === 'ROLLED_BACK' ? 'bg-rose-50/20' : '']"
            >
              <td class="px-5 py-3.5">
                <div class="font-mono font-bold text-text-primary">{{ dep.id.substring(0, 8) }}...</div>
                <div class="text-[11px] text-purple-700 font-medium">{{ dep.environment }}</div>
              </td>
              <td class="px-4 py-3.5 font-mono font-semibold text-text-primary">
                {{ dep.rule_version_id === 'ver-cand-01' ? 'v1.1.0-draft' : 'v1.0.0' }}
              </td>
              <td class="px-4 py-3.5 text-text-secondary font-medium">
                Arun Patel (Rule Engineer)
              </td>
              <td class="px-4 py-3.5 font-mono text-[11px] text-text-secondary">
                {{ new Date(dep.deployed_at).toLocaleString() }}
              </td>
              <td class="px-4 py-3.5">
                <AppBadge :variant="dep.status === 'DEPLOYED' ? 'success' : 'error'" dot>
                  {{ dep.status }}
                </AppBadge>
              </td>
              <td class="px-5 py-3.5 text-text-secondary text-[11px] max-w-sm">
                {{ dep.notes || 'Automated promotion to sandbox' }}
                <div v-if="dep.rollback_of_id" class="text-rose-700 font-mono mt-0.5">
                  Rollback of prior deployment {{ dep.rollback_of_id.substring(0, 8) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <!-- Deploy Confirmation Modal -->
    <div
      v-if="showDeployModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-border">
        <div class="px-6 py-4 border-b border-border bg-surface-muted flex items-center justify-between">
          <h3 class="text-sm font-bold text-text-primary">Deploy to Isolated Sandbox</h3>
          <button @click="showDeployModal = false" class="text-slate-400 hover:text-slate-600">
            <AppIcon name="close" :size="16" />
          </button>
        </div>
        <div class="p-6 space-y-4 text-xs">
          <p class="text-text-secondary leading-relaxed">
            You are promoting approved candidate version <strong class="text-purple-900 font-mono">v1.1.0-draft</strong> to sandbox environment <strong class="text-slate-700">demo-sandbox-v1</strong>.
          </p>

          <div class="p-3 bg-purple-50/60 border border-purple-200 rounded text-purple-950">
            <div class="font-semibold mb-0.5">Backend Release Gate:</div>
            <div>Verified approval record from Vikram Mehta (Compliance Approver) is attached.</div>
          </div>

          <div>
            <label class="block font-semibold text-text-primary mb-1">Release Notes</label>
            <input
              v-model="deployNotes"
              type="text"
              class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div v-if="deployError" class="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded">
            {{ deployError }}
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <AppButton variant="outline" size="sm" @click="showDeployModal = false">Cancel</AppButton>
            <AppButton variant="primary" size="sm" @click="confirmDeploy" :loading="deploying">
              Confirm Sandbox Release
            </AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Rollback Confirmation Modal -->
    <div
      v-if="showRollbackModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-border">
        <div class="px-6 py-4 border-b border-rose-200 bg-rose-50 flex items-center justify-between text-rose-900">
          <h3 class="text-sm font-bold flex items-center gap-1.5">
            <AppIcon name="rollback" :size="16" />
            Emergency Sandbox Rollback
          </h3>
          <button @click="showRollbackModal = false" class="text-slate-400 hover:text-slate-600">
            <AppIcon name="close" :size="16" />
          </button>
        </div>
        <div class="p-6 space-y-4 text-xs">
          <p class="text-text-secondary leading-relaxed">
            This will immediately revert the active sandbox rule engine to the previous known-good baseline version <strong class="text-slate-800 font-mono">v1.0.0</strong>.
          </p>

          <div>
            <label class="block font-semibold text-text-primary mb-1">Rollback Justification / Reason *</label>
            <textarea
              v-model="rollbackReason"
              rows="3"
              required
              class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-rose-600"
            ></textarea>
          </div>

          <div v-if="rollbackError" class="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded">
            {{ rollbackError }}
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <AppButton variant="outline" size="sm" @click="showRollbackModal = false">Cancel</AppButton>
            <AppButton variant="danger" size="sm" @click="confirmRollback" :loading="rollingBack">
              Execute Rollback
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { Deployment } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const authStore = useAuthStore();
const deployments = ref<Deployment[]>([]);
const loading = ref(true);

const showDeployModal = ref(false);
const showRollbackModal = ref(false);
const deploying = ref(false);
const rollingBack = ref(false);
const deployError = ref('');
const rollbackError = ref('');

const deployNotes = ref('Verified sandbox deployment following formal approval.');
const rollbackReason = ref('Portfolio boundary sensitivity anomaly detected in simulated underwriting stress test.');

const activeDeployment = computed(() => {
  return deployments.value.find(d => d.status === 'DEPLOYED');
});

const loadDeployments = async () => {
  try {
    loading.value = true;
    const list = await apiService.getDeployments();
    deployments.value = list;
  } catch (err) {
    console.error('Failed loading deployments', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadDeployments);

const confirmDeploy = async () => {
  try {
    deploying.value = true;
    deployError.value = '';

    // Find valid approval
    const approvals = await apiService.getApprovals();
    const approved = approvals.find(a => a.rule_version_id === 'ver-cand-01' && a.decision === 'APPROVED');
    if (!approved) {
      deployError.value = 'Release Blocked: Candidate version 1.1.0-draft has not been certified by an Approver yet. Please approve in Approval Center first.';
      return;
    }

    await apiService.deployToSandbox({
      rule_version_id: 'ver-cand-01',
      approval_id: approved.id,
      notes: deployNotes.value,
    }, authStore.currentUser.id);

    showDeployModal.value = false;
    await loadDeployments();
  } catch (err: any) {
    deployError.value = err?.response?.data?.detail || 'Failed deploying to sandbox';
  } finally {
    deploying.value = false;
  }
};

const confirmRollback = async () => {
  if (deployments.value.length === 0) return;
  try {
    rollingBack.value = true;
    rollbackError.value = '';

    const latest = deployments.value[0];
    await apiService.rollbackDeployment({
      deployment_id: latest.id,
      target_version_id: 'ver-base-01',
      reason: rollbackReason.value,
    }, authStore.currentUser.id);

    showRollbackModal.value = false;
    await loadDeployments();
  } catch (err: any) {
    rollbackError.value = err?.response?.data?.detail || 'Failed rolling back deployment';
  } finally {
    rollingBack.value = false;
  }
};
</script>
