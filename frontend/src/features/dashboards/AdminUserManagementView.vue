<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white border border-[#E1E5E8] rounded-[3px] p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="teal" dot>Platform Administration</AppBadge>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173]">Administrator: <strong class="text-[#182533]">Elena Rostova</strong></span>
        </div>
        <h1 class="text-2xl font-extrabold text-[#182533] tracking-tight">User Account & Role Management</h1>
        <p class="text-xs text-[#526173] mt-0.5">
          Configure authenticated identity accounts, assign authorized roles, and enforce security policies.
        </p>
      </div>
    </div>

    <!-- Security Safeguard Notice -->
    <div class="p-3.5 bg-[#FDF7EB] border border-[#EED7A8] rounded-[3px] flex items-start gap-2.5 text-xs text-[#AD741B]">
      <AppIcon name="alert" :size="16" class="text-[#AD741B] mt-0.5 flex-shrink-0" />
      <div>
        <strong class="font-bold text-[#AD741B]">Administrative Privilege Boundary: </strong>
        <span>Administrative privileges do not grant compliance approval or rule-release permissions. Compliance decisions require formal certification by authorized Compliance Approvers.</span>
      </div>
    </div>

    <!-- User Table -->
    <AppCard title="Platform User Directory" subtitle="Manage personas and active permissions" noPadding>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-xs font-mono">
              <th class="px-5 py-3 font-semibold">User Identity</th>
              <th class="px-4 py-3 font-semibold">Username</th>
              <th class="px-4 py-3 font-semibold">Current Role</th>
              <th class="px-4 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 font-semibold text-right">Modify Role / Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E1E5E8]">
            <tr v-for="u in users" :key="u.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
              <td class="px-5 py-3.5">
                <div class="font-bold text-[#182533] text-xs">{{ u.full_name }}</div>
                <div class="text-xs text-[#526173] font-mono">{{ u.email }}</div>
              </td>
              <td class="px-4 py-3.5 font-mono text-xs text-[#526173]">
                {{ u.username }}
              </td>
              <td class="px-4 py-3.5">
                <AppBadge :variant="u.role === 'PLATFORM_ADMIN' ? 'teal' : u.role === 'COMPLIANCE_APPROVER' ? 'warning' : 'navy'">{{ u.role }}</AppBadge>
              </td>
              <td class="px-4 py-3.5">
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#247653] font-mono">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#247653]"></span>
                  Active
                </span>
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <select
                    :value="u.role"
                    @change="onRoleChange(u.id, ($event.target as HTMLSelectElement).value)"
                    class="text-xs border border-[#E1E5E8] rounded-[3px] px-2.5 py-1 bg-white focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none font-mono"
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
