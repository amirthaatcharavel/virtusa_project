<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-mono font-semibold text-purple-900">RULE-CR-2026-01</span>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary">Comparing: <strong class="text-slate-700">Baseline v1.0.0</strong> vs <strong class="text-purple-700">Candidate v1.1.0-draft</strong></span>
        </div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Impact Simulator & Differential Analysis</h1>
        <p class="text-xs text-text-secondary mt-0.5">
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
    <div class="p-3 bg-[#FDF6E9] border border-[#E8D2A6] rounded-lg flex items-start gap-2.5 text-xs text-[#B7791F]">
      <AppIcon name="alert" :size="16" class="text-[#B7791F] mt-0.5 flex-shrink-0" />
      <div>
        <strong class="font-semibold text-[#172B3A]">Synthetic Evaluation Dataset Disclosure: </strong>
        <span>{{ report?.synthetic_disclosure || 'Simulated portfolio of 100 synthetic retail credit borrower profiles. Not actual production banking records.' }}</span>
        <div class="font-mono text-[11px] text-[#B7791F] mt-0.5">Dataset Version: {{ report?.dataset_version || 'SYNTHETIC_RETAIL_LOANS_2026_Q1' }}</div>
      </div>
    </div>

    <!-- Impact Metrics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#647789]">Total Portfolio Evaluated</div>
        <div class="text-2xl font-bold text-[#172B3A] mt-1">{{ report?.total_evaluated || 100 }}</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Identical Borrower Records</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#16845B]">Unchanged Outcomes</div>
        <div class="text-2xl font-bold text-[#16845B] mt-1">{{ report?.unchanged_count || 53 }}</div>
        <div class="text-[11px] text-[#16845B] mt-0.5">Secured & Low-ticket Prime</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#B7791F]">Changed Outcomes</div>
        <div class="text-2xl font-bold text-[#B7791F] mt-1">{{ report?.changed_count || 47 }}</div>
        <div class="text-[11px] text-[#B7791F] mt-0.5">Surcharge / Buffer Elevated</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-purple-700">Portfolio Impact Rate</div>
        <div class="text-2xl font-bold text-purple-900 mt-1">
          {{ report ? ((report.changed_count / report.total_evaluated) * 100).toFixed(1) : '47.0' }}%
        </div>
        <div class="text-[11px] text-purple-700 mt-0.5">Transitioned to 125% Risk Weight</div>
      </AppCard>
    </div>

    <!-- Differential Cases Table -->
    <AppCard
      title="Differential Outcome Breakdown (Baseline vs Candidate)"
      :subtitle="`${report?.differences?.length || 0} borrower records affected by revised regulatory thresholds`"
      noPadding
    >
      <div class="p-3 bg-[#F1F6FA] border-b border-[#D8E3EC] flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-[#172B3A]">Filter Affected Cases:</span>
          <button
            @click="filterMode = 'ALL'"
            :class="['px-2.5 py-1 rounded text-xs font-medium', filterMode === 'ALL' ? 'bg-purple-600 text-white' : 'bg-white border border-[#D8E3EC] text-[#647789]']"
          >
            All Changed ({{ report?.differences?.length || 0 }})
          </button>
          <button
            @click="filterMode = 'HIGH_TICKET'"
            :class="['px-2.5 py-1 rounded text-xs font-medium', filterMode === 'HIGH_TICKET' ? 'bg-purple-600 text-white' : 'bg-white border border-[#D8E3EC] text-[#647789]']"
          >
            Loan > ₹50,000 Surcharge
          </button>
          <button
            @click="filterMode = 'SUBPRIME'"
            :class="['px-2.5 py-1 rounded text-xs font-medium', filterMode === 'SUBPRIME' ? 'bg-purple-600 text-white' : 'bg-white border border-[#D8E3EC] text-[#647789]']"
          >
            Credit Score &lt; 700 Surcharge
          </button>
        </div>
      </div>

      <div class="overflow-x-auto max-h-[500px]">
        <table class="w-full text-left text-xs border-collapse">
          <thead class="sticky top-0 bg-[#F1F6FA] text-[#647789] border-b border-[#D8E3EC] uppercase tracking-wider text-[10px] z-10">
            <tr>
              <th class="px-5 py-3 font-semibold">Record ID / Segment</th>
              <th class="px-4 py-3 font-semibold">Borrower Attributes</th>
              <th class="px-4 py-3 font-semibold">Baseline Outcome (v1.0)</th>
              <th class="px-4 py-3 font-semibold">Candidate Outcome (v1.1)</th>
              <th class="px-4 py-3 font-semibold">Differential Change</th>
              <th class="px-5 py-3 font-semibold">Regulatory Root Cause</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#D8E3EC]">
            <tr
              v-for="c in filteredDifferences"
              :key="c.record_id"
              class="hover:bg-[#F1F6FA] transition-colors"
            >
              <td class="px-5 py-3">
                <div class="font-mono font-bold text-[#172B3A]">{{ c.record_id }}</div>
                <div class="text-[11px] text-[#647789] mt-0.5">{{ c.input_data?.segment || 'Retail Credit Exposure' }}</div>
              </td>
              <td class="px-4 py-3 font-mono text-[11px] text-[#172B3A]">
                <div>Type: {{ c.input_data?.loan_type }}</div>
                <div>Amount: ₹{{ c.input_data?.loan_amount?.toLocaleString() }}</div>
                <div>Score: {{ c.input_data?.borrower_credit_score }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="font-mono text-[11px]">
                  <span class="font-semibold text-[#172B3A]">100% Risk Weight</span>
                  <div class="text-[10px] text-[#647789]">Buffer: 0.0%</div>
                  <div class="text-[10px] text-[#647789] font-mono">{{ c.baseline_step }}</div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="font-mono text-[11px]">
                  <span class="font-bold text-[#B7791F]">125% Risk Weight</span>
                  <div class="text-[10px] text-[#B7791F] font-semibold">+2.5% Tier-1 Buffer</div>
                  <div class="text-[10px] text-purple-800 font-mono">{{ c.candidate_step }}</div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono">
                  +25% RW / +2.5% Buffer
                </span>
              </td>
              <td class="px-5 py-3 text-[11px] text-text-secondary">
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
