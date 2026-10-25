<template>
  <div v-if="isFullscreen" class="min-h-screen bg-[#F1F6FA]">
    <router-view />
  </div>
  <div v-else class="min-h-screen flex bg-[#F1F6FA] text-[#172B3A] font-sans antialiased">
    <!-- Desktop Sidebar: Midnight Navy Enterprise Navigation -->
    <aside
      class="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col justify-between border-r border-slate-800 select-none hidden md:flex z-30"
    >
      <div>
        <!-- Brand & Product Identity -->
        <router-link to="/landing" class="h-16 px-5 flex items-center gap-3 border-b border-slate-800 bg-slate-950 hover:bg-slate-900 transition-colors">
          <!-- Geometric Architectural Mark -->
          <div class="w-8 h-8 rounded bg-purple-900/60 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-xs tracking-wider shadow-inner">
            <svg class="w-4 h-4 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div class="font-semibold text-xs tracking-wider text-slate-100 uppercase leading-tight">Regulatory Change</div>
            <div class="text-[10px] text-purple-300/90 font-medium tracking-wide">Intelligence Platform</div>
          </div>
        </router-link>

        <!-- Role-Specific Dynamic Navigation Menu -->
        <nav class="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          <div
            v-for="section in authStore.navigationSections"
            :key="section.title"
          >
            <div class="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {{ section.title }}
            </div>
            <div class="space-y-0.5">
              <router-link
                v-for="item in section.items"
                :key="item.path"
                :to="item.path"
                class="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors"
                :class="$route.path === item.path || ($route.path.startsWith(item.path) && item.path !== '/' && !item.path.includes('dashboard')) ? 'bg-purple-600 text-white font-medium shadow-xs' : 'text-slate-300 hover:bg-slate-800 hover:text-white font-normal'"
              >
                <AppIcon :name="item.icon" :size="15" />
                <span class="flex-1 truncate">{{ item.name }}</span>
                <span v-if="item.badge" class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800/80">
                  {{ item.badge }}
                </span>
              </router-link>
            </div>
          </div>
        </nav>
      </div>

      <!-- Environment & Active Session Identity Footer -->
      <div class="p-3.5 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-400 space-y-2">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5 font-medium text-slate-300">
            <span class="w-2 h-2 rounded-full bg-[#16845B]"></span>
            Demo Sandbox Active
          </span>
          <span class="font-mono text-[10px] text-purple-300">v1.0.0</span>
        </div>
        <div class="flex items-center justify-between text-[10px]">
          <span class="text-slate-400">Persona: <strong class="text-slate-200">{{ authStore.roleLabel }}</strong></span>
          <router-link to="/login" class="text-purple-400 hover:text-purple-300 underline font-medium">Switch</router-link>
        </div>
      </div>
    </aside>

    <!-- Main Content Shell -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Enterprise Header -->
      <header class="h-16 bg-white border-b border-[#D8E3EC] flex items-center justify-between px-6 z-20 shadow-2xs">
        <!-- Breadcrumb / Workflow Stage Indicator -->
        <div class="flex items-center gap-2 text-xs text-[#647789] overflow-x-auto py-1">
          <span class="font-medium text-[#647789]">{{ currentSection }}</span>
          <AppIcon name="chevron-right" :size="12" class="text-[#647789]/50" />
          <span class="text-purple-900 font-semibold">{{ currentTitle }}</span>
        </div>

        <!-- Top Right Navigation & Role Switcher -->
        <div class="flex items-center gap-3">
          <router-link
            to="/landing"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#647789] hover:text-[#172B3A] hover:bg-[#F1F6FA] border border-transparent hover:border-[#D8E3EC] transition-colors"
          >
            <span>Landing Page</span>
          </router-link>

          <router-link
            to="/login"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-[#647789] hover:text-[#172B3A] hover:bg-[#F1F6FA] border border-transparent hover:border-[#D8E3EC] transition-colors"
          >
            <AppIcon name="users" :size="13" />
            <span>Sign In / Switch Portal</span>
          </router-link>

          <!-- User Profile & Role Selector -->
          <div class="flex items-center gap-2.5 bg-[#F1F6FA] px-3 py-1.5 rounded-lg border border-[#D8E3EC]">
            <div class="w-6 h-6 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800 text-[11px] font-bold">
              {{ authStore.currentUser.full_name.split(' ').map((n: string) => n[0]).join('') }}
            </div>
            <div class="text-right hidden sm:block">
              <div class="text-xs font-semibold text-[#172B3A] leading-tight">{{ authStore.currentUser.full_name }}</div>
              <div class="text-[10px] text-[#647789] leading-tight">{{ authStore.roleLabel }}</div>
            </div>
            
            <select
              :value="authStore.currentUser.id"
              @change="onUserChange"
              class="ml-2 text-xs bg-white border border-[#D8E3EC] rounded px-2.5 py-1 text-[#172B3A] font-medium focus:ring-1 focus:ring-purple-600 focus:outline-none"
              title="Switch role for demonstration"
            >
              <option value="usr-analyst-01">Maya Sen (Compliance Analyst)</option>
              <option value="usr-engineer-01">Arun Patel (Rule Engineer)</option>
              <option value="usr-approver-01">Vikram Mehta (Compliance Approver)</option>
              <option value="usr-admin-01">Elena Rostova (Platform Administrator)</option>
            </select>
          </div>
        </div>
      </header>

      <!-- Main Scrollable Page Canvas -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8 bg-[#F1F6FA]">
        <div class="max-w-7xl mx-auto space-y-6">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AppIcon from '../components/icons/AppIcon.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isFullscreen = computed(() => route.meta.fullscreen === true);

onMounted(async () => {
  await authStore.fetchUsers();
});

const onUserChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  authStore.switchUser(target.value);
  // Seamlessly navigate to the newly selected role's designated landing page
  router.push(authStore.defaultLandingRoute);
};

const currentSection = computed(() => {
  const p = route.path;
  if (p.startsWith('/analyst') || p.startsWith('/circulars')) return 'Analyst Workspace';
  if (p.startsWith('/engineer') || p.startsWith('/rules') || p.startsWith('/tests') || p.startsWith('/impact')) return 'Engineering Workspace';
  if (p.startsWith('/approver') || p.startsWith('/approvals')) return 'Governance & Approvals';
  if (p.startsWith('/admin')) return 'Platform Administration';
  return 'Regulatory Change Intelligence';
});

const currentTitle = computed(() => {
  const p = route.path;
  if (p === '/analyst/dashboard') return 'Compliance Analyst Dashboard';
  if (p === '/engineer/dashboard') return 'Rule Engineering Dashboard';
  if (p === '/approver/dashboard') return 'Compliance Approver Dashboard';
  if (p === '/admin/dashboard') return 'Platform Administrator Dashboard';
  if (p.startsWith('/circulars')) return 'Regulatory Circulars';
  if (p.startsWith('/obligations')) return 'Obligation Review';
  if (p.startsWith('/policy-mapping')) return 'Policy Mapping';
  if (p.startsWith('/rules')) return 'Rule Studio DSL';
  if (p.startsWith('/tests')) return 'Test Execution';
  if (p.startsWith('/impact') || p.startsWith('/simulation')) return 'Impact Simulator';
  if (p.startsWith('/approvals')) return 'Approval Center';
  if (p.startsWith('/deployments')) return 'Sandbox Deployment Monitor';
  if (p.startsWith('/audit')) return 'Version History & Audit';
  if (p.startsWith('/admin')) return 'Administration & Users';
  return 'Regulatory Change Intelligence';
});
</script>
