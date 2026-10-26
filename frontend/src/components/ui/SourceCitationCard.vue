<template>
  <div class="rounded-[3px] border border-[#E1E5E8] bg-[#F6F5F0]/60 p-3.5 relative overflow-hidden">
    <!-- Authority Header -->
    <div class="flex items-center justify-between text-xs text-[#526173] mb-2 font-medium">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 font-semibold text-[#182533]">
          <AppIcon name="file-text" :size="13" class="text-[#167D83]" />
          {{ circularTitle || 'Regulatory Source Document' }}
        </span>
        <span v-if="pageNumber" class="bg-white border border-[#E1E5E8] text-[#14263D] px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono font-medium">
          PAGE {{ pageNumber }}
        </span>
        <span v-if="spanRef" class="text-[#526173] text-[10px] font-mono">
          {{ spanRef }}
        </span>
      </div>
      <router-link
        v-if="circularId"
        :to="`/circulars/${circularId}`"
        class="text-[#167D83] hover:text-[#14263D] text-[11px] font-medium flex items-center gap-1 transition-colors"
      >
        Inspect Source
        <AppIcon name="chevron-right" :size="11" />
      </router-link>
    </div>

    <!-- Verifiable Source Extract -->
    <blockquote class="text-xs text-[#182533] leading-relaxed pl-3 border-l-2 border-[#167D83] bg-white py-2 pr-3 rounded-[3px] italic font-sans">
      "{{ extractedText }}"
    </blockquote>

    <div v-if="uncertaintyFlags && uncertaintyFlags.length > 0" class="mt-2.5 pt-2 border-t border-[#E1E5E8] flex items-start gap-1.5 text-xs text-[#AD741B]">
      <AppIcon name="alert" :size="13" class="text-[#AD741B] mt-0.5 flex-shrink-0" />
      <div>
        <span class="font-semibold text-[#AD741B]">Review Note / Ambiguity Flag: </span>
        <span class="text-[#182533]">{{ uncertaintyFlags.join('; ') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '../icons/AppIcon.vue';

defineProps<{
  circularTitle?: string;
  circularId?: string;
  pageNumber?: number;
  spanRef?: string;
  extractedText: string;
  uncertaintyFlags?: string[];
}>();
</script>
