<template>
  <div v-if="isAuthorized">
    <slot />
  </div>
  <div v-else-if="showFallback" class="p-6 bg-[#B33A42]/5 border border-[#B33A42]/20 rounded-[3px] text-center space-y-2">
    <div class="text-xs font-bold text-[#B33A42] uppercase tracking-wider">Access Restricted</div>
    <p class="text-xs text-[#526173]">
      This component requires {{ requiredRoles.join(' or ') }} authorization. Current role: {{ authStore.roleLabel }}.
    </p>
    <router-link to="/access-denied" class="text-xs font-semibold text-[#167D83] hover:text-[#14263D] transition-colors">
      View Access Details →
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import type { UserRole } from '../../types';

const props = withDefaults(defineProps<{
  requiredRoles: UserRole[];
  showFallback?: boolean;
}>(), {
  showFallback: true,
});

const authStore = useAuthStore();

const isAuthorized = computed(() => {
  return authStore.hasRole(props.requiredRoles);
});
</script>
