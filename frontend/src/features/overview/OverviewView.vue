<template>
  <div class="space-y-6">
    <!-- Page Header & Workflow Banner -->
    <div class="bg-white border border-border rounded-lg p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="purple">Governance Lifecycle</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary font-mono">Active Role: {{ authStore.roleLabel }}</span>
        </div>
        <h1 class="text-lg font-bold text-text-primary tracking-tight">
          Regulatory Circular to Live Rule Engine Pipeline
        </h1>
        <p class="text-xs text-text-secondary mt-0.5 max-w-3xl leading-relaxed">
          Transform regulatory circulars into source-traceable, testable, human-approved decision-rule changes with deterministic evaluation, impact simulation, and controlled sandbox deployment.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link to="/circulars">
          <AppButton variant="primary" size="sm">
            <AppIcon name="plus" :size="14" />
            Ingest Circular
          </AppButton>
        </router-link>
        <router-link to="/simulation">
          <AppButton variant="outline" size="sm">
            <AppIcon name="simulator" :size="14" />
            Impact Simulator
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Core Lifecycle Visual Flow -->
    <AppCard title="Regulatory-to-Rule Governance Pipeline" subtitle="End-to-end evidence chain from regulatory source to sandbox release">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <router-link
          v-for="(stage, idx) in pipelineStages"
          :key="stage.name"
          :to="stage.route"
          class="p-3 rounded-lg border transition-all duration-150 flex flex-col justify-between hover:shadow-xs group"
          :class="stage.highlight ? 'border-purple-300 bg-purple-50/60' : 'border-border bg-white hover:border-purple-200'"
        >
          <div>
            <div class="flex items-center justify-between text-xs text-text-secondary mb-2">
              <span class="font-mono text-[10px] text-purple-700 font-semibold">0{{ idx + 1 }}</span>
              <span class="w-2 h-2 rounded-full" :class="stage.dotColor"></span>
            </div>
            <div class="font-semibold text-xs text-text-primary group-hover:text-purple-700 transition-colors">
              {{ stage.name }}
            </div>
            <div class="text-[11px] text-text-secondary mt-1 leading-snug">
              {{ stage.desc }}
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-purple-700 font-medium">
            <span>{{ stage.metric }}</span>
            <AppIcon name="chevron-right" :size="12" />
          </div>
        </router-link>
      </div>
    </AppCard>

    <!-- Role-Specific Action Queues -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Queue 1: Ingested Circulars & Obligations -->
      <AppCard title="Circulars & Ingestion" subtitle="Parsed documents with page fidelity" customClass="lg:col-span-1">
        <div v-if="loading" class="text-xs text-text-secondary py-4 text-center">Loading circulars...</div>
        <div v-else-if="circulars.length === 0" class="text-xs text-text-secondary py-6 text-center">No circulars ingested yet.</div>
        <div v-else class="space-y-3">
          <div
            v-for="c in circulars"
            :key="c.id"
            class="p-3 rounded-lg border border-border bg-surface-muted hover:border-purple-300 transition-colors"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-semibold text-purple-900">{{ c.source_authority }}</span>
              <AppBadge variant="purple" dot>{{ c.status }}</AppBadge>
            </div>
            <div class="text-xs font-medium text-text-primary line-clamp-1 mb-1">
              {{ c.title }}
            </div>
            <div class="flex items-center justify-between text-[11px] text-text-secondary pt-2 border-t border-border">
              <span>{{ c.page_count }} Pages · {{ c.obligations_count }} Obligations</span>
              <router-link :to="`/circulars/${c.id}`" class="text-purple-700 font-medium hover:underline flex items-center gap-0.5">
                Inspect <AppIcon name="chevron-right" :size="12" />
              </router-link>
            </div>
          </div>
        </div>
        <template #footer>
          <router-link to="/circulars" class="text-purple-700 font-medium hover:underline">
            View full circular library →
          </router-link>
        </template>
      </AppCard>

      <!-- Queue 2: Obligations Awaiting Review & Mapping -->
      <AppCard title="Obligations Review Queue" subtitle="Actionable compliance determination" customClass="lg:col-span-1">
        <div v-if="loading" class="text-xs text-text-secondary py-4 text-center">Loading obligations...</div>
        <div v-else class="space-y-3">
          <div
            v-for="obl in obligations"
            :key="obl.id"
            class="p-3 rounded-lg border border-border bg-surface-muted hover:border-purple-300 transition-colors"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-mono text-[11px] font-semibold text-text-primary">{{ obl.obligation_code }}</span>
              <AppBadge :variant="obl.applicability === 'APPLICABLE' ? 'success' : obl.applicability === 'UNRESOLVED' ? 'warning' : 'neutral'">
                {{ obl.applicability }}
              </AppBadge>
            </div>
            <div class="text-xs font-medium text-text-primary line-clamp-2 mb-1.5">
              {{ obl.title }}
            </div>
            <div class="text-[11px] text-text-secondary flex items-center justify-between pt-2 border-t border-border">
              <span>Source: Page {{ obl.source_page }}</span>
              <router-link :to="`/obligations/${obl.id}`" class="text-purple-700 font-medium hover:underline flex items-center gap-0.5">
                Review <AppIcon name="chevron-right" :size="12" />
              </router-link>
            </div>
          </div>
        </div>
        <template #footer>
          <router-link to="/obligations" class="text-purple-700 font-medium hover:underline">
            View all obligations →
          </router-link>
        </template>
      </AppCard>

      <!-- Queue 3: Candidate Rules & Governance Gating -->
      <AppCard title="Governance & Releases" subtitle="Tested rule versions and approvals" customClass="lg:col-span-1">
        <div v-if="loading" class="text-xs text-text-secondary py-4 text-center">Loading governance status...</div>
        <div v-else class="space-y-3">
          <div
            v-for="r in rules"
            :key="r.id"
            class="p-3 rounded-lg border border-border bg-surface-muted hover:border-purple-300 transition-colors"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-mono text-[11px] font-semibold text-purple-900">{{ r.rule_code }}</span>
              <AppBadge :variant="r.status === 'APPROVED' || r.status === 'DEPLOYED' ? 'success' : 'purple'" dot>
                {{ r.status }}
              </AppBadge>
            </div>
            <div class="text-xs font-medium text-text-primary line-clamp-1 mb-1">
              {{ r.name }}
            </div>
            <div class="text-[11px] text-text-secondary pt-2 border-t border-border flex items-center justify-between">
              <span>Category: {{ r.category }}</span>
              <router-link :to="`/rules/${r.id}`" class="text-purple-700 font-medium hover:underline flex items-center gap-0.5">
                Studio <AppIcon name="chevron-right" :size="12" />
              </router-link>
            </div>
          </div>

          <!-- Quick Test & Impact Simulation Link -->
          <div class="p-3 rounded-lg bg-purple-50/50 border border-purple-200 text-xs text-purple-900">
            <div class="font-semibold flex items-center gap-1 mb-1">
              <AppIcon name="simulator" :size="14" class="text-purple-700" />
              Verified Regression Evidence
            </div>
            <p class="text-[11px] text-slate-700 leading-relaxed mb-2">
              Candidate version 1.1.0-draft has 5/5 passing deterministic tests and a complete impact analysis on 100 borrower profiles.
            </p>
            <div class="flex items-center gap-2">
              <router-link to="/simulation" class="text-purple-700 font-semibold hover:underline text-[11px]">
                Open Impact Report →
              </router-link>
              <span class="text-slate-400">·</span>
              <router-link to="/approvals" class="text-purple-700 font-semibold hover:underline text-[11px]">
                Approval Queue →
              </router-link>
            </div>
          </div>
        </div>
        <template #footer>
          <router-link to="/deployments" class="text-purple-700 font-medium hover:underline">
            View sandbox monitor →
          </router-link>
        </template>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { Circular, Obligation, Rule } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const authStore = useAuthStore();
const loading = ref(true);
const circulars = ref<Circular[]>([]);
const obligations = ref<Obligation[]>([]);
const rules = ref<Rule[]>([]);

const pipelineStages = [
  { name: '1. Ingest Circular', desc: 'Preserve text & page coordinates', route: '/circulars', metric: '1 Document', dotColor: 'bg-purple-500', highlight: false },
  { name: '2. Extract & Review', desc: 'Identify actor, condition, threshold', route: '/obligations', metric: '3 Obligations', dotColor: 'bg-emerald-500', highlight: false },
  { name: '3. Policy Mapping', desc: 'Map to internal policy catalogue', route: '/policy-mapping', metric: '2 Mapped', dotColor: 'bg-blue-500', highlight: false },
  { name: '4. Rule Studio', desc: 'Restricted JSON DSL authoring', route: '/rules', metric: 'v1.1.0-draft', dotColor: 'bg-purple-600', highlight: false },
  { name: '5. Impact Simulator', desc: 'Deterministic baseline vs candidate', route: '/simulation', metric: '100 Evaluated', dotColor: 'bg-amber-500', highlight: true },
  { name: '6. Sandbox Deploy', desc: 'Independent approval & release', route: '/deployments', metric: 'Sandbox Active', dotColor: 'bg-purple-700', highlight: false },
];

onMounted(async () => {
  try {
    loading.value = true;
    const [cData, oData, rData] = await Promise.all([
      apiService.getCirculars(),
      apiService.getObligations(),
      apiService.getRules(),
    ]);
    circulars.value = cData.slice(0, 3);
    obligations.value = oData.slice(0, 3);
    rules.value = rData.slice(0, 3);
  } catch (err) {
    console.error('Failed loading overview data', err);
  } finally {
    loading.value = false;
  }
});
</script>
