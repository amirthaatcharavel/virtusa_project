<template>
  <div class="min-h-screen bg-[#F1F6FA] text-[#172B3A] font-sans antialiased flex flex-col justify-between selection:bg-purple-100 selection:text-purple-900">
    <!-- Top Minimal Navigation -->
    <header class="h-16 bg-white border-b border-[#D8E3EC] px-6 flex items-center justify-between">
      <router-link to="/landing" class="flex items-center gap-3">
        <div class="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 font-bold text-xs tracking-wider shadow-inner">
          <svg class="w-4 h-4 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div class="font-bold text-xs tracking-wider text-[#172B3A] uppercase leading-tight">Regulatory Change</div>
          <div class="text-[10px] text-purple-700 font-semibold tracking-wide">Intelligence Platform</div>
        </div>
      </router-link>

      <div class="flex items-center gap-2">
        <router-link to="/landing">
          <AppButton variant="ghost" size="sm">
            ← Back to Overview
          </AppButton>
        </router-link>
      </div>
    </header>

    <!-- Main Authentication Box -->
    <main class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-xl space-y-6">
        <!-- Gateway Header -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-200">
            <AppIcon name="shield" :size="13" class="text-purple-700" />
            <span>Institutional Access Gateway</span>
          </div>
          <h1 class="text-2xl font-bold text-[#172B3A] tracking-tight">Sign In to Regulatory Workspace</h1>
          <p class="text-xs text-[#647789] max-w-md mx-auto">
            Select a verified persona or enter your institutional credentials to access your role-specific regulatory governance environment.
          </p>
        </div>

        <!-- Enterprise Card -->
        <div class="bg-white rounded-lg border border-[#D8E3EC] shadow-sm p-6 space-y-6">
          <!-- Persona Selector Section -->
          <div>
            <label class="block text-xs font-bold text-[#172B3A] uppercase tracking-wider mb-2.5">
              Select Institutional Persona
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                v-for="user in authStore.availableUsers"
                :key="user.id"
                type="button"
                @click="selectPersona(user.id)"
                class="p-3 rounded-lg border text-left transition-all"
                :class="selectedUserId === user.id
                  ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-600'
                  : 'border-[#D8E3EC] bg-white hover:bg-[#F1F6FA]'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-bold text-xs text-[#172B3A]">{{ user.full_name }}</span>
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="selectedUserId === user.id ? 'bg-purple-600' : 'bg-[#D8E3EC]'"
                  ></span>
                </div>
                <div class="text-[11px] text-purple-900 font-medium mt-0.5">
                  {{ formatRole(user.role) }}
                </div>
                <div class="text-[10px] text-[#647789] font-mono mt-1 truncate">
                  {{ user.email }}
                </div>
              </button>
            </div>
          </div>

          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t border-[#D8E3EC]"></div>
            <span class="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#647789]">Authenticated Credentials</span>
            <div class="flex-grow border-t border-[#D8E3EC]"></div>
          </div>

          <!-- Form Fields -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-[#172B3A] mb-1">Institutional Email / Identifier</label>
              <input
                v-model="emailInput"
                type="email"
                required
                class="w-full px-3 py-2 text-xs bg-white border border-[#D8E3EC] rounded-md text-[#172B3A] placeholder-[#647789]/60 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                placeholder="name@compliance.bank.internal"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-semibold text-[#172B3A]">Enterprise Access Passcode</label>
                <span class="text-[10px] text-[#647789] font-mono">Sandbox Demo Auth</span>
              </div>
              <input
                v-model="passwordInput"
                type="password"
                required
                class="w-full px-3 py-2 text-xs bg-white border border-[#D8E3EC] rounded-md text-[#172B3A] placeholder-[#647789]/60 focus:ring-1 focus:ring-purple-600 focus:outline-none font-mono"
                placeholder="••••••••••••"
              />
            </div>

            <!-- Login Action Button -->
            <div class="pt-2">
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                customClass="w-full justify-center py-2.5"
                :loading="submitting"
              >
                Sign In to {{ activePersonaTitle }} →
              </AppButton>
            </div>
          </form>

          <!-- Security Assurance Note -->
          <div class="p-3 bg-[#F1F6FA] border border-[#D8E3EC] rounded text-[11px] text-[#647789] flex items-start gap-2">
            <AppIcon name="shield" :size="14" class="text-purple-700 mt-0.5 flex-shrink-0" />
            <div>
              <strong class="text-[#172B3A]">Security Notice: </strong>
              This session operates under strict dual-control RBAC governance. All navigation, approvals, and DSL executions are cryptographically recorded in the immutable audit ledger.
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="h-12 border-t border-[#D8E3EC] bg-white px-6 flex items-center justify-between text-[11px] text-[#647789]">
      <span>Regulatory Change Intelligence Platform · Enterprise Edition</span>
      <span>Isolated Sandbox Active · 100% RBAC Enforced</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import type { UserRole } from '../../types';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const router = useRouter();
const authStore = useAuthStore();

const selectedUserId = ref<string>('usr-analyst-01');
const emailInput = ref<string>('maya.sen@compliance.bank.internal');
const passwordInput = ref<string>('SandboxDemo2026!');
const submitting = ref(false);

onMounted(async () => {
  await authStore.fetchUsers();
  selectedUserId.value = authStore.currentUser.id || 'usr-analyst-01';
  syncEmail();
});

const selectPersona = (userId: string) => {
  selectedUserId.value = userId;
  syncEmail();
};

const syncEmail = () => {
  const user = authStore.availableUsers.find(u => u.id === selectedUserId.value);
  if (user) {
    emailInput.value = user.email;
  }
};

const formatRole = (role: UserRole): string => {
  switch (role) {
    case 'COMPLIANCE_ANALYST': return 'Compliance Analyst';
    case 'RULE_ENGINEER': return 'Rule Engineer / IT';
    case 'COMPLIANCE_APPROVER': return 'Compliance Approver';
    case 'PLATFORM_ADMIN': return 'Platform Administrator';
    default: return role;
  }
};

const activePersonaTitle = computed(() => {
  const user = authStore.availableUsers.find(u => u.id === selectedUserId.value);
  return user ? formatRole(user.role) : 'Workspace';
});

const handleLogin = async () => {
  submitting.value = true;
  try {
    // Switch active user in auth store
    authStore.switchUser(selectedUserId.value);
    // Route to user's dedicated landing dashboard
    router.push(authStore.defaultLandingRoute);
  } finally {
    submitting.value = false;
  }
};
</script>
