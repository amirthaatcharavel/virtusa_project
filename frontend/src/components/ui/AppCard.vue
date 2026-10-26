<template>
  <div
    :class="[
      'bg-white rounded-[4px] border border-[#E1E5E8] shadow-2xs overflow-hidden',
      paddingClasses,
      customClass
    ]"
  >
    <div v-if="$slots.header || title" class="px-5 py-3.5 border-b border-[#E1E5E8] bg-white flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <slot name="header-icon" />
        <div>
          <h3 v-if="title" class="text-xs font-bold text-[#182533] uppercase tracking-wide">{{ title }}</h3>
          <p v-if="subtitle" class="text-[11px] text-[#526173] mt-0.5">{{ subtitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <slot name="header-actions" />
      </div>
    </div>
    
    <div :class="bodyPadding">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-5 py-3 bg-[#F6F5F0] border-t border-[#E1E5E8] flex items-center justify-between text-[11px] text-[#526173]">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  title?: string;
  subtitle?: string;
  noPadding?: boolean;
  compact?: boolean;
  customClass?: string;
}>(), {
  noPadding: false,
  compact: false,
  customClass: '',
});

const paddingClasses = computed(() => '');
const bodyPadding = computed(() => {
  if (props.noPadding) return '';
  if (props.compact) return 'p-3.5';
  return 'p-5';
});
</script>
