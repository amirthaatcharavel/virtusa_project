<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <router-link to="/circulars" class="text-xs text-[#167D83] hover:underline flex items-center gap-1 font-medium font-mono">
            ← Back to Circular Library
          </router-link>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs font-mono text-[#526173]">{{ circular?.circular_number || 'CIRCULAR' }}</span>
        </div>
        <h1 class="text-lg font-bold text-[#182533] tracking-tight">
          {{ circular?.title || 'Loading Circular Document...' }}
        </h1>
        <div class="flex flex-wrap items-center gap-3 text-xs text-[#526173] mt-1">
          <span>Authority: <strong class="text-[#182533]">{{ circular?.source_authority }}</strong></span>
          <span>·</span>
          <span>Publication: <span class="font-mono">{{ circular?.publication_date }}</span></span>
          <span>·</span>
          <span>Effective: <span class="font-mono text-[#167D83] font-semibold">{{ circular?.effective_date }}</span></span>
          <span>·</span>
          <AppBadge variant="teal" dot>{{ circular?.status }}</AppBadge>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <router-link v-if="selectedObligation" :to="`/obligations/${selectedObligation.id}`">
          <AppButton variant="primary" size="sm">
            Review Obligation →
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Dual-Pane Source Intelligence Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
      <!-- Left Pane: Source Document Viewer (7 cols) -->
      <div class="lg:col-span-7 flex flex-col bg-white rounded-[3px] border border-[#E1E5E8] shadow-2xs overflow-hidden">
        <!-- Page Navigation Bar -->
        <div class="px-4 py-3 bg-[#F6F5F0] border-b border-[#E1E5E8] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <AppIcon name="file-text" :size="15" class="text-[#167D83]" />
            <span class="text-xs font-semibold text-[#182533]">Source Document Text Viewer</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-[#526173] font-mono">Page:</span>
            <div class="flex items-center gap-1">
              <button
                v-for="p in circular?.pages || []"
                :key="p.page_number"
                @click="activePageNumber = p.page_number"
                :class="[
                  'px-2.5 py-1 text-xs font-mono font-medium rounded-[3px] transition-colors',
                  activePageNumber === p.page_number
                    ? 'bg-[#14263D] text-white font-bold'
                    : 'bg-white border border-[#E1E5E8] text-[#526173] hover:bg-[#F6F5F0]'
                ]"
              >
                {{ p.page_number }}
              </button>
            </div>
          </div>
        </div>

        <!-- Document Text Canvas -->
        <div class="flex-1 p-6 overflow-y-auto bg-[#F6F5F0]/50 font-sans text-xs md:text-sm leading-relaxed text-[#182533] space-y-4">
          <div class="bg-white p-6 rounded-[3px] border border-[#E1E5E8] shadow-2xs">
            <div class="text-[11px] font-mono text-[#526173] mb-4 pb-2 border-b border-[#E1E5E8] flex items-center justify-between uppercase">
              <span>Authentic Extracted Page {{ activePageNumber }} of {{ circular?.page_count }}</span>
              <span>SHA: {{ circular?.file_hash?.substring(0, 12) }}...</span>
            </div>
            
            <pre class="whitespace-pre-wrap font-sans text-[#182533] text-xs md:text-sm leading-relaxed">{{ currentPageText }}</pre>
          </div>
        </div>
      </div>

      <!-- Right Pane: Extracted Candidate Obligations (5 cols) -->
      <div class="lg:col-span-5 flex flex-col space-y-4">
        <AppCard title="Candidate Regulatory Obligations" :subtitle="`${obligations.length} obligations parsed from this circular`" noPadding>
          <div class="divide-y divide-[#E1E5E8] max-h-[380px] overflow-y-auto">
            <div
              v-for="obl in obligations"
              :key="obl.id"
              @click="selectObligation(obl)"
              :class="[
                'p-4 cursor-pointer transition-all border-l-4',
                selectedObligation?.id === obl.id
                  ? 'bg-[#167D83]/10 border-[#167D83]'
                  : 'hover:bg-[#F6F5F0]/60 border-transparent'
              ]"
            >
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-mono font-semibold text-[#167D83]">{{ obl.obligation_code }}</span>
                <span class="text-[11px] bg-[#F6F5F0] text-[#526173] px-2 py-0.5 rounded-[3px] font-mono border border-[#E1E5E8]">
                  Page {{ obl.source_page }}
                </span>
              </div>
              <div class="text-xs font-semibold text-[#182533] mb-1">
                {{ obl.title }}
              </div>
              <div class="text-[11px] text-[#526173] line-clamp-2 italic mb-2">
                "{{ obl.extracted_text }}"
              </div>
              <div class="flex items-center justify-between text-[11px] pt-1">
                <AppBadge :variant="obl.applicability === 'APPLICABLE' ? 'success' : obl.applicability === 'UNRESOLVED' ? 'warning' : 'neutral'">
                  {{ obl.applicability }}
                </AppBadge>
                <span class="text-[#167D83] font-medium hover:underline text-[11px] flex items-center gap-0.5 font-mono">
                  Inspect Citation <AppIcon name="chevron-right" :size="10" />
                </span>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Selected Obligation Deep-Dive & Provenance Card -->
        <AppCard v-if="selectedObligation" title="Selected Obligation Provenance" subtitle="Structured extraction attributes">
          <div class="space-y-3 text-xs">
            <!-- Source Citation Block -->
            <SourceCitationCard
              :circularTitle="circular?.title"
              :circularId="circular?.id"
              :pageNumber="selectedObligation.source_page"
              :spanRef="selectedObligation.source_span"
              :extractedText="selectedObligation.extracted_text"
              :uncertaintyFlags="selectedObligation.flags"
            />

            <div class="grid grid-cols-2 gap-2.5 pt-2">
              <div class="bg-[#F6F5F0] p-2.5 rounded-[3px] border border-[#E1E5E8]">
                <span class="text-[10px] uppercase font-bold text-[#526173] block font-mono">Regulated Actor</span>
                <span class="font-medium text-[#182533] text-[11px]">{{ selectedObligation.actor || 'Not specified' }}</span>
              </div>
              <div class="bg-[#F6F5F0] p-2.5 rounded-[3px] border border-[#E1E5E8]">
                <span class="text-[10px] uppercase font-bold text-[#526173] block font-mono">Regulatory Threshold</span>
                <span class="font-medium text-[#167D83] font-mono text-[11px]">{{ selectedObligation.threshold || 'N/A' }}</span>
              </div>
            </div>

            <div class="bg-[#F6F5F0] p-2.5 rounded-[3px] border border-[#E1E5E8]">
              <span class="text-[10px] uppercase font-bold text-[#526173] block font-mono">Mandated Action</span>
              <span class="font-medium text-[#182533] text-[11px]">{{ selectedObligation.action || 'Standard compliance' }}</span>
            </div>

            <div class="flex items-center justify-between pt-2">
              <router-link :to="`/obligations/${selectedObligation.id}`" class="w-full">
                <AppButton variant="primary" size="sm" customClass="w-full">
                  Proceed to Applicability Review →
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { apiService } from '../../services/api';
import type { Circular, Obligation } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';
import SourceCitationCard from '../../components/ui/SourceCitationCard.vue';

const route = useRoute();
const circular = ref<Circular | null>(null);
const obligations = ref<Obligation[]>([]);
const activePageNumber = ref(1);
const selectedObligation = ref<Obligation | null>(null);

const circularId = computed(() => route.params.circularId as string);

onMounted(async () => {
  try {
    const [cData, oData] = await Promise.all([
      apiService.getCircularDetail(circularId.value),
      apiService.getObligations(circularId.value),
    ]);
    circular.value = cData;
    obligations.value = oData;
    if (oData.length > 0) {
      selectedObligation.value = oData[0];
      activePageNumber.value = oData[0].source_page;
    }
  } catch (err) {
    console.error('Failed loading circular detail', err);
  }
});

const currentPageText = computed(() => {
  if (!circular.value?.pages) return circular.value?.extracted_text || 'No text extracted.';
  const page = circular.value.pages.find(p => p.page_number === activePageNumber.value);
  return page ? page.text_content : 'Page text not available.';
});

const selectObligation = (obl: Obligation) => {
  selectedObligation.value = obl;
  activePageNumber.value = obl.source_page;
};
</script>
