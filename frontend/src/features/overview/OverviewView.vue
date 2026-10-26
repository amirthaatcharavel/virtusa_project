<template>
  <div class="space-y-6">
    <!-- Page Header & Workflow Banner -->
    <div class="bg-white border border-[#E1E5E8] rounded-[3px] p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <AppBadge variant="teal">Governance Lifecycle</AppBadge>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173] font-mono">Active Role: {{ authStore.roleLabel }}</span>
        </div>
        <h1 class="text-lg font-bold text-[#182533] tracking-tight">
          Regulatory Circular to Live Rule Engine Pipeline
        </h1>
        <p class="text-xs text-[#526173] mt-0.5 max-w-3xl leading-relaxed">
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
          class="p-3 rounded-[3px] border transition-all duration-150 flex flex-col justify-between hover:shadow-2xs group"
          :class="stage.highlight ? 'border-[#167D83] bg-[#167D83]/10' : 'border-[#E1E5E8] bg-white hover:border-[#167D83]/40'"
        >
          <div>
            <div class="flex items-center justify-between text-xs text-[#526173] mb-2 font-mono">
              <span class="text-[10px] text-[#167D83] font-semibold">0{{ idx + 1 }}</span>
              <span class="w-2 h-2 rounded-full" :class="stage.dotColor"></span>
            </div>
            <div class="font-semibold text-xs text-[#182533] group-hover:text-[#167D83] transition-colors">
              {{ stage.name }}
            </div>
            <div class="text-[11px] text-[#526173] mt-1 leading-snug">
              {{ stage.desc }}
            </div>
          </div>
          <div class="mt-3 pt-2 border-t border-[#E1E5E8] flex items-center justify-between text-[11px] text-[#167D83] font-medium font-mono">
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
        <div v-if="loading" class="text-xs text-[#526173] py-4 text-center font-mono">Loading circulars...</div>
        <div v-else-if="circulars.length === 0" class="text-xs text-[#526173] py-6 text-center font-mono">No circulars ingested yet.</div>
        <div v-else class="space-y-3">
          <div
            v-for="c in circulars"
            :key="c.id"
            class="p-3 rounded-[3px] border border-[#E1E5E8] bg-[#F6F5F0] hover:border-[#167D83]/40 transition-colors"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-semibold text-[#182533]">{{ c.source_authority }}</span>
              <AppBadge variant="teal" dot>{{ c.status }}</AppBadge>
            </div>
            <div class="text-xs font-medium text-[#182533] line-clamp-1 mb-1">
              {{ c.title }}
            </div>
            <div class="flex items-center justify-between text-[11px] text-[#526173] pt-2 border-t border-[#E1E5E8]">
              <span class="font-mono">{{ c.page_count }} Pages · {{ c.obligations_count }} Obligations</span>
              <router-link :to="`/circulars/${c.id}`" class="text-[#167D83] font-medium hover:underline flex items-center gap-0.5 font-mono">
                Inspect <AppIcon name="chevron-right" :size="12" />
              </router-link>
            </div>
          </div>
        </div>
        <template #footer>
          <router-link to="/circulars" class="text-[#167D83] font-medium hover:underline font-mono">
            View full circular library →
          </router-link>
        </template>
      </AppCard>

      <!-- Queue 2: Obligations Awaiting Review & Mapping -->
      <AppCard title="Obligations Review Queue" subtitle="Actionable compliance determination" customClass="lg:col-span-1">
        <div v-if="loading" class="text-xs text-[#526173] py-4 text-center font-mono">Loading obligations...</div>
        <div v-else class="space-y-3">
          <div
            v-for="obl in obligations"
            :key="obl.id"
            class="p-3 rounded-[3px] border border-[#E1E5E8] bg-[#F6F5F0] hover:border-[#167D83]/40 transition-colors"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-mono text-[11px] font-semibold text-[#167D83]">{{ obl.obligation_code }}</span>
              <AppBadge :variant="obl.applicability === 'APPLICABLE' ? 'success' : obl.applicability === 'UNRESOLVED' ? 'warning' : 'neutral'">
                {{ obl.applicability }}
              </AppBadge>
            </div>
            <div class="text-xs font-medium text-[#182533] line-clamp-2 mb-1.5">
              {{ obl.title }}
            </div>
            <div class="text-[11px] text-[#526173] flex items-center justify-between pt-2 border-t border-[#E1E5E8] font-mono">
              <span>Source: Page {{ obl.source_page }}</span>
              <router-link :to="`/obligations/${obl.id}`" class="text-[#167D83] font-medium hover:underline flex items-center gap-0.5 font-mono">
                Review <AppIcon name="chevron-right" :size="12" />
              </router-link>
            </div>
          </div>
        </div>
        <template #footer>
          <router-link to="/obligations" class="text-[#167D83] font-medium hover:underline font-mono">
            View all obligations →
          </router-link>
        </template>
      </AppCard>

      <!-- Queue 3: Candidate Rules & Governance Gating -->
      <AppCard title="Governance & Releases" subtitle="Tested rule versions and approvals" customClass="lg:col-span-1">
        <div v-if="loading" class="text-xs text-[#526173] py-4 text-center font-mono">Loading governance status...</div>
        <div v-else class="space-y-3">
          <div
            v-for="r in rules"
            :key="r.id"
            class="p-3 rounded-[3px] border border-[#E1E5E8] bg-[#F6F5F0] hover:border-[#167D83]/40 transition-colors"
          >
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-mono text-[11px] font-semibold text-[#167D83]">{{ r.rule_code }}</span>
              <AppBadge :variant="r.status === 'APPROVED' || r.status === 'DEPLOYED' ? 'success' : 'teal'" dot>
                {{ r.status }}
              </AppBadge>
            </div>
            <div class="text-xs font-medium text-[#182533] line-clamp-1 mb-1">
              {{ r.name }}
            </div>
            <div class="text-[11px] text-[#526173] pt-2 border-t border-[#E1E5E8] flex items-center justify-between font-mono">
              <span>Category: {{ r.category }}</span>
              <router-link :to="`/rules/${r.id}`" class="text-[#167D83] font-medium hover:underline flex items-center gap-0.5 font-mono">
                Studio <AppIcon name="chevron-right" :size="12" />
              </router-link>
            </div>
          </div>

          <!-- Quick Test & Impact Simulation Link -->
          <div class="p-3 rounded-[3px] bg-[#167D83]/10 border border-[#167D83]/30 text-xs text-[#14263D]">
            <div class="font-semibold flex items-center gap-1 mb-1 font-mono">
              <AppIcon name="simulator" :size="14" class="text-[#167D83]" />
              Verified Regression Evidence
            </div>
            <p class="text-[11px] text-[#526173] leading-relaxed mb-2">
              Candidate version 1.1.0-draft has 5/5 passing deterministic tests and a complete impact analysis on 100 borrower profiles.
            </p>
            <div class="flex items-center gap-2 font-mono">
              <router-link to="/simulation" class="text-[#167D83] font-semibold hover:underline text-[11px]">
                Open Impact Report →
              </router-link>
              <span class="text-[#526173]">·</span>
              <router-link to="/approvals" class="text-[#167D83] font-semibold hover:underline text-[11px]">
                Approval Queue →
              </router-link>
            </div>
          </div>
        </div>
        <template #footer>
          <router-link to="/deployments" class="text-[#167D83] font-medium hover:underline font-mono">
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
  { name: '1. Ingest Circular', desc: 'Preserve text & page coordinates', route: '/circulars', metric: '1 Document', dotColor: 'bg-[#14263D]', highlight: false },
  { name: '2. Extract & Review', desc: 'Identify actor, condition, threshold', route: '/obligations', metric: '3 Obligations', dotColor: 'bg-[#247653]', highlight: false },
  { name: '3. Policy Mapping', desc: 'Map to internal policy catalogue', route: '/policy-mapping', metric: '2 Mapped', dotColor: 'bg-[#167D83]', highlight: false },
  { name: '4. Rule Studio', desc: 'Restricted JSON DSL authoring', route: '/rules', metric: 'v1.1.0-draft', dotColor: 'bg-[#14263D]', highlight: false },
  { name: '5. Impact Simulator', desc: 'Deterministic baseline vs candidate', route: '/simulation', metric: '100 Evaluated', dotColor: 'bg-[#AD741B]', highlight: true },
  { name: '6. Sandbox Deploy', desc: 'Independent approval & release', route: '/deployments', metric: 'Sandbox Active', dotColor: 'bg-[#167D83]', highlight: false },
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
