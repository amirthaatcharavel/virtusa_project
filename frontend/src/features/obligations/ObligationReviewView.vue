<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <router-link to="/obligations" class="text-xs text-purple-700 hover:underline">
            ← All Obligations
          </router-link>
          <span class="text-slate-300">|</span>
          <span class="text-xs font-mono text-text-secondary">{{ obligation?.obligation_code || 'OBLIGATION' }}</span>
        </div>
        <h1 class="text-lg font-bold text-text-primary tracking-tight">
          {{ obligation?.title || 'Obligation Review & Applicability Determination' }}
        </h1>
        <p class="text-xs text-text-secondary mt-0.5">
          Compliance Analyst review: Determine applicability, verify conditions, and record formal rationale.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link :to="`/mapping?obligationId=${obligation?.id}`">
          <AppButton variant="secondary" size="sm">
            <AppIcon name="mapping" :size="14" />
            Proceed to Policy Mapping →
          </AppButton>
        </router-link>
      </div>
    </div>

    <!-- Review Form & Source Provenance Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left: Source Evidence & Citation Context (5 cols) -->
      <div class="lg:col-span-5 space-y-4">
        <AppCard title="Regulatory Source Citation" subtitle="Verifiable text excerpt and citation location">
          <SourceCitationCard
            v-if="obligation"
            :circularTitle="circularTitle"
            :circularId="obligation.circular_id"
            :pageNumber="obligation.source_page"
            :spanRef="obligation.source_span"
            :extractedText="obligation.extracted_text"
            :uncertaintyFlags="obligation.flags"
          />

          <div class="mt-4 pt-3 border-t border-border text-xs text-text-secondary space-y-2">
            <div class="flex items-center justify-between">
              <span>Review Status:</span>
              <AppBadge :variant="obligation?.review_status === 'ACCEPTED' ? 'success' : 'neutral'">
                {{ obligation?.review_status }}
              </AppBadge>
            </div>
            <div class="flex items-center justify-between">
              <span>Last Reviewed By:</span>
              <span class="font-medium text-text-primary">{{ obligation?.reviewed_by_id ? 'Maya Sen (Compliance Analyst)' : 'Pending Review' }}</span>
            </div>
            <div v-if="obligation?.reviewed_at" class="flex items-center justify-between">
              <span>Review Timestamp:</span>
              <span class="font-mono text-[11px]">{{ new Date(obligation.reviewed_at).toLocaleString() }}</span>
            </div>
          </div>
        </AppCard>

        <!-- Current Internal Mapping Status -->
        <AppCard title="Internal Policy Alignment" subtitle="Connected internal policy or rule mapping">
          <div v-if="obligation?.policy_code" class="p-3 bg-purple-50/50 border border-purple-200/80 rounded text-xs">
            <div class="flex items-center justify-between mb-1">
              <span class="font-mono font-bold text-purple-900">{{ obligation.policy_code }}</span>
              <AppBadge variant="purple">MAPPED</AppBadge>
            </div>
            <div class="text-xs font-semibold text-text-primary">{{ obligation.policy_title }}</div>
          </div>
          <div v-else class="p-4 bg-surface-muted border border-dashed border-border rounded text-center text-xs text-text-secondary">
            No internal policy mapped yet.
            <div class="mt-2">
              <router-link :to="`/mapping?obligationId=${obligation?.id}`" class="text-purple-700 font-semibold hover:underline">
                Find matching internal policies →
              </router-link>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Right: Obligation Attributes & Applicability Decision (7 cols) -->
      <div class="lg:col-span-7">
        <AppCard title="Obligation Attributes & Human Determination" subtitle="Edit candidate fields and certify applicability">
          <form @submit.prevent="saveReview" class="space-y-4 text-xs">
            <!-- Title -->
            <div>
              <label class="block font-semibold text-text-primary mb-1">Obligation Title</label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600 font-medium"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-text-primary mb-1">Regulated Actor</label>
                <input
                  v-model="form.actor"
                  type="text"
                  class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600"
                />
              </div>
              <div>
                <label class="block font-semibold text-text-primary mb-1">Compliance Deadline</label>
                <input
                  v-model="form.deadline"
                  type="date"
                  class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600"
                />
              </div>
            </div>

            <!-- Conditions & Threshold -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold text-text-primary mb-1">Regulatory Threshold</label>
                <input
                  v-model="form.threshold"
                  type="text"
                  placeholder="e.g. Loan Amount > INR 50,000"
                  class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600 font-mono"
                />
              </div>
              <div>
                <label class="block font-semibold text-text-primary mb-1">Applicability Determination *</label>
                <select
                  v-model="form.applicability"
                  required
                  class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600 font-semibold"
                  :class="form.applicability === 'APPLICABLE' ? 'text-emerald-700 bg-emerald-50/40' : form.applicability === 'UNRESOLVED' ? 'text-amber-800 bg-amber-50/40' : 'text-slate-700'"
                >
                  <option value="APPLICABLE">Applicable (Proceed to Mapping & Rule Studio)</option>
                  <option value="NOT_APPLICABLE">Not Applicable (Exempt from our portfolio)</option>
                  <option value="UNRESOLVED">Unresolved (Awaiting legal / risk clarification)</option>
                </select>
              </div>
            </div>

            <!-- Action -->
            <div>
              <label class="block font-semibold text-text-primary mb-1">Mandated Action / Implementation Specification</label>
              <textarea
                v-model="form.action"
                rows="2"
                class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600"
              ></textarea>
            </div>

            <!-- Conditions -->
            <div>
              <label class="block font-semibold text-text-primary mb-1">Conditions Expression</label>
              <textarea
                v-model="form.conditions"
                rows="2"
                class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600 font-mono"
              ></textarea>
            </div>

            <!-- Compliance Reviewer Rationale -->
            <div class="pt-2 border-t border-border">
              <label class="block font-semibold text-text-primary mb-1">
                Compliance Reviewer Rationale *
                <span class="text-text-secondary font-normal">(Recorded in immutable audit trail)</span>
              </label>
              <textarea
                v-model="form.reviewer_notes"
                rows="3"
                required
                placeholder="Explain the regulatory justification for this applicability determination and any internal policy dependencies..."
                class="w-full px-3 py-2 border border-border rounded focus:ring-1 focus:ring-purple-600"
              ></textarea>
            </div>

            <div v-if="saveSuccess" class="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded flex items-center gap-1.5 text-xs">
              <AppIcon name="check" :size="14" class="text-emerald-600" />
              <span>Review successfully recorded and persisted to audit log.</span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-border">
              <span class="text-[11px] text-text-secondary">Changes recorded with actor ID: {{ authStore.currentUser.full_name }}</span>
              <AppButton type="submit" variant="primary" size="md" :loading="saving">
                Save Review Determination
              </AppButton>
            </div>
          </form>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { apiService } from '../../services/api';
import type { Obligation } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';
import SourceCitationCard from '../../components/ui/SourceCitationCard.vue';

const route = useRoute();
const authStore = useAuthStore();
const obligation = ref<Obligation | null>(null);
const circularTitle = ref('Reserve Bank of India Circular 2026/84');
const saving = ref(false);
const saveSuccess = ref(false);

const obligationId = computed(() => (route.params.obligationId as string) || 'obl-01');

const form = ref({
  title: '',
  actor: '',
  action: '',
  conditions: '',
  threshold: '',
  deadline: '2026-06-30',
  applicability: 'APPLICABLE' as any,
  reviewer_notes: '',
  review_status: 'ACCEPTED' as any,
});

onMounted(async () => {
  try {
    const data = await apiService.getObligation(obligationId.value);
    obligation.value = data;
    form.value = {
      title: data.title || '',
      actor: data.actor || '',
      action: data.action || '',
      conditions: data.conditions || '',
      threshold: data.threshold || '',
      deadline: data.deadline || '2026-06-30',
      applicability: data.applicability || 'APPLICABLE',
      reviewer_notes: data.reviewer_notes || '',
      review_status: data.review_status || 'ACCEPTED',
    };
  } catch (err) {
    console.error('Failed loading obligation', err);
  }
});

const saveReview = async () => {
  try {
    saving.value = true;
    saveSuccess.value = false;
    const updated = await apiService.reviewObligation(obligationId.value, form.value, authStore.currentUser.id);
    obligation.value = updated;
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 3500);
  } catch (err) {
    console.error('Failed saving obligation review', err);
  } finally {
    saving.value = false;
  }
};
</script>
