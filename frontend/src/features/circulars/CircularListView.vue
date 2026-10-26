<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-extrabold text-[#182533] tracking-tight">Regulatory Circular Library</h1>
        <p class="text-sm text-[#526173] mt-1 leading-relaxed">
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
      <div class="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F6F5F0] border-b border-[#E1E5E8]">
        <div class="relative w-full sm:w-80">
          <AppIcon name="search" :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#526173]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search circulars by title or number..."
            class="w-full text-sm pl-9 pr-3.5 py-2 bg-white border border-[#E1E5E8] rounded-[4px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
            @input="filterCirculars"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select
            v-model="selectedAuthority"
            class="text-sm bg-white border border-[#E1E5E8] rounded-[4px] px-3.5 py-2 text-[#182533] font-medium focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
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
        <table class="w-full text-left text-sm text-[#182533] border-collapse">
          <thead>
            <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-xs font-mono font-bold">
              <th class="px-5 py-3.5 font-bold">Document Title / Ref</th>
              <th class="px-4 py-3.5 font-bold">Authority</th>
              <th class="px-4 py-3.5 font-bold">Publication Date</th>
              <th class="px-4 py-3.5 font-bold">Effective Date</th>
              <th class="px-4 py-3.5 font-bold">Pages / Obligations</th>
              <th class="px-4 py-3.5 font-bold">Status</th>
              <th class="px-5 py-3.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E1E5E8]">
            <tr v-if="loading" class="text-center">
              <td colspan="7" class="py-10 text-sm text-[#526173] font-mono">Loading regulatory documents...</td>
            </tr>
            <tr v-else-if="filteredList.length === 0" class="text-center">
              <td colspan="7" class="py-10 text-sm text-[#526173] font-mono">No circulars matching your criteria.</td>
            </tr>
            <tr
              v-for="c in filteredList"
              :key="c.id"
              class="hover:bg-[#F6F5F0]/60 transition-colors"
            >
              <td class="px-5 py-4">
                <div class="font-semibold text-[#182533] text-sm">{{ c.title }}</div>
                <div class="text-xs text-[#526173] font-mono mt-1 flex items-center gap-2">
                  <span>{{ c.circular_number || c.filename }}</span>
                  <span v-if="c.file_hash" class="text-[#526173] font-mono text-xs font-semibold" title="SHA-256 Hash">
                    SHA: {{ c.file_hash.substring(0, 10) }}...
                  </span>
                </div>
              </td>
              <td class="px-4 py-4 font-medium text-[#526173] text-sm">
                {{ c.source_authority }}
              </td>
              <td class="px-4 py-4 text-[#526173] font-mono text-xs sm:text-sm">
                {{ c.publication_date || 'N/A' }}
              </td>
              <td class="px-4 py-4 text-[#182533] font-mono font-semibold text-xs sm:text-sm">
                {{ c.effective_date || 'N/A' }}
              </td>
              <td class="px-4 py-4 text-sm text-[#526173]">
                <span class="font-bold text-[#182533] font-mono">{{ c.page_count }}</span> pages · 
                <span class="font-bold text-[#167D83] font-mono">{{ c.obligations_count }}</span> candidate obligations
              </td>
              <td class="px-4 py-4">
                <AppBadge variant="teal" dot>{{ c.status }}</AppBadge>
              </td>
              <td class="px-5 py-4 text-right">
                <router-link
                  :to="`/circulars/${c.id}`"
                  class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#167D83] hover:text-[#14263D] bg-[#167D83]/10 hover:bg-[#167D83]/20 border border-[#167D83]/30 px-3 py-1.5 rounded-[4px] font-mono"
                >
                  Inspect Source
                  <AppIcon name="chevron-right" :size="13" />
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
      class="fixed inset-0 z-50 bg-[#0B1728]/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-[4px] shadow-xl max-w-lg w-full overflow-hidden border border-[#E1E5E8]">
        <div class="px-6 py-4 border-b border-[#E1E5E8] flex items-center justify-between bg-[#F6F5F0]">
          <div>
            <h3 class="text-sm font-bold text-[#182533]">Ingest Regulatory Circular</h3>
            <p class="text-xs text-[#526173]">Extract page-level obligations with source citation fidelity</p>
          </div>
          <button @click="showUploadModal = false" class="text-[#526173] hover:text-[#182533]">
            <AppIcon name="close" :size="16" />
          </button>
        </div>

        <form @submit.prevent="handleUpload" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-[#182533] mb-1">Circular Document Title *</label>
            <input
              v-model="uploadForm.title"
              type="text"
              required
              placeholder="e.g. RBI Master Direction on Unsecured Retail Credit Risk Weights"
              class="w-full text-xs px-3 py-2 border border-[#E1E5E8] rounded-[3px] focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-[#182533] mb-1">Authority *</label>
              <select
                v-model="uploadForm.source_authority"
                required
                class="w-full text-xs px-3 py-2 border border-[#E1E5E8] rounded-[3px] focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none"
              >
                <option value="Reserve Bank of India">Reserve Bank of India (RBI)</option>
                <option value="European Banking Authority">European Banking Authority (EBA)</option>
                <option value="FinCEN">FinCEN</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#182533] mb-1">Circular Ref / No.</label>
              <input
                v-model="uploadForm.circular_number"
                type="text"
                placeholder="e.g. RBI/2026-27/84"
                class="w-full text-xs px-3 py-2 border border-[#E1E5E8] rounded-[3px] focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-[#182533] mb-1">Publication Date</label>
              <input
                v-model="uploadForm.publication_date"
                type="date"
                class="w-full text-xs px-3 py-2 border border-[#E1E5E8] rounded-[3px] focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-[#182533] mb-1">Effective Mandate Date</label>
              <input
                v-model="uploadForm.effective_date"
                type="date"
                class="w-full text-xs px-3 py-2 border border-[#E1E5E8] rounded-[3px] focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-[#182533] mb-1">Regulatory Document (PDF or TXT) *</label>
            <input
              type="file"
              accept=".pdf,.txt"
              required
              @change="onFileChange"
              class="w-full text-xs text-[#526173] file:mr-3 file:py-1.5 file:px-3 file:rounded-[3px] file:border file:border-[#E1E5E8] file:text-xs file:font-semibold file:bg-[#F6F5F0] file:text-[#182533] hover:file:bg-[#E1E5E8] font-mono"
            />
            <p class="text-xs text-[#526173] mt-1 font-mono">Maximum 25MB. PDF text will be extracted page by page.</p>
          </div>

          <div v-if="uploadError" class="p-3 bg-[#FDF1F2] border border-[#F5C2C6] rounded-[3px] text-xs text-[#B33A42] font-mono">
            {{ uploadError }}
          </div>

          <div class="pt-3 border-t border-[#E1E5E8] flex items-center justify-end gap-2">
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
