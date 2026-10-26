<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-[#E1E5E8] rounded-[3px] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="teal" dot>Regulatory Evidence Verification</AppBadge>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173]">Sign-off Reviewer: <strong class="text-[#182533]">Vikram Mehta</strong></span>
        </div>
        <h1 class="text-lg font-bold text-[#182533] tracking-tight">Regulatory Evidence & Provenance Inspector</h1>
        <p class="text-xs text-[#526173] mt-0.5">
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
        <div class="p-4 bg-[#F6F5F0] rounded-[3px] border border-[#E1E5E8] text-xs space-y-2">
          <div class="flex items-center justify-between font-bold text-[#182533]">
            <span>Reserve Bank of India — Circular Ref: RBI/2026-27/84</span>
            <span class="font-mono text-[11px] text-[#526173]">SHA-256: e3b0c44298fc1c14...</span>
          </div>
          <p class="text-[#182533] italic font-sans leading-relaxed pl-3 border-l-2 border-[#167D83] bg-white p-2.5 rounded-[3px]">
            "Risk weight on unsecured consumer credit by scheduled commercial banks is hereby enhanced from 100% to 125%... with immediate exemption for microfinance and SHG portfolios."
          </p>
          <div class="flex items-center justify-between text-[11px] text-[#526173] pt-1 font-mono">
            <span>Citation: Section 3(a), Paragraph 1, Page 4</span>
            <span class="text-[#167D83] font-semibold">Effective: 2026-11-01</span>
          </div>
        </div>
      </AppCard>

      <!-- 2. Obligation Review & Policy Linkage -->
      <AppCard title="2. Obligation Certification & Policy Linkage" subtitle="Compliance Analyst formal determination">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div class="p-3.5 bg-[#F6F5F0] rounded-[3px] border border-[#E1E5E8] space-y-1">
            <span class="font-bold text-[#167D83] block font-mono">OBL-CR-001</span>
            <span class="font-semibold text-[#182533] block">Enhanced 125% Risk Weight on Unsecured Credit</span>
            <span class="text-[11px] text-[#247653] font-semibold block font-mono">Certified APPLICABLE by Maya Sen</span>
            <p class="text-[11px] text-[#526173] mt-1">Confirmed material impact on Retail Personal Loan capital allocation.</p>
          </div>

          <div class="p-3.5 bg-[#F6F5F0] rounded-[3px] border border-[#E1E5E8] space-y-1">
            <span class="font-bold text-[#167D83] block font-mono">POL-CR-01 (v2.4)</span>
            <span class="font-semibold text-[#182533] block">Retail Credit Risk & Capital Adequacy Policy</span>
            <span class="text-[11px] text-[#247653] font-semibold block font-mono">Exact 96% Match Alignment</span>
            <p class="text-[11px] text-[#526173] mt-1">Governs risk-weight assignment and Tier-1 capital conservation buffers.</p>
          </div>
        </div>
      </AppCard>

      <!-- 3. Test Runner & Regression Assertions -->
      <AppCard title="3. Deterministic Regression Evidence" subtitle="Zero code eval AST engine test suite results">
        <div class="p-4 bg-[#F6F5F0] rounded-[3px] border border-[#E1E5E8] text-xs space-y-2">
          <div class="flex items-center justify-between font-mono font-bold text-[#182533]">
            <span>Test Run ID: tr-01 (Executed by Arun Patel)</span>
            <AppBadge variant="success">100% PASS (5 / 5)</AppBadge>
          </div>
          <p class="text-[#526173]">
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
