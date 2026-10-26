<template>
  <DashboardLayout
    roleBadgeText="Platform Administration"
    operatorName="Elena Rostova"
    pageTitle="System Operations & Access Governance Hub"
    pageSubtitle="Oversee enterprise user accounts, enforce role-based access boundaries, monitor processing pipelines, and inspect immutable audit events."
    :metricCards="metricCards"
    :moduleTabs="moduleTabs"
    v-model:activeTab="activeTab"
  >
    <template #header-actions>
      <AppButton variant="primary" size="sm" @click="activeTab = 'module-b'; openAddUserModal()">
        <AppIcon name="user" :size="14" />
        Add Enterprise User
      </AppButton>
      <AppButton variant="outline" size="sm" @click="activeTab = 'module-d'">
        <AppIcon name="audit" :size="14" />
        Security Audit Ledger
      </AppButton>
    </template>

    <!-- ======================================================== -->
    <!-- MODULE A: SYSTEM OVERVIEW                                -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'module-a'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-base font-bold text-[#14263D] uppercase tracking-wider font-mono">Module A: System Operations Telemetry</h2>
            <span class="px-2 py-0.5 rounded-[3px] text-xs font-mono bg-[#247653]/10 text-[#247653] border border-[#247653]/30 font-medium">
              Demo Metrics
            </span>
          </div>
          <p class="text-xs text-[#526173]">Operational health indicators, microservices latency, and active session throughput.</p>
        </div>
        <AppButton variant="outline" size="sm" @click="refreshTelemetry">
          <AppIcon name="refresh" :size="12" />
          Refresh Telemetry
        </AppButton>
      </div>

      <!-- System Health Indicator Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div class="p-3.5 bg-white border border-[#E1E5E8] rounded-[3px] shadow-2xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#526173] uppercase font-mono">FastAPI API Gateway</span>
            <span class="w-2 h-2 rounded-full bg-[#247653]"></span>
          </div>
          <div class="text-lg font-mono font-bold text-[#247653]">14 ms</div>
          <div class="text-xs text-[#526173]">P99 Latency · 0 Errors</div>
        </div>

        <div class="p-3.5 bg-white border border-[#E1E5E8] rounded-[3px] shadow-2xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#526173] uppercase font-mono">SQLite Audit Ledger</span>
            <span class="w-2 h-2 rounded-full bg-[#247653]"></span>
          </div>
          <div class="text-lg font-mono font-bold text-[#14263D]">278 KB</div>
          <div class="text-xs text-[#526173]">WAL Mode Active · 100% Integrity</div>
        </div>

        <div class="p-3.5 bg-white border border-[#E1E5E8] rounded-[3px] shadow-2xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#526173] uppercase font-mono">AST Rule Compiler</span>
            <span class="w-2 h-2 rounded-full bg-[#247653]"></span>
          </div>
          <div class="text-lg font-mono font-bold text-[#167D83]">Sandbox OK</div>
          <div class="text-xs text-[#526173]">Deterministic Evaluator Active</div>
        </div>

        <div class="p-3.5 bg-white border border-[#E1E5E8] rounded-[3px] shadow-2xs space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#526173] uppercase font-mono">Dual-Control Guard</span>
            <span class="w-2 h-2 rounded-full bg-[#247653]"></span>
          </div>
          <div class="text-lg font-mono font-bold text-[#247653]">Strict RBAC</div>
          <div class="text-xs text-[#526173]">Admin Barred from Sign-off</div>
        </div>
      </div>

      <!-- Separation of Duties Governance Card -->
      <AppCard title="RBAC Segregation of Duties Governance" subtitle="Mandatory banking compliance safeguard" compact>
        <div class="p-3.5 bg-[#14263D]/5 border border-[#14263D]/15 rounded-[3px] text-xs space-y-1.5 text-[#182533]">
          <div class="font-semibold text-[#14263D] flex items-center gap-1.5 font-mono">
            <AppIcon name="lock" :size="13" class="text-[#167D83]" />
            <span>Administrative Scope Boundary</span>
          </div>
          <p class="text-xs text-[#526173] leading-relaxed">
            In accordance with dual-control governance standards, users with the <code class="font-mono bg-white px-1 py-0.5 border border-[#E1E5E8] rounded-[3px]">PLATFORM_ADMIN</code> role are strictly prevented from issuing compliance sign-offs or authoring regulatory rule logic. Compliance approvals require independent review by authorized officers holding the <code class="font-mono bg-white px-1 py-0.5 border border-[#E1E5E8] rounded-[3px]">COMPLIANCE_APPROVER</code> role.
          </p>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE B: USER AND PERMISSION MANAGEMENT                 -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-b'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-[#14263D] uppercase tracking-wider font-mono">Module B: User & Permission Management</h2>
          <p class="text-xs text-[#526173]">Manage institutional user profiles, assign enterprise roles, and toggle account activation states.</p>
        </div>
        <AppButton variant="primary" size="sm" @click="openAddUserModal">
          <AppIcon name="plus" :size="13" />
          Add User
        </AppButton>
      </div>

      <!-- Search & Filters -->
      <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <AppIcon name="search" :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#526173]" />
          <input
            v-model="userSearchQuery"
            type="text"
            placeholder="Search users by name, email or role..."
            class="w-full text-xs pl-8 pr-3 py-1.5 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] placeholder-[#526173]/60 focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
          />
        </div>

        <select
          v-model="userRoleFilter"
          class="text-xs bg-white border border-[#E1E5E8] rounded-[3px] px-3 py-1.5 text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
        >
          <option value="">All Roles</option>
          <option value="COMPLIANCE_ANALYST">Compliance Analyst</option>
          <option value="RULE_ENGINEER">Rule Engineer</option>
          <option value="COMPLIANCE_APPROVER">Compliance Approver</option>
          <option value="PLATFORM_ADMIN">Platform Administrator</option>
        </select>
      </div>

      <!-- Users Table -->
      <AppCard noPadding>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-xs font-mono">
                <th class="px-4 py-2.5 font-semibold">User / Persona</th>
                <th class="px-4 py-2.5 font-semibold">Assigned Role</th>
                <th class="px-4 py-2.5 font-semibold">Status</th>
                <th class="px-4 py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E5E8]">
              <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
                <td class="px-4 py-3">
                  <div class="font-semibold text-[#182533]">{{ u.full_name }}</div>
                  <div class="text-xs text-[#526173] font-mono">{{ u.email }}</div>
                </td>
                <td class="px-4 py-3">
                  <AppBadge :variant="u.role === 'PLATFORM_ADMIN' ? 'navy' : u.role === 'COMPLIANCE_APPROVER' ? 'warning' : u.role === 'RULE_ENGINEER' ? 'teal' : 'neutral'">
                    {{ u.role }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1.5 text-xs font-semibold font-mono"
                    :class="u.is_active ? 'text-[#247653]' : 'text-[#B33A42]'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="u.is_active ? 'bg-[#247653]' : 'bg-[#B33A42]'"></span>
                    {{ u.is_active ? 'ACTIVE' : 'DEACTIVATED' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <AppButton variant="outline" size="sm" @click="openEditUserModal(u)">
                      <AppIcon name="edit" :size="12" />
                      Edit Role
                    </AppButton>
                    <AppButton
                      :variant="u.is_active ? 'outline' : 'primary'"
                      size="sm"
                      @click="triggerToggleUser(u)"
                    >
                      {{ u.is_active ? 'Deactivate' : 'Activate' }}
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE C: INTEGRATION AND PROCESSING HEALTH              -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-c'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-[#14263D] uppercase tracking-wider font-mono">Module C: Integrations & Processing Pipeline</h2>
          <p class="text-xs text-[#526173]">Monitor regulatory publishing scrapers, event streaming pipelines, and execution jobs.</p>
        </div>
      </div>

      <!-- Integration Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="int in mockStore.integrations"
          :key="int.id"
          class="p-4 bg-white border border-[#E1E5E8] rounded-[3px] shadow-2xs space-y-2"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-[#182533]">{{ int.name }}</span>
            <AppBadge :variant="int.status === 'HEALTHY' ? 'success' : 'error'">
              {{ int.status }}
            </AppBadge>
          </div>
          <p class="text-xs text-[#526173] leading-relaxed">{{ int.details }}</p>
          <div class="pt-2 border-t border-[#E1E5E8] flex items-center justify-between text-xs font-mono text-[#526173]">
            <span>Latency: <strong class="text-[#182533]">{{ int.latency_ms }}ms</strong></span>
            <span>Uptime: <strong class="text-[#247653]">{{ int.uptime_pct }}%</strong></span>
          </div>
        </div>
      </div>

      <!-- Processing Pipeline Table -->
      <AppCard title="Processing Pipeline Execution Log" subtitle="Recent batch and stream parsing executions" noPadding>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-xs font-mono">
                <th class="px-4 py-2.5 font-semibold">Job ID</th>
                <th class="px-4 py-2.5 font-semibold">Pipeline Name</th>
                <th class="px-4 py-2.5 font-semibold">Target Entity</th>
                <th class="px-4 py-2.5 font-semibold">Status</th>
                <th class="px-4 py-2.5 font-semibold">Duration</th>
                <th class="px-4 py-2.5 font-semibold">Execution Time</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E5E8]">
              <tr v-for="job in mockStore.pipelineJobs" :key="job.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
                <td class="px-4 py-3 font-mono font-bold text-[#14263D]">{{ job.id }}</td>
                <td class="px-4 py-3 font-semibold text-[#182533]">{{ job.pipeline_name }}</td>
                <td class="px-4 py-3 font-mono text-xs text-[#526173]">{{ job.target_entity }}</td>
                <td class="px-4 py-3">
                  <AppBadge :variant="job.status === 'SUCCESS' ? 'success' : 'warning'">
                    {{ job.status }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3 font-mono text-[#526173]">{{ job.duration_sec }}s</td>
                <td class="px-4 py-3 font-mono text-[#526173]">{{ new Date(job.last_execution).toLocaleTimeString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE D: SECURITY AUDIT                                 -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-d'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-[#14263D] uppercase tracking-wider font-mono">Module D: Security & Access Audit Ledger</h2>
          <p class="text-xs text-[#526173]">Tamper-evident record of all platform interactions, approvals, role switches, and AST changes.</p>
        </div>
      </div>

      <!-- Audit Filter Bar -->
      <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px] flex items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <AppIcon name="search" :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#526173]" />
          <input
            v-model="auditSearchQuery"
            type="text"
            placeholder="Search events by type or action..."
            class="w-full text-xs pl-8 pr-3 py-1.5 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] placeholder-[#526173]/60 focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
          />
        </div>
        <span class="text-xs font-mono text-[#526173]">{{ filteredAuditEvents.length }} Events Logged</span>
      </div>

      <!-- Audit Table -->
      <AppCard noPadding>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-xs font-mono">
                <th class="px-4 py-2.5 font-semibold">Event Type</th>
                <th class="px-4 py-2.5 font-semibold">Actor</th>
                <th class="px-4 py-2.5 font-semibold">Action Description</th>
                <th class="px-4 py-2.5 font-semibold">Entity Reference</th>
                <th class="px-4 py-2.5 font-semibold">Timestamp</th>
                <th class="px-4 py-2.5 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E5E8]">
              <tr v-for="ev in filteredAuditEvents" :key="ev.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
                <td class="px-4 py-3 font-mono text-[#14263D] font-bold text-xs">{{ ev.event_type }}</td>
                <td class="px-4 py-3 font-medium text-[#182533]">{{ ev.actor_name }}</td>
                <td class="px-4 py-3 text-[#182533]">{{ ev.action }}</td>
                <td class="px-4 py-3 font-mono text-xs text-[#526173]">{{ ev.entity_id }}</td>
                <td class="px-4 py-3 font-mono text-xs text-[#526173]">{{ new Date(ev.timestamp).toLocaleTimeString() }}</td>
                <td class="px-4 py-3 text-right">
                  <AppButton variant="outline" size="sm" @click="selectedAuditEvent = ev">
                    <AppIcon name="eye" :size="12" />
                    Inspect
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE E: SYSTEM CONFIGURATION                           -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-e'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-base font-bold text-[#14263D] uppercase tracking-wider font-mono">Module E: Platform System Preferences</h2>
          <p class="text-xs text-[#526173]">Adjust simulated operational preferences, audit ledger retention periods, and alert thresholds.</p>
        </div>
        <div class="flex items-center gap-2">
          <AppButton variant="outline" size="sm" @click="openResetConfigModal">
            Reset to Defaults
          </AppButton>
          <AppButton variant="primary" size="sm" @click="saveSystemPreferences">
            <AppIcon name="check" :size="13" />
            Save Preferences
          </AppButton>
        </div>
      </div>

      <div class="bg-white border border-[#E1E5E8] rounded-[3px] p-5 shadow-2xs space-y-4 text-xs">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-[#182533] mb-1 font-mono">Audit Ledger Retention (Days)</label>
            <input
              v-model.number="configForm.audit_retention_days"
              type="number"
              class="w-full p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] font-mono focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
            />
            <span class="text-xs text-[#526173]">Default 2,555 days (7-year statutory banking compliance rule).</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#182533] mb-1 font-mono">Minimum Test Coverage Required (%)</label>
            <input
              v-model.number="configForm.minimum_test_coverage_pct"
              type="number"
              class="w-full p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] font-mono focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
            />
            <span class="text-xs text-[#526173]">Enforces 100% deterministic test coverage before approver queue entry.</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#182533] mb-1 font-mono">Auto-Triage Confidence Threshold (%)</label>
            <input
              v-model.number="configForm.auto_triage_confidence_threshold"
              type="number"
              class="w-full p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] font-mono focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#182533] mb-1 font-mono">Inactive Session Timeout (Minutes)</label>
            <input
              v-model.number="configForm.session_timeout_minutes"
              type="number"
              class="w-full p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] font-mono focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#182533] mb-1 font-mono">Compliance Alert Recipient List</label>
          <input
            v-model="configForm.alert_email_recipients"
            type="text"
            class="w-full p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] font-mono focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
          />
        </div>

        <div v-if="configSaveMessage" class="p-2.5 bg-[#247653]/10 border border-[#247653]/30 rounded-[3px] text-xs text-[#247653] text-center font-medium">
          {{ configSaveMessage }}
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- OVERVIEW TAB (DEFAULT)                                   -->
    <!-- ======================================================== -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-4">
          <AppCard title="Platform User & Access Allocation" subtitle="Current registered enterprise roles" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div v-for="u in mockStore.users.slice(0, 4)" :key="u.id" class="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <div class="font-semibold text-[#182533]">{{ u.full_name }}</div>
                  <div class="text-xs text-[#526173] font-mono">{{ u.email }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <AppBadge :variant="u.role === 'PLATFORM_ADMIN' ? 'navy' : u.role === 'COMPLIANCE_APPROVER' ? 'warning' : 'teal'">{{ u.role }}</AppBadge>
                  <button @click="activeTab = 'module-b'" class="text-[#167D83] hover:text-[#14263D] text-xs font-medium transition-colors">Configure →</button>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <AppCard title="Live Infrastructure Health Stream" subtitle="FastAPI, SQLite, and Pipeline Monitor" noPadding>
            <div class="divide-y divide-[#E1E5E8] text-xs">
              <div v-for="ev in mockStore.auditEvents.slice(0, 4)" :key="ev.id" class="p-3">
                <div class="flex items-center justify-between">
                  <span class="font-mono text-[#14263D] font-bold text-xs">{{ ev.event_type }}</span>
                  <span class="text-xs text-[#526173] font-mono">{{ new Date(ev.timestamp).toLocaleTimeString() }}</span>
                </div>
                <div class="text-[#182533] text-xs mt-0.5">{{ ev.action }}</div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- User Add / Edit Modal -->
    <div v-if="userModalOpen" class="fixed inset-0 z-50 overflow-y-auto bg-[#0B1728]/70 backdrop-blur-2xs flex items-center justify-center p-4">
      <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-xl max-w-md w-full p-5 space-y-4 text-left">
        <div class="flex items-start justify-between">
          <h3 class="text-sm font-bold text-[#14263D]">{{ editingUserId ? 'Edit Enterprise User' : 'Add New Enterprise User' }}</h3>
          <button @click="userModalOpen = false" class="text-[#526173] hover:text-[#14263D]">
            <AppIcon name="close" :size="16" />
          </button>
        </div>

        <form @submit.prevent="saveUserModal" class="space-y-3.5 text-xs">
          <div>
            <label class="block text-xs font-semibold text-[#182533] uppercase mb-1 font-mono">Full Name</label>
            <input v-model="userForm.full_name" type="text" required class="w-full p-2 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#182533] uppercase mb-1 font-mono">Institutional Email</label>
            <input v-model="userForm.email" type="email" required class="w-full p-2 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#182533] uppercase mb-1 font-mono">Assigned Role</label>
            <select v-model="userForm.role" class="w-full p-2 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]">
              <option value="COMPLIANCE_ANALYST">Compliance Analyst</option>
              <option value="RULE_ENGINEER">Rule Engineer / IT Operator</option>
              <option value="COMPLIANCE_APPROVER">Compliance Approver</option>
              <option value="PLATFORM_ADMIN">Platform Administrator</option>
            </select>
          </div>

          <div class="pt-2 flex justify-end gap-2 border-t border-[#E1E5E8]">
            <AppButton variant="outline" size="sm" type="button" @click="userModalOpen = false">Cancel</AppButton>
            <AppButton variant="primary" size="sm" type="submit">Save User</AppButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Audit Event Details Modal -->
    <div v-if="selectedAuditEvent" class="fixed inset-0 z-50 overflow-y-auto bg-[#0B1728]/70 backdrop-blur-2xs flex items-center justify-center p-4">
      <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-xl max-w-lg w-full p-5 space-y-4 text-left">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-xs font-mono text-[#167D83] font-bold uppercase">{{ selectedAuditEvent.event_type }}</span>
            <h3 class="text-sm font-bold text-[#14263D]">{{ selectedAuditEvent.action }}</h3>
          </div>
          <button @click="selectedAuditEvent = null" class="text-[#526173] hover:text-[#14263D]">
            <AppIcon name="close" :size="16" />
          </button>
        </div>

        <div class="p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] font-mono text-xs overflow-x-auto space-y-1">
          <div>Actor: {{ selectedAuditEvent.actor_name }} ({{ selectedAuditEvent.actor_role }})</div>
          <div>Entity: {{ selectedAuditEvent.entity_type }} ({{ selectedAuditEvent.entity_id }})</div>
          <div>Timestamp: {{ selectedAuditEvent.timestamp }}</div>
          <div class="pt-2 text-xs text-[#526173]">Metadata Payload:</div>
          <pre class="text-xs text-[#182533] leading-relaxed">{{ JSON.stringify(selectedAuditEvent.details, null, 2) }}</pre>
        </div>

        <div class="pt-2 flex justify-end">
          <AppButton variant="primary" size="sm" @click="selectedAuditEvent = null">Close Details</AppButton>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Toggle / Reset -->
    <ConfirmModal
      :open="confirmModalOpen"
      :title="confirmTitle"
      :subtitle="confirmSubtitle"
      variant="danger"
      confirmText="Confirm Action"
      @confirm="executeConfirmModal"
      @cancel="confirmModalOpen = false"
    >
      <p class="text-xs text-[#182533] leading-relaxed">{{ confirmMessage }}</p>
    </ConfirmModal>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMockDataStore } from '../../stores/mockDataStore';
import type { User, UserRole, AuditEvent } from '../../types';
import DashboardLayout, { type MetricCardConfig, type ModuleTabConfig } from '../../components/dashboard/DashboardLayout.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';
import ConfirmModal from '../../components/dashboard/ConfirmModal.vue';

const mockStore = useMockDataStore();

const activeTab = ref('overview');
const userSearchQuery = ref('');
const userRoleFilter = ref('');
const auditSearchQuery = ref('');

// User Modal State
const userModalOpen = ref(false);
const editingUserId = ref<string | null>(null);
const userForm = ref({
  full_name: '',
  email: '',
  role: 'COMPLIANCE_ANALYST' as UserRole,
  is_active: true,
});

// Audit Modal State
const selectedAuditEvent = ref<AuditEvent | null>(null);

// System Config Form
const configForm = ref({ ...mockStore.systemConfig });
const configSaveMessage = ref('');

// Confirmation Modal State
const confirmModalOpen = ref(false);
const confirmActionType = ref<'TOGGLE_USER' | 'RESET_CONFIG'>('TOGGLE_USER');
const targetUserToToggle = ref<User | null>(null);
const confirmTitle = ref('');
const confirmSubtitle = ref('');
const confirmMessage = ref('');

const moduleTabs: ModuleTabConfig[] = [
  { id: 'overview', label: 'Telemetry Overview', icon: 'overview' },
  { id: 'module-a', label: 'A. System Overview', icon: 'cpu' },
  { id: 'module-b', label: 'B. User & RBAC Management', icon: 'users', badge: mockStore.users.length },
  { id: 'module-c', label: 'C. Integration & Health', icon: 'activity', badge: '100% OK' },
  { id: 'module-d', label: 'D. Security Audit', icon: 'audit', badge: mockStore.auditEvents.length },
  { id: 'module-e', label: 'E. System Configuration', icon: 'settings' },
];

const metricCards = computed<MetricCardConfig[]>(() => [
  {
    title: 'Registered Users',
    value: `${mockStore.adminMetrics.total_users} Accounts`,
    subtitle: `${mockStore.adminMetrics.active_users} Active (100%)`,
    tag: 'Enterprise RBAC',
  },
  {
    title: 'Infrastructure Telemetry',
    value: mockStore.adminMetrics.system_health,
    subtitle: 'FastAPI & SQLite Online',
    valueClass: 'text-[#247653]',
  },
  {
    title: 'Audit Ledger Stream',
    value: `${mockStore.adminMetrics.audit_events_count} Logged`,
    subtitle: 'Cryptographic Event Hashes',
    valueClass: 'text-[#167D83]',
  },
  {
    title: 'Active Integrations',
    value: `${mockStore.adminMetrics.integrations_online} / 4 Feeds`,
    subtitle: 'RBI, FinCEN & Kafka',
    tag: 'Live Stream',
    tagClass: 'bg-[#247653]/10 text-[#247653]',
  },
]);

const filteredUsers = computed(() => {
  let list = [...mockStore.users];
  if (userSearchQuery.value) {
    const q = userSearchQuery.value.toLowerCase();
    list = list.filter(u => u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }
  if (userRoleFilter.value) {
    list = list.filter(u => u.role === userRoleFilter.value);
  }
  return list;
});

const filteredAuditEvents = computed(() => {
  let list = [...mockStore.auditEvents];
  if (auditSearchQuery.value) {
    const q = auditSearchQuery.value.toLowerCase();
    list = list.filter(e => e.event_type.toLowerCase().includes(q) || e.action.toLowerCase().includes(q) || e.actor_name.toLowerCase().includes(q));
  }
  return list;
});

const refreshTelemetry = () => {
  mockStore.logAudit('Refreshed System Telemetry', 'TELEMETRY', 'system');
};

const openAddUserModal = () => {
  editingUserId.value = null;
  userForm.value = {
    full_name: '',
    email: '',
    role: 'COMPLIANCE_ANALYST',
    is_active: true,
  };
  userModalOpen.value = true;
};

const openEditUserModal = (user: User) => {
  editingUserId.value = user.id;
  userForm.value = {
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
  };
  userModalOpen.value = true;
};

const saveUserModal = () => {
  if (editingUserId.value) {
    mockStore.updateUser(editingUserId.value, userForm.value);
  } else {
    mockStore.addUser({
      username: userForm.value.email.split('@')[0],
      ...userForm.value,
    });
  }
  userModalOpen.value = false;
};

const triggerToggleUser = (user: User) => {
  targetUserToToggle.value = user;
  confirmActionType.value = 'TOGGLE_USER';
  confirmTitle.value = user.is_active ? `Deactivate ${user.full_name}?` : `Reactivate ${user.full_name}?`;
  confirmSubtitle.value = 'Administrative RBAC account lifecycle control';
  confirmMessage.value = `Are you sure you want to ${user.is_active ? 'deactivate' : 'activate'} this user session? This demonstration action will update their authentication status.`;
  confirmModalOpen.value = true;
};

const openResetConfigModal = () => {
  confirmActionType.value = 'RESET_CONFIG';
  confirmTitle.value = 'Reset Platform Configuration?';
  confirmSubtitle.value = 'Restore default enterprise parameters';
  confirmMessage.value = 'This demonstration action resets audit retention, test coverage, and confidence thresholds to system defaults.';
  confirmModalOpen.value = true;
};

const executeConfirmModal = () => {
  if (confirmActionType.value === 'TOGGLE_USER' && targetUserToToggle.value) {
    mockStore.toggleUserStatus(targetUserToToggle.value.id);
  } else if (confirmActionType.value === 'RESET_CONFIG') {
    mockStore.resetSystemConfig();
    configForm.value = { ...mockStore.systemConfig };
  }
  confirmModalOpen.value = false;
};

const saveSystemPreferences = () => {
  mockStore.updateSystemConfig(configForm.value);
  configSaveMessage.value = 'Platform configuration preferences saved to local persistent store.';
  setTimeout(() => {
    configSaveMessage.value = '';
  }, 2500);
};
</script>
