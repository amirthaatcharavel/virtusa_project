<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed select-none',
      sizeClasses,
      variantClasses,
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
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
    case 'sm': return 'text-xs px-2.5 py-1.5 rounded-md gap-1.5';
    case 'lg': return 'text-base px-5 py-2.5 rounded-lg gap-2.5';
    default: return 'text-sm px-3.5 py-2 rounded-md gap-2';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white shadow-xs border border-transparent';
    case 'secondary':
      return 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200';
    case 'outline':
      return 'bg-white hover:bg-[#F1F6FA] text-[#172B3A] border border-[#D8E3EC] shadow-2xs';
    case 'danger':
      return 'bg-[#B42318] hover:bg-[#911B12] active:bg-[#7A160F] text-white shadow-xs border border-transparent';
    case 'ghost':
      return 'bg-transparent hover:bg-[#F1F6FA] text-[#647789] hover:text-[#172B3A]';
    default:
      return 'bg-purple-600 text-white';
  }
});
</script>
