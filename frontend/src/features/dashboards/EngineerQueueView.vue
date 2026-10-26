<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-[#E1E5E8] rounded-[3px] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="teal" dot>Engineering Implementation Backlog</AppBadge>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173]">Assigned Operator: <strong class="text-[#182533]">Arun Patel</strong></span>
        </div>
        <h1 class="text-lg font-bold text-[#182533] tracking-tight">Rule Implementation Backlog</h1>
        <p class="text-xs text-[#526173] mt-0.5">
          Certified obligations from Compliance Analysts allocated for structured JSON Rule AST definition.
        </p>
      </div>

      <router-link to="/rules">
        <AppButton variant="primary" size="sm">
          <AppIcon name="rules" :size="14" />
          Open Rule Studio DSL
        </AppButton>
      </router-link>
    </div>

    <!-- Implementation Items List -->
    <AppCard title="Ready for Rule Engineering" subtitle="Applicable obligations with verified policy mappings" noPadding>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-[10px] font-mono">
              <th class="px-5 py-3 font-semibold">Obligation & Policy</th>
              <th class="px-4 py-3 font-semibold">Regulatory Conditions & Threshold</th>
              <th class="px-4 py-3 font-semibold">Analyst Certification</th>
              <th class="px-4 py-3 font-semibold">Rule Status</th>
              <th class="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E1E5E8]">
            <tr v-if="loading" class="text-center">
              <td colspan="5" class="py-8 text-[#526173] font-mono">Loading implementation queue...</td>
            </tr>
            <tr v-for="o in applicableObligations" :key="o.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
              <td class="px-5 py-3.5">
                <div class="font-mono font-bold text-[#167D83] text-xs">{{ o.obligation_code }}</div>
                <div class="font-medium text-[#182533] text-xs mt-0.5">{{ o.title }}</div>
                <div class="text-[11px] text-[#526173] font-mono mt-0.5">{{ o.policy_code || 'POL-CR-01' }}</div>
              </td>
              <td class="px-4 py-3.5 text-[#526173] text-[11px] font-mono max-w-sm">
                <div>Threshold: {{ o.threshold || 'Loan > ₹50k' }}</div>
                <div class="text-[#526173] line-clamp-2 mt-0.5">{{ o.conditions }}</div>
              </td>
              <td class="px-4 py-3.5">
                <AppBadge variant="success">APPLICABLE</AppBadge>
                <div class="text-[10px] text-[#526173] mt-0.5 font-mono">Maya Sen (Analyst)</div>
              </td>
              <td class="px-4 py-3.5">
                <AppBadge variant="teal" dot>TESTED (v1.1)</AppBadge>
              </td>
              <td class="px-5 py-3.5 text-right">
                <router-link to="/rules">
                  <AppButton variant="secondary" size="sm">
                    Open DSL Editor →
                  </AppButton>
                </router-link>
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
import { apiService } from '../../services/api';
import type { Obligation } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const applicableObligations = ref<Obligation[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    const all = await apiService.getObligations();
    applicableObligations.value = all.filter(o => o.applicability === 'APPLICABLE' || o.applicability === 'UNRESOLVED');
  } catch (err) {
    console.error('Failed loading engineering queue', err);
  } finally {
    loading.value = false;
  }
});
</script>
