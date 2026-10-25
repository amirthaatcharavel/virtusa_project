<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-border rounded-lg p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="purple" dot>Platform Administration</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary">Administrator: <strong class="text-purple-900">Elena Rostova</strong></span>
        </div>
        <h1 class="text-lg font-bold text-text-primary tracking-tight">User Account & Role Management</h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Configure authenticated identity accounts, assign authorized roles, and enforce security policies.
        </p>
      </div>
    </div>

    <!-- Security Safeguard Notice -->
    <div class="p-3.5 bg-amber-50/80 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
      <AppIcon name="alert" :size="16" class="text-amber-600 mt-0.5 flex-shrink-0" />
      <div>
        <strong class="font-bold text-amber-950">Administrative Privilege Boundary: </strong>
        <span>Administrative privileges do not grant compliance approval or rule-release permissions. Compliance decisions require formal certification by authorized Compliance Approvers.</span>
      </div>
    </div>

    <!-- User Table -->
    <AppCard title="Platform User Directory" subtitle="Manage personas and active permissions" noPadding>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-surface-subtle text-text-secondary border-b border-border uppercase tracking-wider text-[10px]">
              <th class="px-5 py-3 font-semibold">User Identity</th>
              <th class="px-4 py-3 font-semibold">Username</th>
              <th class="px-4 py-3 font-semibold">Current Role</th>
              <th class="px-4 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 font-semibold text-right">Modify Role / Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-5 py-3.5">
                <div class="font-bold text-text-primary text-xs">{{ u.full_name }}</div>
                <div class="text-[11px] text-text-secondary font-mono">{{ u.email }}</div>
              </td>
              <td class="px-4 py-3.5 font-mono text-[11px] text-text-secondary">
                {{ u.username }}
              </td>
              <td class="px-4 py-3.5">
                <AppBadge :variant="u.role === 'PLATFORM_ADMIN' ? 'purple' : u.role === 'COMPLIANCE_APPROVER' ? 'warning' : 'navy'">{{ u.role }}</AppBadge>
              </td>
              <td class="px-4 py-3.5">
                <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <select
                    :value="u.role"
                    @change="onRoleChange(u.id, ($event.target as HTMLSelectElement).value)"
                    class="text-xs border border-border rounded px-2.5 py-1 bg-white focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="COMPLIANCE_ANALYST">COMPLIANCE_ANALYST</option>
                    <option value="RULE_ENGINEER">RULE_ENGINEER</option>
                    <option value="COMPLIANCE_APPROVER">COMPLIANCE_APPROVER</option>
                    <option value="PLATFORM_ADMIN">PLATFORM_ADMIN</option>
                  </select>
                </div>
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
import { apiService } from '../../services/api';
import type { User } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const users = ref<User[]>([]);

onMounted(async () => {
  try {
    users.value = await apiService.getUsers();
  } catch (err) {
    console.error('Failed loading users', err);
  }
});

const onRoleChange = async (userId: string, newRole: string) => {
  try {
    await apiService.updateUserRole(userId, newRole);
    const u = users.value.find(user => user.id === userId);
    if (u) (u as any).role = newRole;
  } catch (err) {
    console.error('Failed updating role', err);
  }
};
</script>
