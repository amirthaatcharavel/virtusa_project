<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide',
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
    case 'purple':
    case 'teal': // Aliased to Royal Purple / Soft Lavender
      return 'bg-purple-100 text-purple-900 border border-purple-200';
    case 'navy':
      return 'bg-[#F1F6FA] text-[#172B3A] border border-[#D8E3EC]';
    case 'success':
      return 'bg-[#E8F5EE] text-[#16845B] border border-[#B2DEC7]';
    case 'warning':
      return 'bg-[#FDF6E9] text-[#B7791F] border border-[#E8D2A6]';
    case 'error':
      return 'bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA]';
    case 'info':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'subtle':
      return 'bg-[#F1F6FA] text-[#647789] border border-[#D8E3EC]';
    default:
      return 'bg-[#F1F6FA] text-[#647789] border border-[#D8E3EC]';
  }
});

const dotClass = computed(() => {
  switch (props.variant) {
    case 'purple':
    case 'teal': return 'bg-purple-600';
    case 'navy': return 'bg-[#172B3A]';
    case 'success': return 'bg-[#16845B]';
    case 'warning': return 'bg-[#B7791F]';
    case 'error': return 'bg-[#B42318]';
    case 'info': return 'bg-blue-600';
    default: return 'bg-[#647789]';
  }
});
</script>
