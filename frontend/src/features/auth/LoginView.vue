<template>
  <div class="min-h-screen bg-[#F6F5F0] text-[#182533] font-sans antialiased flex flex-col justify-between selection:bg-[#167D83]/20 selection:text-[#14263D]">
    <!-- Top Minimal Navigation -->
    <header class="h-14 bg-white border-b border-[#E1E5E8] px-6 flex items-center justify-between">
      <router-link to="/landing" class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-[3px] bg-[#0B1728] border border-[#14263D] flex items-center justify-center text-[#32B5BC] font-mono font-bold text-xs shadow-inner">
          <svg class="w-4 h-4 text-[#32B5BC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div class="font-bold text-xs tracking-wider text-[#182533] uppercase leading-tight">Regulatory Change</div>
          <div class="text-xs text-[#167D83] font-mono tracking-wide">Governance Platform</div>
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
      <div class="w-full max-w-2xl space-y-5">
        <!-- Gateway Header -->
        <div class="text-center space-y-1.5">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] text-xs font-mono font-medium bg-[#167D83]/10 text-[#167D83] border border-[#167D83]/20">
            <AppIcon name="shield" :size="12" class="text-[#167D83]" />
            <span>Institutional Access Gateway</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-extrabold text-[#182533] tracking-tight">Enterprise Governance Portal</h1>
          <p class="text-xs text-[#526173] max-w-lg mx-auto leading-relaxed">
            Select one of the verified institutional roles below to access role-specific regulatory modules and governance tools.
          </p>
        </div>

        <!-- Demonstration Notice Banner -->
        <div class="bg-[#FDF7EB] border border-[#EED7A8] rounded-[3px] p-3 text-xs text-[#AD741B] flex items-start gap-2.5">
          <AppIcon name="alert" :size="14" class="text-[#AD741B] flex-shrink-0 mt-0.5" />
          <div class="text-xs leading-relaxed">
            <strong class="font-semibold text-[#8B5C13]">Frontend Demonstration Sandbox:</strong>
            Role-aware presentation environment with full offline persistence. You can preview all four roles freely.
          </div>
        </div>

        <!-- Enterprise Card -->
        <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-2xs p-6 space-y-5">
          <!-- Four Role Selector Grid -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-xs font-bold text-[#182533] uppercase tracking-wider">
                Select Institutional Persona
              </label>
              <span class="text-xs text-[#167D83] font-mono">4 Roles Configured</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="roleItem in roleOptions"
                :key="roleItem.role"
                @click="selectRole(roleItem.role)"
                class="p-3 rounded-[3px] border text-left cursor-pointer transition-all relative group"
                :class="selectedRole === roleItem.role
                  ? 'border-[#167D83] bg-[#F0F8F8] ring-1 ring-[#167D83] shadow-2xs'
                  : 'border-[#E1E5E8] bg-white hover:bg-[#F6F5F0] hover:border-[#167D83]/40'"
              >
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="w-5 h-5 rounded-[2px] flex items-center justify-center text-xs font-mono font-bold"
                      :class="selectedRole === roleItem.role ? 'bg-[#167D83] text-white' : 'bg-[#F6F5F0] text-[#14263D] border border-[#E1E5E8]'"
                    >
                      {{ roleItem.index }}
                    </span>
                    <div>
                      <div class="font-bold text-xs text-[#182533] leading-tight">{{ roleItem.title }}</div>
                      <div class="text-xs text-[#167D83] font-medium">{{ roleItem.personaName }}</div>
                    </div>
                  </div>
                  <span
                    class="w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5"
                    :class="selectedRole === roleItem.role ? 'border-[#167D83] bg-[#167D83]' : 'border-[#E1E5E8] bg-white'"
                  >
                    <span v-if="selectedRole === roleItem.role" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </span>
                </div>

                <p class="text-xs text-[#526173] mt-2 line-clamp-2 leading-relaxed">
                  {{ roleItem.description }}
                </p>

                <div class="mt-2.5 pt-2 border-t border-[#E1E5E8] flex items-center justify-between text-xs font-mono">
                  <span class="text-[#526173] truncate max-w-[160px]">{{ roleItem.email }}</span>
                  <span class="text-[#167D83] font-semibold group-hover:underline">
                    {{ roleItem.targetRoute }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t border-[#E1E5E8]"></div>
            <span class="flex-shrink mx-3 text-xs uppercase font-bold text-[#526173] font-mono tracking-wider">Access Credentials</span>
            <div class="flex-grow border-t border-[#E1E5E8]"></div>
          </div>

          <!-- Error Alert Banner -->
          <div v-if="errorMessage" class="p-2.5 bg-[#FDF1F2] border border-[#F5C2C6] rounded-[3px] text-xs text-[#B33A42] flex items-start gap-2">
            <AppIcon name="alert" :size="13" class="text-[#B33A42] flex-shrink-0 mt-0.5" />
            <div>{{ errorMessage }}</div>
          </div>

          <!-- Success Alert Banner -->
          <div v-if="successMessage" class="p-2.5 bg-[#EDF6F1] border border-[#BCE0CE] rounded-[3px] text-xs text-[#247653] flex items-start gap-2">
            <AppIcon name="check" :size="13" class="text-[#247653] flex-shrink-0 mt-0.5" />
            <div>{{ successMessage }}</div>
          </div>

          <!-- Form Fields -->
          <form @submit.prevent="handleLogin" class="space-y-3.5">
            <div>
              <label class="block text-xs font-semibold text-[#182533] uppercase tracking-wide mb-1">Institutional Identifier</label>
              <input
                v-model="emailInput"
                type="email"
                required
                :disabled="submitting"
                class="w-full px-3 py-1.5 text-xs bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] placeholder-[#526173]/50 focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none font-mono disabled:bg-[#F6F5F0]"
                placeholder="name@compliance.bank.internal"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-semibold text-[#182533] uppercase tracking-wide">Enterprise Passcode</label>
                <span class="text-xs text-[#526173] font-mono">Sandbox Demo Auth</span>
              </div>
              <input
                v-model="passwordInput"
                type="password"
                required
                :disabled="submitting"
                class="w-full px-3 py-1.5 text-xs bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] placeholder-[#526173]/50 focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none font-mono disabled:bg-[#F6F5F0]"
                placeholder="••••••••••••"
              />
            </div>

            <!-- Login Action Buttons -->
            <div class="pt-1.5 flex flex-col sm:flex-row gap-2">
              <AppButton
                type="submit"
                variant="primary"
                size="md"
                customClass="flex-1 justify-center py-2"
                :loading="submitting"
              >
                Sign In to {{ activeRoleTitle }} Dashboard →
              </AppButton>

              <AppButton
                type="button"
                variant="outline"
                size="md"
                @click="quickDemoLogin"
                :disabled="submitting"
                title="Immediately login to selected role"
              >
                Instant Preview
              </AppButton>
            </div>
          </form>

          <!-- Security Assurance Note -->
          <div class="p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-xs text-[#526173] flex items-start gap-2">
            <AppIcon name="shield" :size="13" class="text-[#167D83] mt-0.5 flex-shrink-0" />
            <div class="leading-relaxed">
              <strong class="text-[#182533]">Dual-Control Governance: </strong>
              Each role maintains isolated permissions. Cross-role navigation is guarded by frontend access controls.
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="h-11 border-t border-[#E1E5E8] bg-white px-6 flex items-center justify-between text-xs text-[#526173] font-mono">
      <span>Regulatory Change Intelligence Platform · Enterprise Edition</span>
      <span>4 Role Dashboards · Strict Presentation Layer</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import type { UserRole } from '../../types';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const selectedRole = ref<UserRole>('COMPLIANCE_ANALYST');
const emailInput = ref<string>('maya.sen@compliance.bank.internal');
const passwordInput = ref<string>('SandboxDemo2026!');
const submitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const roleOptions = [
  {
    index: 1,
    role: 'COMPLIANCE_ANALYST' as UserRole,
    title: 'Compliance Analyst',
    personaName: 'Maya Sen',
    email: 'maya.sen@compliance.bank.internal',
    targetRoute: '/dashboard/compliance-analyst',
    description: 'Circular Library & Upload, Document & Obligation Review, Evidence Viewer, Applicability & Policy Mapping.',
  },
  {
    index: 2,
    role: 'RULE_ENGINEER' as UserRole,
    title: 'Rule Engineer / IT Operator',
    personaName: 'Arun Patel',
    email: 'arun.patel@compliance.bank.internal',
    targetRoute: '/dashboard/rule-engineer',
    description: 'Assigned Work, Rule Studio & Version History, Test Lab & Regression, Impact Simulator, Sandbox Deploy.',
  },
  {
    index: 3,
    role: 'COMPLIANCE_APPROVER' as UserRole,
    title: 'Compliance Approver',
    personaName: 'Vikram Mehta',
    email: 'vikram.mehta@compliance.bank.internal',
    targetRoute: '/dashboard/compliance-approver',
    description: 'Approval Center & Queue, Evidence & Risk Review, Rule Version & Test Results, Decision History, Audit Reports.',
  },
  {
    index: 4,
    role: 'PLATFORM_ADMIN' as UserRole,
    title: 'Platform Administrator',
    personaName: 'Elena Rostova',
    email: 'elena.rostova@compliance.bank.internal',
    targetRoute: '/dashboard/platform-admin',
    description: 'System Overview & Telemetry, User & RBAC Management, Integration & Pipeline Health, Security Audit, System Config.',
  },
];

onMounted(async () => {
  await authStore.fetchUsers();
  if (authStore.currentUser && authStore.currentUser.role) {
    selectedRole.value = authStore.currentUser.role;
  }
  syncFormToRole();

  if (route.query.denied) {
    errorMessage.value = `Access to ${route.query.denied} requires appropriate role credentials. Please select the authorized persona below.`;
  }
});

const selectRole = (role: UserRole) => {
  selectedRole.value = role;
  errorMessage.value = '';
  syncFormToRole();
};

const syncFormToRole = () => {
  const opt = roleOptions.find((r) => r.role === selectedRole.value);
  if (opt) {
    emailInput.value = opt.email;
    passwordInput.value = 'SandboxDemo2026!';
  }
};

const activeRoleTitle = computed(() => {
  const opt = roleOptions.find((r) => r.role === selectedRole.value);
  return opt ? opt.title : 'Workspace';
});

const handleLogin = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (!emailInput.value || !passwordInput.value) {
    errorMessage.value = 'Please enter institutional email and password to proceed.';
    return;
  }

  submitting.value = true;
  try {
    await new Promise((resolve) => setTimeout(resolve, 400));
    authStore.switchRole(selectedRole.value);
    successMessage.value = `Access granted! Redirecting to ${activeRoleTitle.value} Dashboard...`;

    const opt = roleOptions.find((r) => r.role === selectedRole.value);
    const destination = opt?.targetRoute || authStore.defaultLandingRoute;

    setTimeout(() => {
      router.push(destination);
    }, 250);
  } catch (err: any) {
    errorMessage.value = err?.message || 'Authentication error. Please re-select a demo persona.';
  } finally {
    setTimeout(() => {
      submitting.value = false;
    }, 400);
  }
};

const quickDemoLogin = () => {
  handleLogin();
};
</script>
