<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-[#182533] tracking-tight">Policy & Rule Mapping</h1>
        <p class="text-xs text-[#526173] mt-0.5">
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
      <div class="p-4 bg-[#167D83]/10 border-b border-[#167D83]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-[3px] bg-[#14263D] text-white flex items-center justify-center font-bold text-xs font-mono">
            OBL
          </div>
          <div>
            <div class="text-xs font-semibold text-[#182533] flex items-center gap-2">
              <span class="font-mono text-[#167D83]">{{ activeObligation?.obligation_code || 'OBL-CR-001' }}</span>
              <AppBadge variant="teal">Page {{ activeObligation?.source_page }}</AppBadge>
            </div>
            <div class="text-xs font-medium text-[#182533] mt-0.5">
              {{ activeObligation?.title }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <select
            v-model="selectedObligationId"
            @change="loadObligationData"
            class="text-xs bg-white border border-[#E1E5E8] rounded-[3px] px-2.5 py-1.5 font-medium text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] font-mono"
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
                'p-4 rounded-[3px] border cursor-pointer transition-all',
                selectedPolicy?.id === pol.id
                  ? 'border-[#167D83] bg-[#167D83]/10 ring-1 ring-[#167D83] shadow-2xs'
                  : 'border-[#E1E5E8] bg-white hover:border-[#167D83]/40'
              ]"
            >
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-mono font-bold text-[#167D83]">{{ pol.policy_code }}</span>
                <span class="text-[11px] text-[#526173] font-mono">v{{ pol.version }} · {{ pol.active_rules_count }} Active Rules</span>
              </div>
              <div class="text-xs font-semibold text-[#182533] mb-1">
                {{ pol.title }}
              </div>
              <p class="text-[11px] text-[#526173] line-clamp-2 leading-relaxed mb-2">
                {{ pol.description }}
              </p>
              <div class="flex items-center justify-between text-[11px] pt-2 border-t border-[#E1E5E8]">
                <span class="text-[#167D83] font-medium font-mono">Category: {{ pol.category }}</span>
                <span
                  class="font-semibold text-xs font-mono"
                  :class="pol.policy_code === 'POL-CR-01' ? 'text-[#247653]' : 'text-[#526173]'"
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
              <span class="text-[10px] uppercase font-bold text-[#526173] block mb-1 font-mono">Target Policy</span>
              <div v-if="selectedPolicy" class="p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px]">
                <div class="font-mono font-bold text-[#167D83] text-xs">{{ selectedPolicy.policy_code }}</div>
                <div class="font-semibold text-[#182533] mt-0.5">{{ selectedPolicy.title }}</div>
              </div>
              <div v-else class="p-3 bg-[#F6F5F0] border border-dashed border-[#E1E5E8] rounded-[3px] text-[#526173] italic">
                No policy selected. Click a policy on the left or choose explicit unmapped status below.
              </div>
            </div>

            <div>
              <label class="block font-semibold text-[#182533] mb-1">Mapping Relationship *</label>
              <select
                v-model="mappingForm.match_type"
                class="w-full px-3 py-2 border border-[#E1E5E8] rounded-[3px] focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none font-medium font-mono"
              >
                <option value="EXACT">Exact Alignment (Direct Regulatory Mandate)</option>
                <option value="PARTIAL">Partial Alignment (Requires Policy Amendment)</option>
                <option value="NEW_POLICY_NEEDED">New Policy Required (Gap Identified)</option>
                <option value="UNMAPPED">Explicitly Unmapped (Out of Scope)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-[#182533] mb-1">Mapping Justification & Traceability Rationale *</label>
              <textarea
                v-model="mappingForm.rationale"
                rows="4"
                required
                placeholder="Explain the regulatory alignment between this obligation and internal policy schedule..."
                class="w-full px-3 py-2 border border-[#E1E5E8] rounded-[3px] focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none"
              ></textarea>
            </div>

            <div v-if="saveSuccess" class="p-2.5 bg-[#EDF6F1] border border-[#BCE0CE] text-[#247653] rounded-[3px] flex items-center gap-1.5 text-xs font-mono">
              <AppIcon name="check" :size="14" class="text-[#247653]" />
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
                customClass="w-full text-[#526173]"
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
