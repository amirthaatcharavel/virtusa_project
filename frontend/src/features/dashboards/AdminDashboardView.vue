<template>
  <div class="space-y-6">
    <!-- Purpose-Built Administrative Header -->
    <div class="bg-white border border-border rounded-lg p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <AppBadge variant="purple">Platform Administration</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary font-mono">System Administrator: Elena Rostova</span>
        </div>
        <h1 class="text-lg font-bold text-text-primary tracking-tight">
          System Operations & Access Governance Hub
        </h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Oversee enterprise user accounts, enforce role-based access boundaries, monitor processing pipelines, and inspect immutable audit events.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <router-link to="/admin/users">
          <AppButton variant="primary" size="sm">
            <AppIcon name="user" :size="14" />
            Manage Users & RBAC
          </AppButton>
        </router-link>
        <router-link to="/audit">
          <AppButton variant="outline" size="sm">
            <AppIcon name="file-text" :size="14" />
            Audit Ledger
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Operational Status Ribbon -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#647789]">Registered Accounts</div>
        <div class="text-sm font-bold text-[#172B3A] mt-1 font-mono">{{ metrics.total_users || 4 }} Users (100% Active)</div>
        <div class="text-[11px] text-[#647789] mt-0.5">4 enterprise roles configured</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#16845B]">Infrastructure Health</div>
        <div class="text-sm font-bold text-[#16845B] mt-1 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
          Operational
        </div>
        <div class="text-[11px] text-[#647789] mt-0.5">FastAPI · SQLite · AST Engine</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-purple-700">Security Audit Events</div>
        <div class="text-sm font-bold text-purple-900 mt-1 font-mono">{{ metrics.total_audit_events || 16 }} Logged</div>
        <div class="text-[11px] text-[#647789] mt-0.5">Cryptographic event hashes</div>
      </div>

      <div class="bg-white border border-[#D8E3EC] rounded-lg p-3.5">
        <div class="text-[10px] uppercase font-bold tracking-wider text-[#647789]">Separation of Duties</div>
        <div class="text-sm font-bold text-[#172B3A] mt-1 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
          Enforced
        </div>
        <div class="text-[11px] text-[#647789] mt-0.5">Admin barred from sign-offs</div>
      </div>
    </div>

    <!-- Administrative Workspace: Functional User Tables & Event Logs -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: User Directory & RBAC Assignment Table -->
      <div class="lg:col-span-7 space-y-4">
        <AppCard title="Enterprise User & Access Directory" subtitle="Current role allocations and authentication status" noPadding>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[#F1F6FA] text-[#647789] border-b border-[#D8E3EC] uppercase tracking-wider text-[10px]">
                  <th class="px-4 py-3 font-semibold">User / Persona</th>
                  <th class="px-4 py-3 font-semibold">Assigned Role</th>
                  <th class="px-4 py-3 font-semibold">Status</th>
                  <th class="px-4 py-3 font-semibold text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#D8E3EC]">
                <tr v-for="u in users" :key="u.id" class="hover:bg-[#F1F6FA] transition-colors">
                  <td class="px-4 py-3">
                    <div class="font-medium text-[#172B3A]">{{ u.full_name }}</div>
                    <div class="text-[11px] text-[#647789] font-mono">{{ u.email }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <AppBadge :variant="u.role === 'PLATFORM_ADMIN' ? 'purple' : u.role === 'COMPLIANCE_APPROVER' ? 'warning' : 'navy'">
                      {{ u.role }}
                    </AppBadge>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16845B]">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
                      ACTIVE
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <router-link to="/admin/users">
                      <AppButton variant="secondary" size="sm">
                        Configure
                      </AppButton>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </AppCard>

        <!-- Governance Safeguards Notice -->
        <AppCard title="RBAC Segregation Policy" subtitle="Active security boundary controls" compact>
          <div class="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-2 text-slate-700">
            <div class="font-semibold text-slate-900 flex items-center gap-1.5">
              <AppIcon name="lock" :size="13" class="text-purple-600" />
              <span>Administrative Scope Limitations</span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">
              In accordance with banking regulatory governance standards, users with the <code>PLATFORM_ADMIN</code> role are strictly prevented from issuing compliance sign-offs or authoring regulatory rule logic. Compliance approvals require independent review by authorized officers holding the <code>COMPLIANCE_APPROVER</code> role.
            </p>
          </div>
        </AppCard>
      </div>

      <!-- Right Column: Live Security & Infrastructure Event Stream -->
      <div class="lg:col-span-5 space-y-4">
        <AppCard title="System Audit Stream" subtitle="Recent governance and security actions" noPadding>
          <div class="divide-y divide-[#D8E3EC] text-xs">
            <div
              v-for="ev in recentEvents"
              :key="ev.id"
              class="p-3.5 hover:bg-[#F1F6FA] transition-colors"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-purple-900 font-bold text-[11px]">{{ ev.event_type }}</span>
                <span class="text-[10px] text-[#647789] font-mono">{{ new Date(ev.timestamp).toLocaleTimeString() }}</span>
              </div>
              <div class="text-[#172B3A] text-xs mt-1">{{ ev.action }}</div>
              <div class="text-[10px] text-[#647789] mt-1 flex items-center justify-between font-mono">
                <span>Actor: {{ ev.actor_id }}</span>
                <span>Entity: {{ ev.entity_id }}</span>
              </div>
            </div>
          </div>

          <div class="p-3.5 bg-[#F1F6FA] border-t border-[#D8E3EC] flex items-center justify-between">
            <span class="text-xs text-[#647789] font-mono">16 Events Logged</span>
            <router-link to="/audit">
              <AppButton variant="secondary" size="sm">
                View Complete Ledger →
              </AppButton>
            </router-link>
          </div>
        </AppCard>

        <!-- System Architecture Environment Card -->
        <AppCard title="Environment & Runtime" compact>
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Runtime:</span>
              <span class="font-mono font-medium text-slate-800">Python 3.11.9 / FastAPI</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Database Engine:</span>
              <span class="font-mono font-medium text-slate-800">SQLite (ACID Compliant)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">AST Evaluator:</span>
              <span class="font-mono font-medium text-purple-900">Pure Functional (Safe)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-600">Sandbox Environment:</span>
              <span class="font-mono font-medium text-emerald-700">Isolated Demo Active</span>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '../../services/api';
import type { User, AuditEvent } from '../../types';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const metrics = ref<Record<string, any>>({});
const users = ref<User[]>([]);
const recentEvents = ref<AuditEvent[]>([]);

onMounted(async () => {
  try {
    const [mRes, uRes, aRes] = await Promise.all([
      apiService.getRoleDashboardMetrics(),
      apiService.getUsers(),
      apiService.getAuditEvents(undefined, undefined, 5),
    ]);
    metrics.value = mRes.metrics || {};
    users.value = uRes || [];
    recentEvents.value = aRes || [];
  } catch (err) {
    console.error('Failed loading admin dashboard:', err);
  }
});
</script>
