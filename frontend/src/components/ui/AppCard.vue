<template>
  <div
    :class="[
      'bg-white rounded-lg border border-border shadow-xs overflow-hidden',
      paddingClasses,
      customClass
    ]"
  >
    <div v-if="$slots.header || title" class="px-5 py-4 border-b border-border flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <slot name="header-icon" />
        <div>
          <h3 v-if="title" class="text-sm font-semibold text-text-primary">{{ title }}</h3>
          <p v-if="subtitle" class="text-xs text-text-secondary mt-0.5">{{ subtitle }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <slot name="header-actions" />
      </div>
    </div>
    
    <div :class="bodyPadding">
      <slot />
    </div>

    <div v-if="$slots.footer" class="px-5 py-3.5 bg-surface-muted border-t border-border flex items-center justify-between text-xs text-text-secondary">
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
