<template>
  <div class="rounded-lg border border-purple-200/80 bg-purple-50/40 p-4 relative overflow-hidden">
    <!-- Authority Header -->
    <div class="flex items-center justify-between text-xs text-[#647789] mb-2 font-medium">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1 font-semibold text-[#172B3A]">
          <AppIcon name="file-text" :size="14" class="text-purple-600" />
          {{ circularTitle || 'Regulatory Source Document' }}
        </span>
        <span v-if="pageNumber" class="bg-white border border-[#D8E3EC] text-purple-900 px-2 py-0.5 rounded text-[11px] font-mono">
          Page {{ pageNumber }}
        </span>
        <span v-if="spanRef" class="text-[#647789] text-[11px] font-mono">
          {{ spanRef }}
        </span>
      </div>
      <router-link
        v-if="circularId"
        :to="`/circulars/${circularId}`"
        class="text-purple-700 hover:text-purple-900 underline text-[11px] font-medium flex items-center gap-1"
      >
        Inspect Source Document
        <AppIcon name="chevron-right" :size="12" />
      </router-link>
    </div>

    <!-- Verifiable Source Extract -->
    <blockquote class="text-xs text-[#172B3A] leading-relaxed pl-3 border-l-2 border-purple-600 bg-white py-2 pr-3 rounded-r italic font-serif">
      "{{ extractedText }}"
    </blockquote>

    <div v-if="uncertaintyFlags && uncertaintyFlags.length > 0" class="mt-2.5 pt-2 border-t border-[#D8E3EC] flex items-start gap-1.5 text-xs text-[#B7791F]">
      <AppIcon name="alert" :size="13" class="text-[#B7791F] mt-0.5 flex-shrink-0" />
      <div>
        <span class="font-semibold text-[#B7791F]">Review Note / Ambiguity Flag: </span>
        <span class="text-[#172B3A]">{{ uncertaintyFlags.join('; ') }}</span>
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
