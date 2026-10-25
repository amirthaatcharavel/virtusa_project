<template>
  <div class="space-y-6">
    <!-- Header: Purpose-Built Enterprise Workflow Header -->
    <div class="bg-white border border-border rounded-lg p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <AppBadge variant="purple">Analyst Workspace</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary font-mono">Assigned Operator: Maya Sen</span>
        </div>
        <h1 class="text-lg font-bold text-text-primary tracking-tight">
          Regulatory Ingestion & Obligation Traceability
        </h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Ingest authentic circulars, verify extracted obligations against cited source text, and certify applicability before policy mapping.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link to="/circulars/upload">
          <AppButton variant="primary" size="sm">
            <AppIcon name="plus" :size="14" />
            Ingest Circular
          </AppButton>
        </router-link>
        <router-link to="/obligations">
          <AppButton variant="outline" size="sm">
            <AppIcon name="obligation" :size="14" />
            Obligations Queue
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Informational Context Strip: Functional Workflow Status Ribbon -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#647789]">Active Circulars</div>
        <div class="text-xl font-bold text-[#172B3A] mt-1 font-mono">{{ metrics.circulars_awaiting_review || 1 }}</div>
        <div class="text-[11px] text-[#647789] mt-0.5">RBI Circular 2026/84</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#B7791F]">Awaiting Clarification</div>
        <div class="text-xl font-bold text-[#B7791F] mt-1 font-mono">{{ metrics.obligations_requiring_clarification || 1 }}</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Unresolved applicability</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#16845B]">Certified Applicable</div>
        <div class="text-xl font-bold text-[#16845B] mt-1 font-mono">{{ metrics.applicable_obligations || 2 }}</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Passed to engineering</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-purple-700">Policy Mappings</div>
        <div class="text-xl font-bold text-purple-700 mt-1 font-mono">{{ metrics.mapping_completion_count || 2 }}</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Harmonized rules</div>
      </div>
    </div>

    <!-- Document-Centred Split Workspace: Traceability & Triage -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Source Document Viewer & Citation Context -->
      <div class="lg:col-span-7 space-y-4">
        <AppCard title="Regulatory Source Provenance" subtitle="Verifiable text excerpt from authentic authority publication" noPadding>
          <div class="p-4 bg-[#F1F6FA] border-b border-[#D8E3EC] flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="font-bold text-[#172B3A]">Reserve Bank of India</span>
              <span class="text-[#647789]">·</span>
              <span class="font-mono text-[#647789]">DOR.STR.REC.57/21.06.001/2026-27</span>
            </div>
            <router-link to="/circulars/circ-rbi-2026-84" class="text-purple-700 hover:text-purple-900 font-medium underline flex items-center gap-1">
              View Original PDF
              <AppIcon name="chevron-right" :size="12" />
            </router-link>
          </div>

          <!-- Document Excerpt View -->
          <div class="p-5 space-y-4">
            <div class="rounded-md border border-purple-200/80 bg-purple-50/40 p-4 relative">
              <div class="flex items-center justify-between text-xs text-[#172B3A] mb-2 font-medium">
                <span class="font-semibold text-[#172B3A] flex items-center gap-1.5">
                  <AppIcon name="file-text" :size="14" class="text-purple-600" />
                  Section 3(a) · Regulatory Mandate
                </span>
                <span class="bg-white border border-[#D8E3EC] text-purple-900 px-2 py-0.5 rounded text-[11px] font-mono">
                  Page 4
                </span>
              </div>
              <blockquote class="text-xs text-[#172B3A] leading-relaxed pl-3 border-l-2 border-purple-600 bg-white py-2.5 pr-3 rounded-r italic font-serif">
                "Risk weight on unsecured consumer credit by scheduled commercial banks is hereby enhanced from 100% to 125%. Credit extended to microfinance loans and self-help groups shall continue to attract the existing 100% risk weight."
              </blockquote>
              <div class="mt-2.5 pt-2 border-t border-[#D8E3EC] flex items-center justify-between text-[11px] text-[#647789]">
                <span>Effective Date: <strong class="text-[#172B3A]">November 1, 2026</strong></span>
                <span class="font-mono text-purple-700">Hash: e9c1..8fa3</span>
              </div>
            </div>

            <!-- Citation Metadata Grid -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 bg-white border border-[#D8E3EC] rounded">
                <div class="text-[10px] text-[#647789] uppercase font-semibold">Regulated Entity Class</div>
                <div class="font-medium text-[#172B3A] mt-0.5">Commercial Banks & NBFCs</div>
              </div>
              <div class="p-3 bg-white border border-[#D8E3EC] rounded">
                <div class="text-[10px] text-[#647789] uppercase font-semibold">Impacted Credit Category</div>
                <div class="font-medium text-[#172B3A] mt-0.5">Unsecured Consumer Lending</div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Policy Harmonization Notice -->
        <AppCard title="Internal Policy Conflict Analysis" subtitle="Cross-referenced against corporate credit policy rules" compact>
          <div class="p-3.5 bg-[#FDF6E9] border border-[#E8D2A6] rounded-md text-xs space-y-2">
            <div class="flex items-center gap-2 text-[#B7791F] font-semibold">
              <AppIcon name="alert" :size="14" class="text-[#B7791F]" />
              <span>Conflict Identified: Policy POL-CR-001 Outdated</span>
            </div>
            <p class="text-[#172B3A] leading-relaxed text-[11px]">
              Internal Credit Policy <code>POL-CR-001</code> specifies a 100% risk weight ceiling for personal loans. The new circular mandates 125%, creating an immediate regulatory discrepancy.
            </p>
            <div class="pt-1 flex items-center gap-2">
              <router-link to="/policy-mapping">
                <AppButton variant="secondary" size="sm">
                  Review & Remap Policy
                </AppButton>
              </router-link>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Right Column: Extracted Obligations Triage Desk -->
      <div class="lg:col-span-5 space-y-4">
        <AppCard title="Extracted Obligations" subtitle="Review and certify applicability" noPadding>
          <div class="divide-y divide-border">
            <div
              v-for="o in obligations"
              :key="o.id"
              class="p-4 hover:bg-[#F1F6FA] transition-colors cursor-pointer"
              :class="selectedObligation?.id === o.id ? 'bg-purple-50/40 border-l-2 border-purple-600' : ''"
              @click="selectedObligation = o"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-xs font-bold text-purple-900">{{ o.obligation_code }}</span>
                <AppBadge
                  :variant="o.applicability === 'APPLICABLE' ? 'success' : o.applicability === 'UNRESOLVED' ? 'warning' : 'neutral'"
                >
                  {{ o.applicability }}
                </AppBadge>
              </div>
              <div class="text-xs font-medium text-[#172B3A] mt-1 line-clamp-1">{{ o.title }}</div>
              <div class="text-[11px] text-[#647789] mt-1 flex items-center gap-3">
                <span>Page {{ o.source_page }}</span>
                <span>·</span>
                <span class="truncate">{{ o.action }}</span>
              </div>
            </div>
          </div>

          <!-- Active Obligation Determination Box -->
          <div v-if="selectedObligation" class="p-4 bg-[#F1F6FA] border-t border-[#D8E3EC] space-y-3">
            <div class="text-xs font-semibold text-[#172B3A]">
              Update Determination: {{ selectedObligation.obligation_code }}
            </div>
            <div class="flex items-center gap-2">
              <AppButton
                size="sm"
                :variant="selectedObligation.applicability === 'APPLICABLE' ? 'primary' : 'outline'"
                @click="updateApplicability('APPLICABLE')"
              >
                Applicable
              </AppButton>
              <AppButton
                size="sm"
                :variant="selectedObligation.applicability === 'NOT_APPLICABLE' ? 'primary' : 'outline'"
                @click="updateApplicability('NOT_APPLICABLE')"
              >
                Not Applicable
              </AppButton>
              <AppButton
                size="sm"
                :variant="selectedObligation.applicability === 'UNRESOLVED' ? 'primary' : 'outline'"
                @click="updateApplicability('UNRESOLVED')"
              >
                Needs Review
              </AppButton>
            </div>
          </div>
        </AppCard>

        <!-- Quick Navigation -->
        <AppCard title="Analyst Actions" compact>
          <div class="space-y-2">
            <router-link to="/analyst/work" class="block">
              <AppButton variant="outline" size="sm" customClass="w-full justify-between">
                <span>My Assigned Work Items</span>
                <AppIcon name="chevron-right" :size="12" />
              </AppButton>
            </router-link>
            <router-link to="/policy-mapping" class="block">
              <AppButton variant="outline" size="sm" customClass="w-full justify-between">
                <span>Policy Harmonization Matrix</span>
                <AppIcon name="chevron-right" :size="12" />
              </AppButton>
            </router-link>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '../../services/api';
import type { Obligation, ApplicabilityState } from '../../types';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const metrics = ref<Record<string, any>>({});
const obligations = ref<Obligation[]>([]);
const selectedObligation = ref<Obligation | null>(null);

onMounted(async () => {
  try {
    const [mRes, oRes] = await Promise.all([
      apiService.getRoleDashboardMetrics(),
      apiService.getObligations('circ-rbi-2026-84'),
    ]);
    metrics.value = mRes.metrics || {};
    obligations.value = oRes || [];
    if (obligations.value.length > 0) {
      selectedObligation.value = obligations.value[0];
    }
  } catch (err) {
    console.error('Failed loading analyst hub:', err);
  }
});

const updateApplicability = async (status: ApplicabilityState) => {
  if (!selectedObligation.value) return;
  try {
    const updated = await apiService.reviewObligation(selectedObligation.value.id, {
      applicability: status,
      review_status: 'ACCEPTED'
    });
    selectedObligation.value.applicability = updated.applicability;
    const idx = obligations.value.findIndex(o => o.id === updated.id);
    if (idx !== -1) obligations.value[idx] = updated;
  } catch (err) {
    console.error('Failed updating applicability:', err);
  }
};
</script>
