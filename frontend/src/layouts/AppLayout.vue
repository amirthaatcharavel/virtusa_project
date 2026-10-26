<template>
  <div v-if="isFullscreen" class="min-h-screen bg-[#F6F5F0]">
    <router-view />
  </div>
  <div v-else class="min-h-screen flex bg-[#F6F5F0] text-[#182533] font-sans antialiased">
    <!-- Desktop Sidebar: Refined Dark Navy Enterprise Navigation -->
    <aside
      class="w-72 bg-[#0B1728] text-white flex-shrink-0 flex flex-col justify-between border-r border-[#14263D] select-none hidden md:flex z-30"
    >
      <div>
        <!-- Brand & Product Identity -->
        <router-link to="/landing" class="h-16 px-5 flex items-center gap-3 border-b border-[#14263D] bg-[#070E18] hover:bg-[#0B1728] transition-colors">
          <!-- Geometric Architectural Mark -->
          <div class="w-8 h-8 rounded-[4px] bg-[#14263D] border border-[#167D83]/50 flex items-center justify-center text-[#167D83] font-mono font-bold text-sm shadow-inner">
            <svg class="w-4.5 h-4.5 text-[#32B5BC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div class="font-bold text-sm tracking-wider text-slate-100 uppercase leading-snug">Regulatory Change</div>
            <div class="text-xs text-[#32B5BC] font-mono font-medium tracking-wide">Governance Platform</div>
          </div>
        </router-link>

        <!-- Role-Specific Dynamic Navigation Menu -->
        <nav class="p-3.5 space-y-5 overflow-y-auto max-h-[calc(100vh-185px)]">
          <div
            v-for="section in authStore.navigationSections"
            :key="section.title"
          >
            <div class="px-3 mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase font-mono">
              {{ section.title }}
            </div>
            <div class="space-y-1">
              <router-link
                v-for="item in section.items"
                :key="item.path"
                :to="item.path"
                class="flex items-center gap-3 px-3 py-2 rounded-[4px] text-sm transition-colors"
                :class="$route.path === item.path || ($route.path.startsWith(item.path) && item.path !== '/' && !item.path.includes('dashboard'))
                  ? 'bg-[#14263D] text-white font-semibold border-l-3 border-[#167D83]'
                  : 'text-slate-300 hover:bg-[#14263D]/60 hover:text-white font-medium'"
              >
                <AppIcon :name="item.icon" :size="16" class="text-slate-400 group-hover:text-white flex-shrink-0" />
                <span class="flex-1 truncate">{{ item.name }}</span>
                <span v-if="item.badge" class="px-2 py-0.5 rounded-[3px] text-xs font-mono font-semibold bg-[#167D83]/20 text-[#32B5BC] border border-[#167D83]/30">
                  {{ item.badge }}
                </span>
              </router-link>
            </div>
          </div>
        </nav>
      </div>

      <!-- Environment & Active Session Identity Footer -->
      <div class="p-3.5 border-t border-[#14263D] bg-[#070E18] text-xs text-slate-300 space-y-2.5">
        <div class="flex items-center justify-between font-mono text-xs">
          <span class="flex items-center gap-2 text-slate-200 font-semibold">
            <span class="w-2 h-2 rounded-full bg-[#247653]"></span>
            Sandbox Active
          </span>
          <span class="text-[#32B5BC] font-bold">v2.1.0</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400 truncate max-w-[170px]">Role: <strong class="text-slate-200 font-semibold">{{ authStore.roleLabel }}</strong></span>
          <div class="flex items-center gap-2 font-mono text-xs font-semibold">
            <router-link to="/login" class="text-[#32B5BC] hover:underline">Switch</router-link>
            <span class="text-slate-600">·</span>
            <button @click="handleLogout" class="text-[#B33A42] hover:underline">Exit</button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Shell -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Enterprise Header -->
      <header class="h-16 bg-white border-b border-[#E1E5E8] flex items-center justify-between px-6 z-20 shadow-2xs">
        <!-- Breadcrumb / Workflow Stage Indicator -->
        <div class="flex items-center gap-2 text-sm text-[#526173] overflow-x-auto py-1">
          <span class="font-medium text-[#526173]">{{ currentSection }}</span>
          <AppIcon name="chevron-right" :size="13" class="text-[#526173]/50" />
          <span class="text-[#182533] font-bold">{{ currentTitle }}</span>
        </div>

        <!-- Top Right Navigation & Role Switcher -->
        <div class="flex items-center gap-3">
          <router-link
            to="/landing"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-sm font-semibold text-[#526173] hover:text-[#182533] hover:bg-[#F6F5F0] border border-transparent hover:border-[#E1E5E8] transition-colors"
          >
            <span>Landing Page</span>
          </router-link>

          <router-link
            to="/login"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-sm font-semibold text-[#526173] hover:text-[#182533] hover:bg-[#F6F5F0] border border-transparent hover:border-[#E1E5E8] transition-colors"
          >
            <AppIcon name="users" :size="14" />
            <span>Switch Portal</span>
          </router-link>

          <!-- Supabase Connection Button & Status Indicator -->
          <button
            @click="showSupabaseModal = true"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-mono font-semibold transition-all border"
            :class="hasSupabase
              ? 'bg-[#00C58E]/10 text-[#00C58E] border-[#00C58E]/30 hover:bg-[#00C58E]/20'
              : 'bg-[#F6F5F0] text-[#526173] border-[#E1E5E8] hover:bg-white hover:text-[#182533]'"
            title="Configure Supabase Live Database & Storage"
          >
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.32 14.152a.396.396 0 0 0 .31.637H12v8.811a.396.396 0 0 0 .716.234l10.963-13.84a.396.396 0 0 0-.317-.64z" />
            </svg>
            <span>Supabase</span>
            <span class="w-1.5 h-1.5 rounded-full" :class="hasSupabase ? 'bg-[#00C58E] animate-pulse' : 'bg-[#AD741B]'"></span>
          </button>

          <!-- User Profile & Role Selector -->
          <div class="flex items-center gap-2.5 bg-[#F6F5F0] px-3 py-1.5 rounded-[4px] border border-[#E1E5E8]">
            <div class="w-7 h-7 rounded-[3px] bg-[#14263D] text-white flex items-center justify-center text-xs font-mono font-bold">
              {{ authStore.currentUser.full_name.split(' ').map((n: string) => n[0]).join('') }}
            </div>
            <div class="text-right hidden sm:block">
              <div class="text-sm font-bold text-[#182533] leading-tight">{{ authStore.currentUser.full_name }}</div>
              <div class="text-xs text-[#526173] font-mono leading-tight">{{ authStore.roleLabel }}</div>
            </div>
            
            <select
              :value="authStore.currentUser.id"
              @change="onUserChange"
              class="ml-1 text-sm bg-white border border-[#E1E5E8] rounded-[4px] px-2.5 py-1 text-[#182533] font-semibold focus:ring-1 focus:ring-[#167D83] focus:outline-none"
              title="Switch role for demonstration"
            >
              <option value="usr-analyst-01">Maya Sen (Compliance Analyst)</option>
              <option value="usr-engineer-01">Arun Patel (Rule Engineer)</option>
              <option value="usr-approver-01">Vikram Mehta (Compliance Approver)</option>
              <option value="usr-admin-01">Elena Rostova (Platform Administrator)</option>
            </select>

            <!-- Explicit Log Out Button -->
            <button
              @click="handleLogout"
              class="ml-1 p-1.5 text-[#526173] hover:text-[#B33A42] rounded-[3px] hover:bg-white transition-colors"
              title="Log out of session"
            >
              <AppIcon name="logout" :size="15" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main Scrollable Page Canvas -->
      <main class="flex-1 overflow-y-auto p-5 md:p-7 bg-[#F6F5F0]">
        <div class="max-w-7xl mx-auto space-y-6">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Interactive Supabase Configuration Modal -->
    <SupabaseConnectModal
      :open="showSupabaseModal"
      @close="showSupabaseModal = false"
      @connected="onSupabaseConnected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AppIcon from '../components/icons/AppIcon.vue';
import SupabaseConnectModal from '../components/common/SupabaseConnectModal.vue';
import { isSupabaseConfigured } from '../services/supabase';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const isFullscreen = computed(() => route.meta.fullscreen === true);
const showSupabaseModal = ref(false);
const hasSupabase = ref(false);

const checkSupabase = () => {
  hasSupabase.value = isSupabaseConfigured();
};

const onSupabaseConnected = () => {
  checkSupabase();
  authStore.fetchUsers();
};

onMounted(async () => {
  checkSupabase();
  await authStore.fetchUsers();
});

const onUserChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  authStore.switchUser(target.value);
  router.push(authStore.defaultLandingRoute);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

const currentSection = computed(() => {
  const p = route.path;
  if (p.includes('analyst') || p.startsWith('/circulars') || p.startsWith('/obligations')) return 'Compliance Analyst';
  if (p.includes('engineer') || p.startsWith('/rules') || p.startsWith('/tests') || p.startsWith('/impact') || p.startsWith('/deployments')) return 'Rule Engineering';
  if (p.includes('approver') || p.startsWith('/approvals')) return 'Compliance Governance';
  if (p.includes('admin')) return 'Platform Administration';
  return 'Regulatory Change Intelligence';
});

const currentTitle = computed(() => {
  const p = route.path;
  if (p === '/dashboard/compliance-analyst' || p === '/analyst/dashboard') return 'Compliance Analyst Dashboard';
  if (p === '/dashboard/rule-engineer' || p === '/engineer/dashboard') return 'Rule Engineering Dashboard';
  if (p === '/dashboard/compliance-approver' || p === '/approver/dashboard') return 'Compliance Approver Dashboard';
  if (p === '/dashboard/platform-admin' || p === '/admin/dashboard') return 'Platform Administrator Dashboard';
  if (p.startsWith('/circulars')) return 'Regulatory Circulars';
  if (p.startsWith('/obligations')) return 'Obligation Review';
  if (p.startsWith('/mapping') || p.startsWith('/policy-mapping')) return 'Policy Mapping';
  if (p.startsWith('/rules')) return 'Rule Studio DSL';
  if (p.startsWith('/tests')) return 'Test Execution Lab';
  if (p.startsWith('/impact') || p.startsWith('/simulation')) return 'Impact Simulator';
  if (p.startsWith('/approvals')) return 'Approval Center';
  if (p.startsWith('/deployments')) return 'Sandbox Deployment Monitor';
  if (p.startsWith('/audit')) return 'Version History & Audit';
  if (p.startsWith('/admin')) return 'Administration & Users';
  return 'Workbench';
});
</script>
