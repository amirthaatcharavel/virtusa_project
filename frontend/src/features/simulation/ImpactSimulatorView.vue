<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-mono font-semibold text-[#167D83]">RULE-CR-2026-01</span>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173]">Comparing: <strong class="text-[#182533] font-mono">Baseline v1.0.0</strong> vs <strong class="text-[#167D83] font-mono">Candidate v1.1.0-draft</strong></span>
        </div>
        <h1 class="text-xl font-bold text-[#182533] tracking-tight">Impact Simulator & Differential Analysis</h1>
        <p class="text-xs text-[#526173] mt-0.5">
          Evaluate exact portfolio consequences of proposed regulatory rule changes across identical borrower distributions.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <AppButton variant="primary" size="md" @click="runSimulation" :loading="simulating">
          <AppIcon name="simulator" :size="15" />
          Re-run Impact Simulation
        </AppButton>
        <router-link to="/approvals">
          <AppButton variant="secondary" size="md">
            Proceed to Approval Center →
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Synthetic Dataset Disclosure & Environment Notice -->
    <div class="p-3 bg-[#FDF7EB] border border-[#EED7A8] rounded-[3px] flex items-start gap-2.5 text-xs text-[#AD741B]">
      <AppIcon name="alert" :size="16" class="text-[#AD741B] mt-0.5 flex-shrink-0" />
      <div>
        <strong class="font-semibold text-[#182533]">Synthetic Evaluation Dataset Disclosure: </strong>
        <span>{{ report?.synthetic_disclosure || 'Simulated portfolio of 100 synthetic retail credit borrower profiles. Not actual production banking records.' }}</span>
        <div class="font-mono text-[11px] text-[#AD741B] mt-0.5">Dataset Version: {{ report?.dataset_version || 'SYNTHETIC_RETAIL_LOANS_2026_Q1' }}</div>
      </div>
    </div>

    <!-- Impact Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#526173] font-mono">Total Portfolio Evaluated</div>
        <div class="text-2xl font-bold text-[#182533] mt-1 font-mono">{{ report?.total_evaluated || 100 }}</div>
        <div class="text-[11px] text-[#526173] mt-0.5">Identical Borrower Records</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#247653] font-mono">Unchanged Outcomes</div>
        <div class="text-2xl font-bold text-[#247653] mt-1 font-mono">{{ report?.unchanged_count || 53 }}</div>
        <div class="text-[11px] text-[#247653] mt-0.5">Secured & Low-ticket Prime</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#AD741B] font-mono">Changed Outcomes</div>
        <div class="text-2xl font-bold text-[#AD741B] mt-1 font-mono">{{ report?.changed_count || 47 }}</div>
        <div class="text-[11px] text-[#AD741B] mt-0.5">Surcharge / Buffer Elevated</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#167D83] font-mono">Portfolio Impact Rate</div>
        <div class="text-2xl font-bold text-[#14263D] mt-1 font-mono">
          {{ report ? ((report.changed_count / report.total_evaluated) * 100).toFixed(1) : '47.0' }}%
        </div>
        <div class="text-[11px] text-[#167D83] mt-0.5 font-mono">Transitioned to 125% Risk Weight</div>
      </AppCard>
    </div>

    <!-- Differential Cases Table -->
    <AppCard
      title="Differential Outcome Breakdown (Baseline vs Candidate)"
      :subtitle="`${report?.differences?.length || 0} borrower records affected by revised regulatory thresholds`"
      noPadding
    >
      <div class="p-3 bg-[#F6F5F0] border-b border-[#E1E5E8] flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-[#182533]">Filter Affected Cases:</span>
          <button
            @click="filterMode = 'ALL'"
            :class="['px-2.5 py-1 rounded-[3px] text-xs font-medium font-mono transition-colors', filterMode === 'ALL' ? 'bg-[#14263D] text-white' : 'bg-white border border-[#E1E5E8] text-[#526173] hover:bg-[#F6F5F0]']"
          >
            All Changed ({{ report?.differences?.length || 0 }})
          </button>
          <button
            @click="filterMode = 'HIGH_TICKET'"
            :class="['px-2.5 py-1 rounded-[3px] text-xs font-medium font-mono transition-colors', filterMode === 'HIGH_TICKET' ? 'bg-[#14263D] text-white' : 'bg-white border border-[#E1E5E8] text-[#526173] hover:bg-[#F6F5F0]']"
          >
            Loan > ₹50,000 Surcharge
          </button>
          <button
            @click="filterMode = 'SUBPRIME'"
            :class="['px-2.5 py-1 rounded-[3px] text-xs font-medium font-mono transition-colors', filterMode === 'SUBPRIME' ? 'bg-[#14263D] text-white' : 'bg-white border border-[#E1E5E8] text-[#526173] hover:bg-[#F6F5F0]']"
          >
            Credit Score &lt; 700 Surcharge
          </button>
        </div>
      </div>

      <div class="overflow-x-auto max-h-[500px]">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="sticky top-0 bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-[10px] font-mono z-10">
            <tr>
              <th class="px-5 py-3 font-semibold">Record ID / Segment</th>
              <th class="px-4 py-3 font-semibold">Borrower Attributes</th>
              <th class="px-4 py-3 font-semibold">Baseline Outcome (v1.0)</th>
              <th class="px-4 py-3 font-semibold">Candidate Outcome (v1.1)</th>
              <th class="px-4 py-3 font-semibold">Differential Change</th>
              <th class="px-5 py-3 font-semibold">Regulatory Root Cause</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E1E5E8]">
            <tr
              v-for="c in filteredDifferences"
              :key="c.record_id"
              class="hover:bg-[#F6F5F0]/60 transition-colors"
            >
              <td class="px-5 py-3">
                <div class="font-mono font-bold text-[#182533]">{{ c.record_id }}</div>
                <div class="text-[11px] text-[#526173] mt-0.5">{{ c.input_data?.segment || 'Retail Credit Exposure' }}</div>
              </td>
              <td class="px-4 py-3 font-mono text-[11px] text-[#182533]">
                <div>Type: {{ c.input_data?.loan_type }}</div>
                <div>Amount: ₹{{ c.input_data?.loan_amount?.toLocaleString() }}</div>
                <div>Score: {{ c.input_data?.borrower_credit_score }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="font-mono text-[11px]">
                  <span class="font-semibold text-[#182533]">100% Risk Weight</span>
                  <div class="text-[10px] text-[#526173]">Buffer: 0.0%</div>
                  <div class="text-[10px] text-[#526173] font-mono">{{ c.baseline_step }}</div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="font-mono text-[11px]">
                  <span class="font-bold text-[#AD741B]">125% Risk Weight</span>
                  <div class="text-[10px] text-[#AD741B] font-semibold">+2.5% Tier-1 Buffer</div>
                  <div class="text-[10px] text-[#167D83] font-mono">{{ c.candidate_step }}</div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#AD741B] bg-[#FDF7EB] border border-[#EED7A8] px-2 py-0.5 rounded-[3px] font-mono">
                  +25% RW / +2.5% Buffer
                </span>
              </td>
              <td class="px-5 py-3 text-[11px] text-[#526173]">
                {{ c.difference_reason }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { ImpactReport } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const authStore = useAuthStore();
const report = ref<ImpactReport | null>(null);
const simulating = ref(false);
const filterMode = ref<'ALL' | 'HIGH_TICKET' | 'SUBPRIME'>('ALL');

onMounted(async () => {
  try {
    const data = await apiService.getImpactReport('ir-01');
    report.value = data;
  } catch (err) {
    console.error('Failed loading impact report', err);
  }
});

const runSimulation = async () => {
  try {
    simulating.value = true;
    const newReport = await apiService.simulateImpact(
      'ver-base-01',
      'ver-cand-01',
      'SYNTHETIC_RETAIL_LOANS_2026_Q1',
      authStore.currentUser.id
    );
    report.value = newReport;
  } catch (err: any) {
    alert(err?.response?.data?.detail || 'Failed running impact simulation');
  } finally {
    simulating.value = false;
  }
};

const filteredDifferences = computed(() => {
  if (!report.value?.differences) return [];
  if (filterMode.value === 'HIGH_TICKET') {
    return report.value.differences.filter(d => (d.input_data?.loan_amount || 0) > 50000);
  }
  if (filterMode.value === 'SUBPRIME') {
    return report.value.differences.filter(d => (d.input_data?.borrower_credit_score || 800) < 700);
  }
  return report.value.differences;
});
</script>
