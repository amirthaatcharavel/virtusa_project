<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-[#E1E5E8] rounded-[3px] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="teal" dot>Analyst Assigned Queue</AppBadge>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173]">Assigned Operator: <strong class="text-[#182533]">Maya Sen</strong></span>
        </div>
        <h1 class="text-2xl font-extrabold text-[#182533] tracking-tight">Assigned Regulatory Work Items</h1>
        <p class="text-xs text-[#526173] mt-0.5">
          Extracted obligations allocated for legal interpretation, applicability certification, and policy mapping.
        </p>
      </div>

      <router-link to="/circulars/upload">
        <AppButton variant="primary" size="sm">
          <AppIcon name="plus" :size="14" />
          Ingest New Circular
        </AppButton>
      </router-link>
    </div>

    <!-- Assigned Obligations List -->
    <AppCard title="Active Review Backlog" subtitle="Certified provenance records awaiting compliance verification" noPadding>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-xs font-mono">
              <th class="px-5 py-3 font-semibold">Obligation Code / Title</th>
              <th class="px-4 py-3 font-semibold">Source Provenance</th>
              <th class="px-4 py-3 font-semibold">Mandated Action</th>
              <th class="px-4 py-3 font-semibold">Determination</th>
              <th class="px-5 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E1E5E8]">
            <tr v-if="loading" class="text-center">
              <td colspan="5" class="py-8 text-[#526173] font-mono">Loading assigned tasks...</td>
            </tr>
            <tr v-for="o in obligations" :key="o.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
              <td class="px-5 py-3.5">
                <div class="font-mono font-bold text-[#167D83] text-xs">{{ o.obligation_code }}</div>
                <div class="font-medium text-[#182533] text-xs mt-0.5">{{ o.title }}</div>
              </td>
              <td class="px-4 py-3.5 font-mono text-xs text-[#526173]">
                Page {{ o.source_page }} · {{ o.source_span || 'Section 3(a)' }}
              </td>
              <td class="px-4 py-3.5 text-[#526173] text-xs max-w-xs line-clamp-2">
                {{ o.action || 'Standard compliance evaluation' }}
              </td>
              <td class="px-4 py-3.5">
                <AppBadge :variant="o.applicability === 'APPLICABLE' ? 'success' : o.applicability === 'UNRESOLVED' ? 'warning' : 'neutral'">
                  {{ o.applicability }}
                </AppBadge>
              </td>
              <td class="px-5 py-3.5 text-right">
                <router-link :to="`/obligations/${o.id}`">
                  <AppButton variant="secondary" size="sm">
                    Open Review →
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

const obligations = ref<Obligation[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;
    const data = await apiService.getObligations();
    obligations.value = data;
  } catch (err) {
    console.error('Failed loading assigned obligations', err);
  } finally {
    loading.value = false;
  }
});
</script>
