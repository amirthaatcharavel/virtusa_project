<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="teal" dot>Platform Administration</AppBadge>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173]">System Observability & Configuration</span>
        </div>
        <h1 class="text-xl font-bold text-[#182533] tracking-tight">System Health & Operational Status</h1>
        <p class="text-xs text-[#526173] mt-0.5">
          Real-time service health, database connectivity, and transparent AI provider adapter configuration.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <AppButton variant="secondary" size="sm" @click="checkHealth" :loading="checking">
          <AppIcon name="audit" :size="14" />
          Refresh Health Status
        </AppButton>
      </div>
    </div>

    <!-- Health Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#526173] font-mono">Core Backend API</div>
        <div class="text-sm font-semibold text-[#247653] mt-1 flex items-center gap-1.5 font-mono">
          <span class="w-2 h-2 rounded-full bg-[#247653] animate-pulse"></span>
          Operational (FastAPI)
        </div>
        <div class="text-[10px] text-[#526173] mt-0.5 font-mono">Port 8000 · Python 3.11</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#526173] font-mono">Database Engine</div>
        <div class="text-sm font-semibold text-[#167D83] mt-1 flex items-center gap-1.5 font-mono">
          <span class="w-2 h-2 rounded-full bg-[#167D83]"></span>
          SQLAlchemy 2.0 (Active)
        </div>
        <div class="text-[10px] text-[#526173] mt-0.5 font-mono">SQLite (Zero-setup Dev)</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#526173] font-mono">AI Provider Mode</div>
        <div class="text-sm font-semibold text-[#AD741B] mt-1 flex items-center gap-1.5 font-mono">
          <span class="w-2 h-2 rounded-full bg-[#AD741B]"></span>
          Deterministic Fallback
        </div>
        <div class="text-[10px] text-[#AD741B] mt-0.5 font-mono">Transparent Offline Extraction</div>
      </AppCard>

      <AppCard compact>
        <div class="text-[11px] uppercase font-bold text-[#526173] font-mono">Deterministic Rule Engine</div>
        <div class="text-sm font-semibold text-[#247653] mt-1 flex items-center gap-1.5 font-mono">
          <span class="w-2 h-2 rounded-full bg-[#247653]"></span>
          Safe JSON AST Evaluator
        </div>
        <div class="text-[10px] text-[#247653] mt-0.5 font-mono">Zero eval/exec · Tested</div>
      </AppCard>
    </div>

    <!-- Platform Users Directory & Role Assignments -->
    <AppCard title="Demo Users & Role Assignments" subtitle="Authorized roles conforming to Section 1.3">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-[10px] font-mono">
              <th class="px-5 py-3 font-semibold">User</th>
              <th class="px-4 py-3 font-semibold">Assigned Role</th>
              <th class="px-4 py-3 font-semibold">Permitted Responsibilities</th>
              <th class="px-4 py-3 font-semibold">Governance Restrictions</th>
              <th class="px-5 py-3 font-semibold text-right">Switch Role</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E1E5E8]">
            <tr v-for="u in users" :key="u.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
              <td class="px-5 py-3.5">
                <div class="font-bold text-[#182533]">{{ u.full_name }}</div>
                <div class="text-[11px] text-[#526173] font-mono">{{ u.email }}</div>
              </td>
              <td class="px-4 py-3.5">
                <AppBadge variant="teal">{{ u.role }}</AppBadge>
              </td>
              <td class="px-4 py-3.5 text-[#526173] text-[11px] max-w-xs">
                {{ getRoleResponsibilities(u.role) }}
              </td>
              <td class="px-4 py-3.5 text-[#B33A42] text-[11px] max-w-xs font-mono font-medium">
                {{ getRoleRestrictions(u.role) }}
              </td>
              <td class="px-5 py-3.5 text-right">
                <AppButton
                  v-if="authStore.currentUser.id !== u.id"
                  variant="outline"
                  size="sm"
                  @click="authStore.switchUser(u.id)"
                >
                  Assume Role
                </AppButton>
                <span v-else class="text-xs font-bold text-[#167D83] font-mono">Active Session</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { User } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const authStore = useAuthStore();
const users = ref<User[]>([]);
const checking = ref(false);

onMounted(async () => {
  try {
    const list = await apiService.getUsers();
    users.value = list;
  } catch (err) {
    console.error('Failed loading users', err);
  }
});

const checkHealth = async () => {
  try {
    checking.value = true;
    await apiService.getHealth();
  } catch (err) {
    console.error('Health check failed', err);
  } finally {
    checking.value = false;
  }
};

const getRoleResponsibilities = (role: string) => {
  switch (role) {
    case 'COMPLIANCE_ANALYST':
      return 'Upload circulars, review document extraction status, inspect source citations, determine applicability, confirm policy mappings.';
    case 'COMPLIANCE_APPROVER':
      return 'Review candidate rules, inspect regression test evidence and impact analysis, certify formal dual-control approval.';
    case 'RULE_ENGINEER':
      return 'Author restricted JSON rule DSL, run deterministic test suite, inspect differential impact, execute sandbox deployment & rollback.';
    case 'PLATFORM_ADMIN':
      return 'Review platform health, monitor background tasks, inspect system status without bypassing business approvals.';
    default:
      return 'Standard enterprise access.';
  }
};

const getRoleRestrictions = (role: string) => {
  switch (role) {
    case 'COMPLIANCE_ANALYST':
      return 'Must not approve own high-impact rule changes or perform unauthorized release operations.';
    case 'COMPLIANCE_APPROVER':
      return 'Cannot approve unverified or failing rule versions; cannot approve self-authored rules.';
    case 'RULE_ENGINEER':
      return 'Must not bypass required approvals; cannot activate unapproved rule versions in sandbox.';
    case 'PLATFORM_ADMIN':
      return 'Administrative privileges do not grant business approval permissions.';
    default:
      return 'Restricted by role.';
  }
};
</script>
