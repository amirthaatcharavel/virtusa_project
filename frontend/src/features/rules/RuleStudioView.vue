<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-mono font-semibold text-[#167D83]">{{ activeRule?.rule_code || 'RULE-CR-2026-01' }}</span>
          <span class="text-[#E1E5E8]">|</span>
          <AppBadge variant="teal" dot>{{ activeRule?.status }}</AppBadge>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173]">Connected Policy: <strong class="text-[#182533]">POL-CR-01</strong></span>
        </div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-[#182533] tracking-tight">
          {{ activeRule?.name || 'Rule Engineering Studio' }}
        </h1>
        <p class="text-xs text-[#526173] mt-0.5">
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
          <div class="divide-y divide-[#E1E5E8]">
            <div
              v-for="v in versions"
              :key="v.id"
              @click="loadVersion(v)"
              :class="[
                'p-3.5 cursor-pointer transition-colors border-l-4 text-xs',
                selectedVersion?.id === v.id
                  ? 'border-[#167D83] bg-[#167D83]/10'
                  : 'border-transparent hover:bg-[#F6F5F0]'
              ]"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-mono font-bold text-[#167D83]">{{ v.version_number }}</span>
                <AppBadge :variant="v.version_number.includes('draft') ? 'warning' : 'success'">
                  {{ v.version_number.includes('draft') ? 'Candidate' : 'Baseline' }}
                </AppBadge>
              </div>
              <p class="text-xs text-[#526173] line-clamp-2 leading-relaxed">
                {{ v.change_summary }}
              </p>
              <div class="mt-2 text-xs text-[#526173] font-mono">
                Created: {{ new Date(v.created_at).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Allowed Operator Reference -->
        <AppCard title="Restricted DSL Operators" subtitle="Deterministically enforced operators" compact>
          <div class="space-y-2 text-xs text-[#526173]">
            <div>
              <strong class="text-[#182533] block">Logical:</strong>
              <span class="font-mono text-[#167D83]">AND, OR, NOT</span>
            </div>
            <div>
              <strong class="text-[#182533] block">Comparators:</strong>
              <span class="font-mono text-[#167D83]">EQUALS, NOT_EQUALS, GREATER_THAN, GREATER_THAN_OR_EQUAL, LESS_THAN, LESS_THAN_OR_EQUAL, IN, NOT_IN</span>
            </div>
            <div class="pt-1.5 border-t border-[#E1E5E8] text-xs text-[#526173] font-mono">
              * Arbitrary execution (eval/exec) strictly prohibited by deterministic AST engine.
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Right: JSON Rule DSL Editor & Validation Output (9 cols) -->
      <div class="lg:col-span-9 space-y-4">
        <!-- Validation Banner if Errors/Success -->
        <div v-if="validationOutput" :class="[
          'p-3.5 rounded-[3px] border text-xs flex items-start gap-2.5',
          validationOutput.is_valid
            ? 'bg-[#EDF6F1] border-[#BCE0CE] text-[#247653]'
            : 'bg-[#FDF1F2] border-[#F5C2C6] text-[#B33A42]'
        ]">
          <AppIcon :name="validationOutput.is_valid ? 'check' : 'alert'" :size="16" class="mt-0.5 flex-shrink-0" />
          <div class="flex-1">
            <div class="font-semibold">
              {{ validationOutput.is_valid ? 'Deterministic Rule DSL Conformance Certified' : 'Rule DSL Conformance Validation Errors' }}
            </div>
            <ul v-if="!validationOutput.is_valid" class="mt-1 list-disc list-inside space-y-0.5 font-mono text-xs">
              <li v-for="err in validationOutput.errors" :key="err">{{ err }}</li>
            </ul>
            <div v-else class="text-xs text-[#247653] mt-0.5 font-mono">
              All input types, condition groups, and operator clauses match the deterministic AST schema specification.
            </div>
          </div>
        </div>

        <AppCard noPadding>
          <div class="px-5 py-3 bg-[#F6F5F0] border-b border-[#E1E5E8] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <AppIcon name="rules" :size="15" class="text-[#167D83]" />
              <span class="text-xs font-semibold text-[#182533]">
                Rule Definition Editor — Version <span class="font-mono">{{ selectedVersion?.version_number }}</span>
              </span>
            </div>

            <div class="flex items-center gap-2">
              <AppButton variant="primary" size="sm" @click="saveNewDraft" :loading="saving">
                Save As New Version Draft
              </AppButton>
            </div>
          </div>

          <!-- Code Editor Area -->
          <div class="p-4 bg-[#0B1728] border-b border-[#14263D] text-[#E1E5E8] font-mono text-xs overflow-x-auto">
            <textarea
              v-model="dslJsonString"
              rows="22"
              class="w-full bg-transparent text-[#247653] text-teal-300 font-mono text-xs focus:outline-none resize-y leading-relaxed"
              spellcheck="false"
            ></textarea>
          </div>

          <!-- Version Change Summary Input -->
          <div class="p-4 bg-[#F6F5F0] border-t border-[#E1E5E8] space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#182533] mb-1 font-mono">Target Version Label</label>
                <input
                  v-model="newVersionNumber"
                  type="text"
                  placeholder="e.g. 1.1.1-draft"
                  class="w-full text-xs px-3 py-1.5 border border-[#E1E5E8] rounded-[3px] bg-white font-mono focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none"
                />
              </div>
              <div class="sm:col-span-3">
                <label class="block text-xs font-semibold text-[#182533] mb-1">Change Rationale / Summary</label>
                <input
                  v-model="changeSummaryInput"
                  type="text"
                  placeholder="Describe regulatory clauses implemented in this candidate version..."
                  class="w-full text-xs px-3 py-1.5 border border-[#E1E5E8] rounded-[3px] bg-white focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none"
                />
              </div>
            </div>
            <p class="text-xs text-[#AD741B] bg-[#FDF7EB] border border-[#EED7A8] p-2 rounded-[3px] font-mono">
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
