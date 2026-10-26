<template>
  <div v-if="open" class="fixed inset-0 z-50 overflow-y-auto bg-[#0B1728]/70 backdrop-blur-2xs flex items-center justify-center p-4">
    <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-lg max-w-md w-full p-6 space-y-4 text-left transition-all">
      <!-- Modal Header -->
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-[3px] flex items-center justify-center flex-shrink-0"
            :class="variant === 'danger' ? 'bg-[#FDF1F2] text-[#B33A42] border border-[#F5C2C6]' : 'bg-[#167D83]/10 text-[#167D83] border border-[#167D83]/25'"
          >
            <AppIcon :name="icon || (variant === 'danger' ? 'alert' : 'check')" :size="18" />
          </div>
          <div>
            <h3 class="text-xs font-bold text-[#182533] uppercase tracking-wide">{{ title }}</h3>
            <p v-if="subtitle" class="text-[11px] text-[#526173] mt-0.5">{{ subtitle }}</p>
          </div>
        </div>
        <button
          @click="$emit('cancel')"
          class="text-[#526173] hover:text-[#182533] p-1 rounded-[2px] hover:bg-[#F6F5F0]"
        >
          <AppIcon name="close" :size="15" />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="text-xs text-[#182533] leading-relaxed space-y-3">
        <slot />

        <!-- Optional Comment / Reasoning Field -->
        <div v-if="requireComment" class="space-y-1.5 pt-1">
          <label class="block text-[11px] font-semibold text-[#182533] uppercase tracking-wide">
            {{ commentLabel || 'Reason / Rationale (Mandatory)' }} <span class="text-[#B33A42]">*</span>
          </label>
          <textarea
            :value="comment"
            @input="$emit('update:comment', ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            class="w-full text-xs p-2.5 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] placeholder-[#526173]/60"
            :placeholder="commentPlaceholder || 'Provide detailed justification for compliance audit recording...'"
          ></textarea>
          <p v-if="commentError" class="text-[11px] text-[#B33A42] font-medium">{{ commentError }}</p>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="pt-3 flex items-center justify-end gap-2 border-t border-[#E1E5E8]">
        <AppButton variant="outline" size="sm" @click="$emit('cancel')">
          {{ cancelText || 'Cancel' }}
        </AppButton>
        <AppButton
          :variant="variant === 'danger' ? 'danger' : 'primary'"
          size="sm"
          :loading="loading"
          @click="$emit('confirm')"
        >
          {{ confirmText || 'Confirm Action' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '../ui/AppButton.vue';
import AppIcon from '../icons/AppIcon.vue';

withDefaults(defineProps<{
  open: boolean;
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'danger';
  icon?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  requireComment?: boolean;
  commentLabel?: string;
  commentPlaceholder?: string;
  comment?: string;
  commentError?: string;
}>(), {
  variant: 'primary',
  loading: false,
  requireComment: false,
  comment: '',
  commentError: '',
});

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:comment', value: string): void;
}>();
</script>
