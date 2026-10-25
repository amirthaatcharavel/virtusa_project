<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-border rounded-lg p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="purple" dot>Regulatory Evidence Verification</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary">Sign-off Reviewer: <strong class="text-purple-900">Vikram Mehta</strong></span>
        </div>
        <h1 class="text-lg font-bold text-text-primary tracking-tight">Regulatory Evidence & Provenance Inspector</h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Dual-control audit verification linking source circular citations to deterministic test assertions and simulated impact.
        </p>
      </div>

      <router-link to="/approvals">
        <AppButton variant="primary" size="sm">
          <AppIcon name="approvals" :size="14" />
          Go to Sign-Off Center →
        </AppButton>
      </router-link>
    </div>

    <!-- Traceability Chain Evidence Cards -->
    <div class="space-y-4">
      <!-- 1. Source Document Evidence -->
      <AppCard title="1. Authentic Regulatory Publication" subtitle="Preserved PDF text & cryptographic integrity">
        <div class="p-4 bg-slate-50 rounded-lg border border-border text-xs space-y-2">
          <div class="flex items-center justify-between font-bold text-slate-900">
            <span>Reserve Bank of India — Circular Ref: RBI/2026-27/84</span>
            <span class="font-mono text-[11px] text-slate-500">SHA-256: e3b0c44298fc1c14...</span>
          </div>
          <p class="text-slate-800 italic font-serif leading-relaxed pl-3 border-l-2 border-purple-600 bg-white p-2.5 rounded">
            "Risk weight on unsecured consumer credit by scheduled commercial banks is hereby enhanced from 100% to 125%... with immediate exemption for microfinance and SHG portfolios."
          </p>
          <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Citation: Section 3(a), Paragraph 1, Page 4</span>
            <span class="text-purple-700 font-semibold">Effective: 2026-11-01</span>
          </div>
        </div>
      </AppCard>

      <!-- 2. Obligation Review & Policy Linkage -->
      <AppCard title="2. Obligation Certification & Policy Linkage" subtitle="Compliance Analyst formal determination">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="p-3.5 bg-slate-50 rounded-lg border border-border space-y-1">
            <span class="font-bold text-purple-900 block font-mono">OBL-CR-001</span>
            <span class="font-semibold text-text-primary block">Enhanced 125% Risk Weight on Unsecured Credit</span>
            <span class="text-[11px] text-emerald-700 font-semibold block">Certified APPLICABLE by Maya Sen</span>
            <p class="text-[11px] text-text-secondary mt-1">Confirmed material impact on Retail Personal Loan capital allocation.</p>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-lg border border-border space-y-1">
            <span class="font-bold text-purple-900 block font-mono">POL-CR-01 (v2.4)</span>
            <span class="font-semibold text-text-primary block">Retail Credit Risk & Capital Adequacy Policy</span>
            <span class="text-[11px] text-emerald-700 font-semibold block">Exact 96% Match Alignment</span>
            <p class="text-[11px] text-text-secondary mt-1">Governs risk-weight assignment and Tier-1 capital conservation buffers.</p>
          </div>
        </div>
      </AppCard>

      <!-- 3. Test Runner & Regression Assertions -->
      <AppCard title="3. Deterministic Regression Evidence" subtitle="Zero code eval AST engine test suite results">
        <div class="p-4 bg-slate-50 rounded-lg border border-border text-xs space-y-2">
          <div class="flex items-center justify-between font-mono font-bold text-slate-900">
            <span>Test Run ID: tr-01 (Executed by Arun Patel)</span>
            <AppBadge variant="success">100% PASS (5 / 5)</AppBadge>
          </div>
          <p class="text-slate-600">
            Evaluated against 5 automated test cases covering high-ticket loans, borderline scores, and microfinance exemption boundaries. Zero false-positives or AST logic flaws detected.
          </p>
        </div>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppIcon from '../../components/icons/AppIcon.vue';
</script>
