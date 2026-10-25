<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-bold text-text-primary tracking-tight">Regulatory Circular Library</h1>
        <p class="text-xs text-text-secondary mt-1">
          Ingest, verify, and track regulatory publications with page-level provenance.
        </p>
      </div>
      <AppButton @click="showUploadModal = true" variant="primary" size="md">
        <AppIcon name="plus" :size="16" />
        Ingest Regulatory Circular
      </AppButton>
    </div>

    <!-- Search & Filter Bar -->
    <AppCard noPadding>
      <div class="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-muted border-b border-border">
        <div class="relative w-full sm:w-80">
          <AppIcon name="search" :size="14" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search circulars by title or number..."
            class="w-full text-xs pl-8 pr-3 py-2 bg-white border border-border rounded-md text-text-primary focus:outline-none focus:ring-1 focus:ring-purple-600"
            @input="filterCirculars"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select
            v-model="selectedAuthority"
            class="text-xs bg-white border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-purple-600"
            @change="filterCirculars"
          >
            <option value="">All Regulatory Authorities</option>
            <option value="Reserve Bank of India">Reserve Bank of India (RBI)</option>
            <option value="European Banking Authority">European Banking Authority (EBA)</option>
            <option value="FinCEN">Financial Crimes Enforcement Network (FinCEN)</option>
          </select>
        </div>
      </div>

      <!-- Circulars Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-text-primary border-collapse">
          <thead>
            <tr class="bg-surface-subtle text-text-secondary border-b border-border uppercase tracking-wider text-[10px]">
              <th class="px-5 py-3 font-semibold">Document Title / Ref</th>
              <th class="px-4 py-3 font-semibold">Authority</th>
              <th class="px-4 py-3 font-semibold">Publication Date</th>
              <th class="px-4 py-3 font-semibold">Effective Date</th>
              <th class="px-4 py-3 font-semibold">Pages / Obligations</th>
              <th class="px-4 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-if="loading" class="text-center">
              <td colspan="7" class="py-8 text-text-secondary">Loading regulatory documents...</td>
            </tr>
            <tr v-else-if="filteredList.length === 0" class="text-center">
              <td colspan="7" class="py-8 text-text-secondary">No circulars matching your criteria.</td>
            </tr>
            <tr
              v-for="c in filteredList"
              :key="c.id"
              class="hover:bg-purple-50/20 transition-colors"
            >
              <td class="px-5 py-3.5">
                <div class="font-medium text-text-primary text-xs">{{ c.title }}</div>
                <div class="text-[11px] text-text-secondary font-mono mt-0.5 flex items-center gap-2">
                  <span>{{ c.circular_number || c.filename }}</span>
                  <span v-if="c.file_hash" class="text-slate-400 font-mono text-[9px]" title="SHA-256 Hash">
                    SHA: {{ c.file_hash.substring(0, 10) }}...
                  </span>
                </div>
              </td>
              <td class="px-4 py-3.5 font-medium text-text-secondary">
                {{ c.source_authority }}
              </td>
              <td class="px-4 py-3.5 text-text-secondary font-mono">
                {{ c.publication_date || 'N/A' }}
              </td>
              <td class="px-4 py-3.5 text-purple-900 font-mono font-medium">
                {{ c.effective_date || 'N/A' }}
              </td>
              <td class="px-4 py-3.5 text-text-secondary">
                <span class="font-semibold text-text-primary">{{ c.page_count }}</span> pages · 
                <span class="font-semibold text-purple-700">{{ c.obligations_count }}</span> candidate obligations
              </td>
              <td class="px-4 py-3.5">
                <AppBadge variant="purple" dot>{{ c.status }}</AppBadge>
              </td>
              <td class="px-5 py-3.5 text-right">
                <router-link
                  :to="`/circulars/${c.id}`"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded"
                >
                  Inspect Source
                  <AppIcon name="chevron-right" :size="12" />
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AppCard>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-border">
        <div class="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-muted">
          <div>
            <h3 class="text-sm font-bold text-text-primary">Ingest Regulatory Circular</h3>
            <p class="text-xs text-text-secondary">Extract page-level obligations with source citation fidelity</p>
          </div>
          <button @click="showUploadModal = false" class="text-slate-400 hover:text-slate-600">
            <AppIcon name="close" :size="16" />
          </button>
        </div>

        <form @submit.prevent="handleUpload" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-text-primary mb-1">Circular Document Title *</label>
            <input
              v-model="uploadForm.title"
              type="text"
              required
              placeholder="e.g. RBI Master Direction on Unsecured Retail Credit Risk Weights"
              class="w-full text-xs px-3 py-2 border border-border rounded-md focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-text-primary mb-1">Authority *</label>
              <select
                v-model="uploadForm.source_authority"
                required
                class="w-full text-xs px-3 py-2 border border-border rounded-md focus:ring-1 focus:ring-purple-600"
              >
                <option value="Reserve Bank of India">Reserve Bank of India (RBI)</option>
                <option value="European Banking Authority">European Banking Authority (EBA)</option>
                <option value="FinCEN">FinCEN</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-text-primary mb-1">Circular Ref / No.</label>
              <input
                v-model="uploadForm.circular_number"
                type="text"
                placeholder="e.g. RBI/2026-27/84"
                class="w-full text-xs px-3 py-2 border border-border rounded-md focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-text-primary mb-1">Publication Date</label>
              <input
                v-model="uploadForm.publication_date"
                type="date"
                class="w-full text-xs px-3 py-2 border border-border rounded-md focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-text-primary mb-1">Effective Mandate Date</label>
              <input
                v-model="uploadForm.effective_date"
                type="date"
                class="w-full text-xs px-3 py-2 border border-border rounded-md focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-text-primary mb-1">Regulatory Document (PDF or TXT) *</label>
            <input
              type="file"
              accept=".pdf,.txt"
              required
              @change="onFileChange"
              class="w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-purple-300 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-800 hover:file:bg-purple-100"
            />
            <p class="text-[11px] text-text-secondary mt-1">Maximum 25MB. PDF text will be extracted page by page.</p>
          </div>

          <div v-if="uploadError" class="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700">
            {{ uploadError }}
          </div>

          <div class="pt-3 border-t border-border flex items-center justify-end gap-2">
            <AppButton type="button" variant="outline" size="sm" @click="showUploadModal = false">
              Cancel
            </AppButton>
            <AppButton type="submit" variant="primary" size="sm" :loading="uploading">
              Ingest & Extract Obligations
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { apiService } from '../../services/api';
import type { Circular } from '../../types';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const circulars = ref<Circular[]>([]);
const filteredList = ref<Circular[]>([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedAuthority = ref('');

const showUploadModal = ref(false);
const uploading = ref(false);
const uploadError = ref('');
const uploadFile = ref<File | null>(null);

const uploadForm = ref({
  title: '',
  source_authority: 'Reserve Bank of India',
  circular_number: '',
  publication_date: '2026-03-15',
  effective_date: '2026-06-30',
});

const loadCirculars = async () => {
  try {
    loading.value = true;
    const data = await apiService.getCirculars();
    circulars.value = data;
    filterCirculars();
  } catch (err) {
    console.error('Failed loading circulars', err);
  } finally {
    loading.value = false;
  }
};

onMounted(loadCirculars);

const filterCirculars = () => {
  let list = [...circulars.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(c => c.title.toLowerCase().includes(q) || (c.circular_number && c.circular_number.toLowerCase().includes(q)));
  }
  if (selectedAuthority.value) {
    list = list.filter(c => c.source_authority === selectedAuthority.value);
  }
  filteredList.value = list;
};

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    uploadFile.value = target.files[0];
  }
};

const handleUpload = async () => {
  if (!uploadFile.value) {
    uploadError.value = 'Please select a PDF or TXT file to upload.';
    return;
  }
  try {
    uploading.value = true;
    uploadError.value = '';

    const formData = new FormData();
    formData.append('file', uploadFile.value);
    formData.append('title', uploadForm.value.title);
    formData.append('source_authority', uploadForm.value.source_authority);
    if (uploadForm.value.circular_number) formData.append('circular_number', uploadForm.value.circular_number);
    if (uploadForm.value.publication_date) formData.append('publication_date', uploadForm.value.publication_date);
    if (uploadForm.value.effective_date) formData.append('effective_date', uploadForm.value.effective_date);

    await apiService.uploadCircular(formData);
    showUploadModal.value = false;
    await loadCirculars();
  } catch (err: any) {
    uploadError.value = err?.response?.data?.detail || 'Failed to upload circular. Please check backend status.';
  } finally {
    uploading.value = false;
  }
};
</script>
