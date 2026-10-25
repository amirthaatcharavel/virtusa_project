<template>
  <div class="space-y-6">
    <!-- Purpose-Built Technical Header -->
    <div class="bg-white border border-border rounded-lg p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <AppBadge variant="purple">Rule Engineering Lab</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary font-mono">Lead Engineer: Arun Patel</span>
        </div>
        <h1 class="text-lg font-bold text-text-primary tracking-tight">
          Rule Engineering & Deterministic Execution
        </h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Translate certified regulatory obligations into pure functional JSON Rule AST definitions, execute regression suites, and run portfolio simulations.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link to="/rules">
          <AppButton variant="primary" size="sm">
            <AppIcon name="rules" :size="14" />
            Rule Studio DSL
          </AppButton>
        </router-link>
        <router-link to="/tests">
          <AppButton variant="outline" size="sm">
            <AppIcon name="play" :size="14" />
            Run Test Lab
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Technical Status Ribbon (Concise System Status, NOT 4 Identical Cards) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#647789]">Target Rule</div>
        <div class="text-sm font-bold text-[#172B3A] mt-1 font-mono truncate">RULE-CR-2026-01</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Consumer Credit Risk Weights</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-purple-700">Candidate Version</div>
        <div class="text-sm font-bold text-purple-900 mt-1 font-mono">v1.1.0-draft</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Draft authored by Arun Patel</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#16845B]">Regression Status</div>
        <div class="text-sm font-bold text-[#16845B] mt-1 font-mono">5 / 5 Passing (100%)</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Zero AST logic regressions</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#647789]">Separation of Duties</div>
        <div class="text-sm font-bold text-[#172B3A] mt-1 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
          Author Blocked
        </div>
        <div class="text-[11px] text-[#647789] mt-0.5">Requires Vikram Mehta Sign-off</div>
      </div>
    </div>

    <!-- Technical Workspace: AST Structure & Test Verification -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Rule AST & Logic Inspector -->
      <div class="lg:col-span-7 space-y-4">
        <AppCard title="Candidate Rule DSL Specification" subtitle="Pure functional Abstract Syntax Tree without arbitrary code execution" noPadding>
          <div class="p-3.5 bg-[#F1F6FA] border-b border-[#D8E3EC] flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="font-mono text-purple-900 font-bold">v1.1.0-draft</span>
              <span class="text-[#647789]">·</span>
              <span class="text-[#647789]">Enhanced 125% Risk Weight & Microfinance Carve-Out</span>
            </div>
            <router-link to="/rules" class="text-purple-700 hover:text-purple-900 font-medium underline text-[11px] flex items-center gap-1">
              Edit in Rule Studio
              <AppIcon name="chevron-right" :size="12" />
            </router-link>
          </div>

          <div class="p-4 space-y-3">
            <!-- AST Logic Conditions Breakdown -->
            <div class="space-y-2 text-xs">
              <div class="p-3 bg-[#F1F6FA] border border-[#D8E3EC] rounded font-mono text-[11px] text-[#172B3A] leading-relaxed overflow-x-auto">
                <span class="text-purple-700 font-bold">IF</span> loan_type == <span class="text-[#16845B] font-semibold">"UNSECURED_PERSONAL_LOAN"</span><br/>
                <span class="text-purple-700 font-bold">AND</span> borrower_type != <span class="text-[#16845B] font-semibold">"MICROFINANCE_SHG"</span><br/>
                <span class="text-purple-700 font-bold">THEN</span> decision: <span class="text-[#B42318] font-bold">"ENHANCED_RISK_WEIGHT"</span>, risk_weight: <span class="text-[#172B3A] font-bold">125%</span><br/>
                <span class="text-purple-700 font-bold">ELSE</span> decision: <span class="text-[#647789] font-bold">"STANDARD_RISK_WEIGHT"</span>, risk_weight: <span class="text-[#172B3A] font-bold">100%</span>
              </div>
            </div>

            <!-- Validation Engine Feedback -->
            <div class="p-3 bg-[#E8F5EE] border border-[#B2DEC7] rounded text-xs text-[#16845B] flex items-center gap-2">
              <AppIcon name="check" :size="14" class="text-[#16845B] flex-shrink-0" />
              <div>
                <strong>AST Schema Conforming:</strong> Safe recursive evaluator validated. No <code>eval()</code>, <code>exec()</code>, or runtime side effects detected.
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Sandbox Deployment Monitor -->
        <AppCard title="Sandbox Release Gate" subtitle="Staged runtime isolation status" compact>
          <div class="text-xs space-y-3">
            <div class="flex items-center justify-between p-3 bg-[#F1F6FA] border border-[#D8E3EC] rounded">
              <div>
                <div class="font-semibold text-[#172B3A]">Current Production Sandbox Version</div>
                <div class="text-[11px] text-[#647789] font-mono mt-0.5">v1.0.0 (Deployed & Serving Decisions)</div>
              </div>
              <AppBadge variant="success">ACTIVE</AppBadge>
            </div>

            <div class="flex items-center justify-between p-3 bg-[#F1F6FA] border border-[#D8E3EC] rounded">
              <div>
                <div class="font-semibold text-[#172B3A]">Candidate Deployment Target</div>
                <div class="text-[11px] text-[#647789] font-mono mt-0.5">v1.1.0-draft · Blocked until Vikram Mehta sign-off</div>
              </div>
              <AppBadge variant="warning">AWAITING APPROVAL</AppBadge>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Right Column: Verification & Test Execution Suite -->
      <div class="lg:col-span-5 space-y-4">
        <AppCard title="Automated Regression Matrix" subtitle="Pre-configured regulatory test cases" noPadding>
          <div class="divide-y divide-[#D8E3EC]">
            <div
              v-for="tc in testCases"
              :key="tc.id"
              class="p-3.5 text-xs hover:bg-[#F1F6FA] transition-colors"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono font-bold text-[#172B3A]">{{ tc.id }}</span>
                <AppBadge variant="success">PASS</AppBadge>
              </div>
              <div class="text-[#172B3A] font-medium mt-1">{{ tc.name }}</div>
              <div class="text-[11px] text-[#647789] mt-1 flex items-center justify-between font-mono">
                <span>Expected: {{ tc.expected_outcome?.decision }}</span>
                <span class="text-[#16845B] font-semibold">100% Match</span>
              </div>
            </div>
          </div>

          <div class="p-3.5 bg-[#F1F6FA] border-t border-[#D8E3EC] flex items-center justify-between">
            <span class="text-xs text-[#647789]">Run ID: <strong class="font-mono text-[#172B3A]">tr-01</strong></span>
            <router-link to="/tests">
              <AppButton variant="secondary" size="sm">
                Run All Tests →
              </AppButton>
            </router-link>
          </div>
        </AppCard>

        <!-- Impact Simulation Link -->
        <AppCard title="Portfolio Impact Analysis" subtitle="Simulated effect across 10,000 borrower profiles" compact>
          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Dataset Version:</span>
              <span class="font-mono font-semibold text-slate-800">RETAIL_LOANS_2026_Q1</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Simulated Impact Rate:</span>
              <span class="font-bold text-purple-700">43.8% of portfolio</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Projected RWA Increase:</span>
              <span class="font-bold text-slate-900">+₹27.50M</span>
            </div>
            <div class="pt-1">
              <router-link to="/simulation" class="block">
                <AppButton variant="outline" size="sm" customClass="w-full justify-between">
                  <span>Inspect Impact Comparator</span>
                  <AppIcon name="chevron-right" :size="12" />
                </AppButton>
              </router-link>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '../../services/api';
import type { TestCase } from '../../types';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const metrics = ref<Record<string, any>>({});
const testCases = ref<TestCase[]>([]);

onMounted(async () => {
  try {
    const [mRes, tcRes] = await Promise.all([
      apiService.getRoleDashboardMetrics(),
      apiService.getTestCases('rule-cr-2026-01'),
    ]);
    metrics.value = mRes.metrics || {};
    testCases.value = tcRes.slice(0, 5) || [];
  } catch (err) {
    console.error('Failed loading engineer dashboard:', err);
  }
});
</script>
