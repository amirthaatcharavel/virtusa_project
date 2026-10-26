<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[#167D83] disabled:opacity-40 disabled:cursor-not-allowed select-none tracking-tight',
      sizeClasses,
      variantClasses,
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  customClass?: string;
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  customClass: '',
});

defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-[11px] px-2.5 py-1.5 rounded-[3px] gap-1.5 leading-none';
    case 'lg': return 'text-sm px-4 py-2.5 rounded-[4px] gap-2';
    default: return 'text-xs px-3 py-2 rounded-[3px] gap-1.5 leading-none';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-[#14263D] hover:bg-[#0B1728] active:bg-[#070E18] text-white border border-[#14263D] shadow-2xs font-semibold';
    case 'teal':
      return 'bg-[#167D83] hover:bg-[#126B70] active:bg-[#0F585C] text-white border border-[#167D83] shadow-2xs font-semibold';
    case 'secondary':
      return 'bg-[#167D83]/10 hover:bg-[#167D83]/15 text-[#167D83] border border-[#167D83]/25 font-semibold';
    case 'outline':
      return 'bg-white hover:bg-[#F6F5F0] text-[#182533] border border-[#E1E5E8] shadow-2xs font-medium';
    case 'danger':
      return 'bg-[#B33A42] hover:bg-[#972F36] active:bg-[#7D262C] text-white border border-transparent shadow-2xs font-semibold';
    case 'ghost':
      return 'bg-transparent hover:bg-[#F6F5F0] text-[#526173] hover:text-[#182533] font-medium';
    default:
      return 'bg-[#14263D] text-white border border-[#14263D]';
  }
});
</script>
