<template>
  <div class="min-h-[70vh] flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-xl border border-[#FECDCA] shadow-sm p-8 text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] flex items-center justify-center mx-auto">
        <AppIcon name="alert" :size="32" />
      </div>

      <div>
        <h2 class="text-lg font-bold text-[#172B3A] tracking-tight">Access Denied (403 Forbidden)</h2>
        <p class="text-xs text-[#647789] mt-1 leading-relaxed">
          Your current session role <strong class="text-[#B42318]">({{ authStore.roleLabel }})</strong> lacks authorization to access this enterprise module.
        </p>
      </div>

      <div class="p-3 bg-[#F1F6FA] rounded-lg border border-[#D8E3EC] text-left text-xs space-y-1">
        <div class="text-xs text-[#647789] font-mono">Attempted Route: <span class="font-bold text-[#172B3A]">{{ attemptedRoute }}</span></div>
        <div class="text-xs text-[#647789]">Active User: <span class="font-semibold text-[#172B3A]">{{ authStore.currentUser.full_name }}</span></div>
        <div class="text-xs text-[#B7791F] font-medium">To access this resource, please authenticate with the required role.</div>
      </div>

      <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
        <AppButton variant="primary" size="sm" @click="goToAuthorizedHome">
          Return to My Workspace
        </AppButton>
        <router-link to="/login">
          <AppButton variant="outline" size="sm">
            Switch Persona
          </AppButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const attemptedRoute = computed(() => (route.query.redirect as string) || '/');

const goToAuthorizedHome = () => {
  router.push(authStore.defaultLandingRoute);
};
</script>
