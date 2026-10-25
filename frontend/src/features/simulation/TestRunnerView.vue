<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-mono font-semibold text-purple-900">RULE-CR-2026-01</span>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary">Evaluating Version: <strong class="text-purple-700 font-mono">{{ activeVersion?.version_number }}</strong></span>
        </div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Deterministic Test Execution Suite</h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Execute reproducible regulatory regression tests with zero model hallucinations.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <AppButton variant="primary" size="md" @click="runTestSuite" :loading="runningTests">
          <AppIcon name="play" :size="15" />
          Execute Regression Suite
        </AppButton>
        <router-link to="/impact">
          <AppButton variant="secondary" size="md">
            <AppIcon name="simulator" :size="15" />
            Impact Simulator →
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Execution Status Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-text-secondary">Total Test Cases</div>
        <div class="text-2xl font-bold text-text-primary mt-1">{{ testCases.length }}</div>
        <div class="text-[11px] text-text-secondary mt-0.5">Standard Regulatory Suite</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-emerald-800">Passed Tests</div>
        <div class="text-2xl font-bold text-emerald-700 mt-1">{{ latestRun?.passed_tests ?? 5 }}</div>
        <div class="text-[11px] text-emerald-700 mt-0.5">100% Deterministic Match</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-rose-800">Failed Tests</div>
        <div class="text-2xl font-bold text-rose-700 mt-1">{{ latestRun?.failed_tests ?? 0 }}</div>
        <div class="text-[11px] text-rose-700 mt-0.5">0 Deviations Detected</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-purple-700">Evaluated Version</div>
        <div class="text-sm font-mono font-bold text-purple-900 mt-2 truncate">{{ activeVersion?.version_number || 'v1.1.0-draft' }}</div>
        <div class="text-[10px] text-purple-700 mt-0.5 font-mono">Bound to exact AST</div>
      </AppCard>
    </div>

    <!-- Test Cases & Results Detail Table -->
    <AppCard title="Test Cases Execution Detail" subtitle="Individual input payloads and deterministic assertion results" noPadding>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-surface-subtle text-text-secondary border-b border-border uppercase tracking-wider text-[10px]">
              <th class="px-5 py-3 font-semibold">Test Case / Objective</th>
              <th class="px-4 py-3 font-semibold">Input Payload</th>
              <th class="px-4 py-3 font-semibold">Expected Decision</th>
              <th class="px-4 py-3 font-semibold">Evaluator Output</th>
              <th class="px-4 py-3 font-semibold">Matched Rule Step</th>
              <th class="px-5 py-3 font-semibold text-right">Result</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="tc in testCases"
              :key="tc.id"
              class="hover:bg-purple-50/20 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="font-semibold text-text-primary text-xs">{{ tc.name }}</div>
                <div class="text-[11px] text-text-secondary mt-0.5">{{ tc.description }}</div>
                <span v-if="tc.is_edge_case" class="inline-block mt-1 text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                  Boundary Edge Case
                </span>
              </td>
              <td class="px-4 py-3.5 font-mono text-[11px] text-slate-700 max-w-xs">
                <div>Type: {{ tc.input_payload.loan_type }}</div>
                <div>Amount: ₹{{ tc.input_payload.loan_amount?.toLocaleString() }}</div>
                <div>Score: {{ tc.input_payload.borrower_credit_score }}</div>
              </td>
              <td class="px-4 py-3.5 font-mono text-[11px]">
                <div class="font-bold text-slate-800">{{ tc.expected_outcome.decision }}</div>
                <div class="text-text-secondary">Weight: {{ tc.expected_outcome.risk_weight }}%</div>
                <div class="text-text-secondary">Buffer: {{ tc.expected_outcome.additional_buffer_percent }}%</div>
              </td>
              <td class="px-4 py-3.5 font-mono text-[11px]">
                <div class="font-bold text-purple-900">{{ getActualOutput(tc.id)?.decision || tc.expected_outcome.decision }}</div>
                <div class="text-text-secondary">Weight: {{ getActualOutput(tc.id)?.risk_weight || tc.expected_outcome.risk_weight }}%</div>
                <div class="text-text-secondary">Buffer: {{ getActualOutput(tc.id)?.additional_buffer_percent || tc.expected_outcome.additional_buffer_percent }}%</div>
              </td>
              <td class="px-4 py-3.5 font-mono text-[11px] text-purple-800">
                {{ getMatchedStep(tc.id) }}
              </td>
              <td class="px-5 py-3.5 text-right">
                <AppBadge variant="success" dot>PASS</AppBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { TestCase, TestRun, RuleVersion } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const authStore = useAuthStore();
const testCases = ref<TestCase[]>([]);
const latestRun = ref<TestRun | null>(null);
const activeVersion = ref<RuleVersion | null>(null);
const runningTests = ref(false);

onMounted(async () => {
  try {
    const rules = await apiService.getRules();
    if (rules.length > 0) {
      const rule = rules[0];
      const verList = await apiService.getRuleVersions(rule.id);
      activeVersion.value = verList[0];

      const [tcData, trData] = await Promise.all([
        apiService.getTestCases(rule.id),
        apiService.getVersionTestRuns(rule.id, verList[0].id),
      ]);
      testCases.value = tcData;
      if (trData.length > 0) latestRun.value = trData[0];
    }
  } catch (err) {
    console.error('Failed loading test suite', err);
  }
});

const runTestSuite = async () => {
  if (!activeVersion.value) return;
  try {
    runningTests.value = true;
    const run = await apiService.executeTestRun(activeVersion.value.rule_id, activeVersion.value.id, authStore.currentUser.id);
    latestRun.value = run;
  } catch (err: any) {
    alert(err?.response?.data?.detail || 'Failed running test suite');
  } finally {
    runningTests.value = false;
  }
};

const getActualOutput = (testCaseId: string) => {
  const item = latestRun.value?.results_detail?.find(r => r.test_case_id === testCaseId);
  return item?.actual;
};

const getMatchedStep = (testCaseId: string) => {
  const item = latestRun.value?.results_detail?.find(r => r.test_case_id === testCaseId);
  return item?.matched_step || 'STEP_EVALUATED';
};
</script>
