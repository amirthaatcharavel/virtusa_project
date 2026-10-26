<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] text-[11px] font-medium tracking-tight font-mono leading-none select-none',
      variantClasses
    ]"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full" :class="dotClass" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'purple' | 'navy' | 'teal' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'subtle';
  dot?: boolean;
}>(), {
  variant: 'neutral',
  dot: false,
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'teal':
    case 'purple': // Remapped to Muted Teal
      return 'bg-[#167D83]/10 text-[#167D83] border border-[#167D83]/30';
    case 'navy':
      return 'bg-[#14263D]/10 text-[#14263D] border border-[#14263D]/25';
    case 'success':
      return 'bg-[#EDF6F1] text-[#247653] border border-[#BCE0CE]';
    case 'warning':
      return 'bg-[#FDF7EB] text-[#AD741B] border border-[#EED7A8]';
    case 'error':
      return 'bg-[#FDF1F2] text-[#B33A42] border border-[#F5C2C6]';
    case 'info':
      return 'bg-[#F0F8F8] text-[#167D83] border border-[#167D83]/25';
    case 'subtle':
    case 'neutral':
    default:
      return 'bg-[#F6F5F0] text-[#526173] border border-[#E1E5E8]';
  }
});

const dotClass = computed(() => {
  switch (props.variant) {
    case 'teal':
    case 'purple': return 'bg-[#167D83]';
    case 'navy': return 'bg-[#14263D]';
    case 'success': return 'bg-[#247653]';
    case 'warning': return 'bg-[#AD741B]';
    case 'error': return 'bg-[#B33A42]';
    case 'info': return 'bg-[#167D83]';
    default: return 'bg-[#526173]';
  }
});
</script>
