<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Policy & Rule Mapping</h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Map regulatory obligations to internal policy documents and existing operational decision rules.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link to="/rules">
          <AppButton variant="secondary" size="sm">
            <AppIcon name="rules" :size="14" />
            Proceed to Rule Studio →
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Active Obligation Context Banner -->
    <AppCard noPadding>
      <div class="p-4 bg-purple-50/50 border-b border-purple-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-purple-600 text-white flex items-center justify-center font-bold text-xs font-mono">
            OBL
          </div>
          <div>
            <div class="text-xs font-semibold text-purple-900 flex items-center gap-2">
              <span>{{ activeObligation?.obligation_code || 'OBL-CR-001' }}</span>
              <AppBadge variant="purple">Page {{ activeObligation?.source_page }}</AppBadge>
            </div>
            <div class="text-xs font-medium text-text-primary mt-0.5">
              {{ activeObligation?.title }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <select
            v-model="selectedObligationId"
            @change="loadObligationData"
            class="text-xs bg-white border border-border rounded px-2.5 py-1.5 font-medium text-text-primary focus:ring-1 focus:ring-purple-600"
          >
            <option v-for="o in allObligations" :key="o.id" :value="o.id">
              {{ o.obligation_code }}: {{ o.title }}
            </option>
          </select>
        </div>
      </div>
    </AppCard>

    <!-- Mapping Interface: Candidate Policies Selection -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Candidate Policies List (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <AppCard title="Internal Policy Catalogue" subtitle="Synthetic corporate governance and credit risk policies">
          <div class="space-y-3">
            <div
              v-for="pol in policies"
              :key="pol.id"
              @click="selectPolicy(pol)"
              :class="[
                'p-4 rounded-lg border cursor-pointer transition-all',
                selectedPolicy?.id === pol.id
                  ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600 shadow-xs'
                  : 'border-border bg-white hover:border-purple-300'
              ]"
            >
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-mono font-bold text-purple-900">{{ pol.policy_code }}</span>
                <span class="text-[11px] text-text-secondary font-mono">v{{ pol.version }} · {{ pol.active_rules_count }} Active Rules</span>
              </div>
              <div class="text-xs font-semibold text-text-primary mb-1">
                {{ pol.title }}
              </div>
              <p class="text-[11px] text-text-secondary line-clamp-2 leading-relaxed mb-2">
                {{ pol.description }}
              </p>
              <div class="flex items-center justify-between text-[11px] pt-2 border-t border-border/80">
                <span class="text-purple-800 font-medium">Category: {{ pol.category }}</span>
                <span
                  class="font-semibold text-xs"
                  :class="pol.policy_code === 'POL-CR-01' ? 'text-emerald-700' : 'text-slate-500'"
                >
                  {{ pol.policy_code === 'POL-CR-01' ? '96% Match' : pol.policy_code === 'POL-UW-04' ? '92% Match' : 'Partial Match' }}
                </span>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Mapping Decision & Rationale Panel (5 cols) -->
      <div class="lg:col-span-5 space-y-4">
        <AppCard title="Mapping Confirmation" subtitle="Establish explicit policy linkage">
          <div class="space-y-4 text-xs">
            <div>
              <span class="text-[10px] uppercase font-bold text-text-secondary block mb-1">Target Policy</span>
              <div v-if="selectedPolicy" class="p-3 bg-surface-muted border border-border rounded">
                <div class="font-mono font-bold text-purple-800 text-xs">{{ selectedPolicy.policy_code }}</div>
                <div class="font-semibold text-text-primary mt-0.5">{{ selectedPolicy.title }}</div>
              </div>
              <div v-else class="p-3 bg-surface-muted border border-dashed border-border rounded text-text-secondary italic">
                No policy selected. Click a policy on the left or choose explicit unmapped status below.
              </div>
            </div>

            <div>
              <label class="block font-semibold text-text-primary mb-1">Mapping Relationship *</label>
              <select
                v-model="mappingForm.match_type"
                class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600 font-medium"
              >
                <option value="EXACT">Exact Alignment (Direct Regulatory Mandate)</option>
                <option value="PARTIAL">Partial Alignment (Requires Policy Amendment)</option>
                <option value="NEW_POLICY_NEEDED">New Policy Required (Gap Identified)</option>
                <option value="UNMAPPED">Explicitly Unmapped (Out of Scope)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-text-primary mb-1">Mapping Justification & Traceability Rationale *</label>
              <textarea
                v-model="mappingForm.rationale"
                rows="4"
                required
                placeholder="Explain the regulatory alignment between this obligation and internal policy schedule..."
                class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600"
              ></textarea>
            </div>

            <div v-if="saveSuccess" class="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-1.5 text-xs">
              <AppIcon name="check" :size="14" class="text-emerald-600" />
              <span>Policy mapping successfully certified and recorded.</span>
            </div>

            <div class="pt-2 flex flex-col gap-2">
              <AppButton
                type="button"
                variant="primary"
                size="md"
                customClass="w-full"
                :loading="saving"
                @click="confirmMapping"
              >
                Confirm Policy Mapping
              </AppButton>
              <AppButton
                type="button"
                variant="outline"
                size="sm"
                customClass="w-full text-slate-600"
                @click="markUnmapped"
              >
                Mark Explicitly as Unmapped
              </AppButton>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { Obligation, Policy } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const route = useRoute();
const authStore = useAuthStore();
const allObligations = ref<Obligation[]>([]);
const activeObligation = ref<Obligation | null>(null);
const selectedObligationId = ref('obl-01');
const policies = ref<Policy[]>([]);
const selectedPolicy = ref<Policy | null>(null);

const saving = ref(false);
const saveSuccess = ref(false);

const mappingForm = ref({
  match_type: 'EXACT',
  rationale: 'Directly maps to POL-CR-01 (Retail Credit Risk & Capital Adequacy Policy, Section 4.2: Risk Weight Schedules).',
});

onMounted(async () => {
  try {
    const [obData, polData] = await Promise.all([
      apiService.getObligations(),
      apiService.getPolicies(),
    ]);
    allObligations.value = obData;
    policies.value = polData;

    const queryOblId = route.query.obligationId as string;
    if (queryOblId) {
      selectedObligationId.value = queryOblId;
    }

    loadObligationData();
  } catch (err) {
    console.error('Failed loading policy mapping data', err);
  }
});

const loadObligationData = () => {
  const found = allObligations.value.find(o => o.id === selectedObligationId.value);
  if (found) {
    activeObligation.value = found;
    // Pre-select matching policy if POL-CR-01
    if (found.obligation_code.includes('001')) {
      selectedPolicy.value = policies.value.find(p => p.policy_code === 'POL-CR-01') || null;
      mappingForm.value.rationale = 'Directly maps to POL-CR-01 (Retail Credit Risk & Capital Adequacy Policy, Section 4.2).';
    } else if (found.obligation_code.includes('002')) {
      selectedPolicy.value = policies.value.find(p => p.policy_code === 'POL-UW-04') || null;
      mappingForm.value.rationale = 'Directly maps to POL-UW-04 (Debt Serviceability & DTI Underwriting Standards).';
    }
  }
};

const selectPolicy = (pol: Policy) => {
  selectedPolicy.value = pol;
};

const confirmMapping = async () => {
  try {
    saving.value = true;
    saveSuccess.value = false;
    await apiService.saveMapping(selectedObligationId.value, {
      obligation_id: selectedObligationId.value,
      policy_id: selectedPolicy.value?.id || null,
      mapping_status: 'MAPPED',
      match_type: mappingForm.value.match_type,
      rationale: mappingForm.value.rationale,
    }, authStore.currentUser.id);
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3500);
  } catch (err) {
    console.error('Failed confirming mapping', err);
  } finally {
    saving.value = false;
  }
};

const markUnmapped = async () => {
  try {
    saving.value = true;
    saveSuccess.value = false;
    selectedPolicy.value = null;
    await apiService.saveMapping(selectedObligationId.value, {
      obligation_id: selectedObligationId.value,
      policy_id: null,
      mapping_status: 'UNMAPPED',
      match_type: 'UNMAPPED',
      rationale: 'Obligation marked explicitly as unmapped to any internal operational policy.',
    }, authStore.currentUser.id);
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3500);
  } catch (err) {
    console.error('Failed marking unmapped', err);
  } finally {
    saving.value = false;
  }
};
</script>
