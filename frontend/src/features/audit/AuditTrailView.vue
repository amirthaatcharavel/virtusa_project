<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="purple" dot>Enterprise Audit Log</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary">Source-to-Rule Provenance Evidence</span>
        </div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Version History, Audit Trail & Evidence Dossier</h1>
        <p class="text-xs text-text-secondary mt-0.5">
          End-to-end immutable record of every document parse, obligation review, rule validation, test run, approval, and release.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <AppButton variant="primary" size="md" @click="openEvidenceModal">
          <AppIcon name="file-text" :size="15" />
          Assemble Evidence Dossier
        </AppButton>
      </div>
    </div>

    <!-- Filter Bar -->
    <AppCard noPadding>
      <div class="p-4 bg-surface-muted border-b border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <span class="font-semibold text-text-primary">Filter Event Type:</span>
          <select
            v-model="selectedEventType"
            @change="filterAuditEvents"
            class="bg-white border border-border rounded px-3 py-1.5 focus:ring-1 focus:ring-purple-600"
          >
            <option value="">All Audit Events</option>
            <option value="CIRCULAR_INGESTION">Circular Ingestion</option>
            <option value="OBLIGATION_REVIEWED">Obligation Review</option>
            <option value="POLICY_MAPPED">Policy Mapping</option>
            <option value="RULE_VERSION_DRAFTED">Rule Versioning</option>
            <option value="TEST_SUITE_RUN">Test Suite Execution</option>
            <option value="IMPACT_SIMULATED">Impact Simulation</option>
            <option value="APPROVAL_DECISION">Approval Decision</option>
            <option value="SANDBOX_DEPLOYED">Sandbox Release</option>
            <option value="SANDBOX_ROLLED_BACK">Sandbox Rollback</option>
          </select>
        </div>

        <div class="text-text-secondary">
          Showing <strong>{{ filteredEvents.length }}</strong> verifiable lifecycle events
        </div>
      </div>

      <!-- Audit Timeline Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-surface-subtle text-text-secondary border-b border-border uppercase tracking-wider text-[10px]">
              <th class="px-5 py-3 font-semibold">Timestamp</th>
              <th class="px-4 py-3 font-semibold">Event Classification</th>
              <th class="px-4 py-3 font-semibold">Actor / Role</th>
              <th class="px-4 py-3 font-semibold">Target Entity</th>
              <th class="px-5 py-3 font-semibold">Action & Operational Details</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="loading" class="text-center">
              <td colspan="5" class="py-8 text-text-secondary">Loading audit events...</td>
            </tr>
            <tr v-else-if="filteredEvents.length === 0" class="text-center">
              <td colspan="5" class="py-8 text-text-secondary">No audit events found.</td>
            </tr>
            <tr
              v-for="ev in filteredEvents"
              :key="ev.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-5 py-3.5 font-mono text-[11px] text-text-secondary whitespace-nowrap">
                {{ new Date(ev.timestamp).toLocaleString() }}
              </td>
              <td class="px-4 py-3.5">
                <AppBadge :variant="getEventBadgeVariant(ev.event_type)">
                  {{ ev.event_type }}
                </AppBadge>
              </td>
              <td class="px-4 py-3.5">
                <div class="font-semibold text-text-primary text-xs">{{ ev.actor_name }}</div>
                <div class="text-[10px] text-text-secondary">{{ ev.actor_role }}</div>
              </td>
              <td class="px-4 py-3.5 font-mono text-[11px] text-purple-900">
                <span class="font-bold">{{ ev.entity_type }}:</span> {{ ev.entity_id.substring(0, 10) }}...
              </td>
              <td class="px-5 py-3.5 text-xs text-text-primary">
                <div class="font-medium">{{ ev.action }}</div>
                <div v-if="ev.details && Object.keys(ev.details).length > 0" class="mt-1 font-mono text-[10px] text-slate-500 bg-slate-100/70 p-1.5 rounded line-clamp-2">
                  {{ JSON.stringify(ev.details) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <!-- Evidence Dossier Modal -->
    <div
      v-if="showEvidenceModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden border border-border">
        <div class="px-6 py-4 border-b border-border bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold flex items-center gap-2">
              <AppIcon name="file-text" :size="16" class="text-purple-300" />
              Regulatory Change Evidence Dossier
            </h3>
            <p class="text-xs text-purple-200">Verifiable regulatory-to-rule traceability chain</p>
          </div>
          <button @click="showEvidenceModal = false" class="text-purple-300 hover:text-white">
            <AppIcon name="close" :size="18" />
          </button>
        </div>

        <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          <!-- Step 1: Regulatory Source -->
          <div class="p-3.5 bg-surface-muted rounded-lg border border-border space-y-1.5">
            <div class="flex items-center justify-between font-bold text-purple-900">
              <span>1. Regulatory Source Document</span>
              <span class="font-mono text-[11px]">RBI/2026-27/84</span>
            </div>
            <div class="text-text-primary">Reserve Bank of India: Regulatory Measures on Consumer Credit & Risk Weights</div>
            <div class="text-[11px] text-text-secondary">Effective Date: 2026-06-30 · SHA-256 Verified</div>
          </div>

          <!-- Step 2: Extracted Obligation -->
          <div class="p-3.5 bg-surface-muted rounded-lg border border-border space-y-1.5">
            <div class="flex items-center justify-between font-bold text-purple-900">
              <span>2. Reviewed Regulatory Obligation</span>
              <span class="font-mono text-[11px]">OBL-CR-001 (Page 1)</span>
            </div>
            <div class="text-text-primary italic font-serif">"Consumer credit exposures shall attract a risk weight of 125% where individual commitments exceed INR 50,000..."</div>
            <div class="text-[11px] text-emerald-700 font-semibold">Certified Applicable by Maya Sen (Compliance Analyst)</div>
          </div>

          <!-- Step 3: Internal Policy Mapping -->
          <div class="p-3.5 bg-surface-muted rounded-lg border border-border space-y-1.5">
            <div class="flex items-center justify-between font-bold text-purple-900">
              <span>3. Internal Policy Mapping</span>
              <span class="font-mono text-[11px]">POL-CR-01</span>
            </div>
            <div class="text-text-primary">Retail Credit Risk & Capital Adequacy Policy (Section 4.2: Risk Weight Schedules)</div>
            <div class="text-[11px] text-emerald-700 font-semibold">Exact 96% Match Alignment Certified</div>
          </div>

          <!-- Step 4: Rule Version AST -->
          <div class="p-3.5 bg-surface-muted rounded-lg border border-border space-y-1.5">
            <div class="flex items-center justify-between font-bold text-purple-900">
              <span>4. Structured Rule Candidate</span>
              <span class="font-mono text-[11px]">RULE-CR-2026-01 · v1.1.0-draft</span>
            </div>
            <div class="text-text-primary">Unsecured Retail Credit Risk Weight & Capital Buffer Rule (Restricted JSON DSL)</div>
            <div class="text-[11px] text-purple-800">Authored by Arun Patel · Validated Conforming AST</div>
          </div>

          <!-- Step 5: Regression Test Evidence -->
          <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5">
            <div class="flex items-center justify-between font-bold text-emerald-950">
              <span>5. Deterministic Test Run Evidence</span>
              <span class="font-mono text-emerald-800">5 / 5 PASSED (100%)</span>
            </div>
            <div class="text-emerald-900">All boundary edge cases and statutory priority sector exemptions passed assertion.</div>
          </div>

          <!-- Step 6: Impact Report -->
          <div class="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1.5">
            <div class="flex items-center justify-between font-bold text-amber-950">
              <span>6. Simulated Portfolio Impact</span>
              <span class="font-mono text-amber-800">47% Changed / 53% Unchanged</span>
            </div>
            <div class="text-amber-900">Evaluated on versioned synthetic dataset (100 borrower profiles).</div>
          </div>

          <!-- Step 7: Dual-Control Approval -->
          <div class="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1.5">
            <div class="flex items-center justify-between font-bold text-emerald-950">
              <span>7. Human Governance Approval</span>
              <span class="font-mono text-emerald-800">APPROVED</span>
            </div>
            <div class="text-emerald-900">Independent dual-control sign-off by Vikram Mehta (Compliance Approver).</div>
          </div>
        </div>

        <div class="px-6 py-3.5 bg-surface-muted border-t border-border flex items-center justify-between text-xs">
          <span class="text-text-secondary">Evidence Package Certified for Regulatory Audit Inspection</span>
          <AppButton variant="primary" size="sm" @click="showEvidenceModal = false">
            Close Dossier
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '../../services/api';
import type { AuditEvent } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const events = ref<AuditEvent[]>([]);
const filteredEvents = ref<AuditEvent[]>([]);
const loading = ref(true);
const selectedEventType = ref('');
const showEvidenceModal = ref(false);

const loadAudit = async () => {
  try {
    loading.value = true;
    const list = await apiService.getAuditEvents();
    events.value = list;
    filterAuditEvents();
  } catch (err) {
    console.error('Failed loading audit trail', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadAudit);

const filterAuditEvents = () => {
  if (!selectedEventType.value) {
    filteredEvents.value = events.value;
  } else {
    filteredEvents.value = events.value.filter(e => e.event_type === selectedEventType.value);
  }
};

const getEventBadgeVariant = (eventType: string) => {
  if (eventType.includes('APPROVAL') || eventType.includes('DEPLOYED')) return 'success';
  if (eventType.includes('ROLLBACK') || eventType.includes('REJECTED')) return 'error';
  if (eventType.includes('IMPACT') || eventType.includes('DRAFT')) return 'warning';
  return 'purple';
};

const openEvidenceModal = () => {
  showEvidenceModal.value = true;
};
</script>
