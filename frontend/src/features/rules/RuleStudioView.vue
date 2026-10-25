<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-mono font-semibold text-purple-900">{{ activeRule?.rule_code || 'RULE-CR-2026-01' }}</span>
          <span class="text-slate-300">|</span>
          <AppBadge variant="purple" dot>{{ activeRule?.status }}</AppBadge>
          <span class="text-slate-300">|</span>
          <span class="text-xs text-text-secondary">Connected Policy: <strong>POL-CR-01</strong></span>
        </div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">
          {{ activeRule?.name || 'Rule Engineering Studio' }}
        </h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Restricted JSON Rule DSL authoring with deterministic syntax validation and zero arbitrary code execution.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <AppButton variant="outline" size="sm" @click="runValidation" :loading="validating">
          <AppIcon name="check" :size="14" />
          Validate DSL
        </AppButton>
        <router-link to="/tests">
          <AppButton variant="secondary" size="sm">
            <AppIcon name="play" :size="14" />
            Run Test Suite →
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Workspace Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Version History & Version Selector (3 cols) -->
      <div class="lg:col-span-3 space-y-4">
        <AppCard title="Rule Versions" subtitle="Select version to inspect or edit" noPadding>
          <div class="divide-y divide-border">
            <div
              v-for="v in versions"
              :key="v.id"
              @click="loadVersion(v)"
              :class="[
                'p-3.5 cursor-pointer transition-colors border-l-4 text-xs',
                selectedVersion?.id === v.id
                  ? 'border-purple-600 bg-purple-50/50'
                  : 'border-transparent hover:bg-slate-50'
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono font-bold text-purple-900">{{ v.version_number }}</span>
                <AppBadge :variant="v.version_number.includes('draft') ? 'warning' : 'success'">
                  {{ v.version_number.includes('draft') ? 'Candidate' : 'Baseline' }}
                </AppBadge>
              </div>
              <p class="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                {{ v.change_summary }}
              </p>
              <div class="mt-2 text-[10px] text-slate-400 font-mono">
                Created: {{ new Date(v.created_at).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Allowed Operator Reference -->
        <AppCard title="Restricted DSL Operators" subtitle="Deterministically enforced operators" compact>
          <div class="space-y-2 text-[11px] text-text-secondary">
            <div>
              <strong class="text-text-primary block">Logical:</strong>
              <span class="font-mono text-purple-700">AND, OR, NOT</span>
            </div>
            <div>
              <strong class="text-text-primary block">Comparators:</strong>
              <span class="font-mono text-purple-700">EQUALS, NOT_EQUALS, GREATER_THAN, GREATER_THAN_OR_EQUAL, LESS_THAN, LESS_THAN_OR_EQUAL, IN, NOT_IN</span>
            </div>
            <div class="pt-1.5 border-t border-border text-[10px] text-slate-500">
              * Arbitrary execution (eval/exec) strictly prohibited by deterministic AST engine.
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Right: JSON Rule DSL Editor & Validation Output (9 cols) -->
      <div class="lg:col-span-9 space-y-4">
        <!-- Validation Banner if Errors/Success -->
        <div v-if="validationOutput" :class="[
          'p-3.5 rounded-lg border text-xs flex items-start gap-2.5',
          validationOutput.is_valid
            ? 'bg-[#E8F5EE] border-[#B2DEC7] text-[#16845B]'
            : 'bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]'
        ]">
          <AppIcon :name="validationOutput.is_valid ? 'check' : 'alert'" :size="16" class="mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <div class="font-semibold">
              {{ validationOutput.is_valid ? 'Deterministic Rule DSL Conformance Certified' : 'Rule DSL Conformance Validation Errors' }}
            </div>
            <ul v-if="!validationOutput.is_valid" class="mt-1 list-disc list-inside space-y-0.5 font-mono text-[11px]">
              <li v-for="err in validationOutput.errors" :key="err">{{ err }}</li>
            </ul>
            <div v-else class="text-[11px] text-[#16845B] mt-0.5">
              All input types, condition groups, and operator clauses match the deterministic AST schema specification.
            </div>
          </div>
        </div>

        <AppCard noPadding>
          <div class="px-5 py-3 bg-surface-muted border-b border-border flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon name="rules" :size="15" class="text-purple-700" />
              <span class="text-xs font-semibold text-text-primary">
                Rule Definition Editor — Version {{ selectedVersion?.version_number }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <AppButton variant="primary" size="sm" @click="saveNewDraft" :loading="saving">
                Save As New Version Draft
              </AppButton>
            </div>
          </div>

          <!-- Code Editor Area -->
          <div class="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
            <textarea
              v-model="dslJsonString"
              rows="22"
              class="w-full bg-transparent text-emerald-300 font-mono text-xs focus:outline-none resize-y leading-relaxed"
              spellcheck="false"
            ></textarea>
          </div>

          <!-- Version Change Summary Input -->
          <div class="p-4 bg-surface-muted border-t border-border space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label class="block text-xs font-semibold text-text-primary mb-1">Target Version Label</label>
                <input
                  v-model="newVersionNumber"
                  type="text"
                  placeholder="e.g. 1.1.1-draft"
                  class="w-full text-xs px-3 py-1.5 border border-border rounded bg-white font-mono focus:ring-1 focus:ring-purple-600"
                />
              </div>
              <div class="sm:col-span-3">
                <label class="block text-xs font-semibold text-text-primary mb-1">Change Rationale / Summary</label>
                <input
                  v-model="changeSummaryInput"
                  type="text"
                  placeholder="Describe regulatory clauses implemented in this candidate version..."
                  class="w-full text-xs px-3 py-1.5 border border-border rounded bg-white focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>
            <p class="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded">
              <strong>Governance Safeguard:</strong> Saving a material rule update automatically resets rule status to DRAFT and invalidates any previous approval for prior versions.
            </p>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { Rule, RuleVersion } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const authStore = useAuthStore();
const activeRule = ref<Rule | null>(null);
const versions = ref<RuleVersion[]>([]);
const selectedVersion = ref<RuleVersion | null>(null);
const dslJsonString = ref('');
const validating = ref(false);
const saving = ref(false);
const validationOutput = ref<{ is_valid: boolean; errors: string[] } | null>(null);

const newVersionNumber = ref('1.2.0-draft');
const changeSummaryInput = ref('Refined exception handling and boundary thresholds.');

onMounted(async () => {
  try {
    const rules = await apiService.getRules();
    if (rules.length > 0) {
      activeRule.value = rules[0];
      const verList = await apiService.getRuleVersions(rules[0].id);
      versions.value = verList;
      if (verList.length > 0) {
        loadVersion(verList[0]);
      }
    }
  } catch (err) {
    console.error('Failed loading rules', err);
  }
});

const loadVersion = (ver: RuleVersion) => {
  selectedVersion.value = ver;
  dslJsonString.value = JSON.stringify(ver.dsl_definition, null, 2);
  validationOutput.value = null;
};

const runValidation = async () => {
  try {
    validating.value = true;
    const parsed = JSON.parse(dslJsonString.value);
    const res = await apiService.validateRuleDsl(parsed);
    validationOutput.value = res;
  } catch (err: any) {
    validationOutput.value = {
      is_valid: false,
      errors: [err.message || 'Invalid JSON syntax'],
    };
  } finally {
    validating.value = false;
  }
};

const saveNewDraft = async () => {
  if (!activeRule.value) return;
  try {
    saving.value = true;
    const parsed = JSON.parse(dslJsonString.value);
    const newVer = await apiService.createRuleVersionDraft(activeRule.value.id, {
      version_number: newVersionNumber.value,
      dsl_definition: parsed,
      change_summary: changeSummaryInput.value,
    }, authStore.currentUser.id);

    const verList = await apiService.getRuleVersions(activeRule.value.id);
    versions.value = verList;
    loadVersion(newVer);
    await runValidation();
  } catch (err: any) {
    alert(err?.response?.data?.detail || 'Failed to save version draft');
  } finally {
    saving.value = false;
  }
};
</script>
