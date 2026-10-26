<template>
  <DashboardLayout
    roleBadgeText="Analyst Workspace"
    operatorName="Maya Sen"
    pageTitle="Regulatory Ingestion & Obligation Traceability"
    pageSubtitle="Ingest authentic circulars, verify extracted obligations against cited source text, and certify applicability before policy mapping."
    :metricCards="metricCards"
    :moduleTabs="moduleTabs"
    v-model:activeTab="activeTab"
  >
    <template #header-actions>
      <AppButton variant="primary" size="sm" @click="activeTab = 'module-a'; showUploadModal = true">
        <AppIcon name="plus" :size="14" />
        Ingest Circular
      </AppButton>
      <AppButton variant="outline" size="sm" @click="activeTab = 'module-b'">
        <AppIcon name="obligation" :size="14" />
        Obligations Queue
      </AppButton>
    </template>

    <!-- ======================================================== -->
    <!-- MODULE A: CIRCULAR LIBRARY AND UPLOAD                   -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'module-a'" class="space-y-5">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module A: Circular Library & Ingestion</h2>
          <p class="text-xs text-[#526173]">Filter regulatory circulars, inspect page-level provenance, and upload new publications.</p>
        </div>
        <AppButton variant="primary" size="sm" @click="showUploadModal = true">
          <AppIcon name="plus" :size="13" />
          Upload Document
        </AppButton>
      </div>

      <!-- Filters Bar -->
      <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <AppIcon name="search" :size="13" class="absolute left-3 top-1/2 -translate-y-1/2 text-[#526173]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search circulars by title or reference..."
            class="w-full text-xs pl-8 pr-3 py-1.5 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] placeholder-[#526173]/60 focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto">
          <select
            v-model="selectedAuthority"
            class="text-xs bg-white border border-[#E1E5E8] rounded-[3px] px-3 py-1.5 text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
          >
            <option value="">All Regulatory Authorities</option>
            <option value="Reserve Bank of India">Reserve Bank of India (RBI)</option>
            <option value="European Banking Authority">European Banking Authority (EBA)</option>
            <option value="FinCEN">FinCEN</option>
            <option value="Securities and Exchange Commission">Securities and Exchange Commission (SEC)</option>
          </select>
        </div>
      </div>

      <!-- Circulars Table -->
      <AppCard noPadding>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-[10px] font-mono">
                <th class="px-4 py-2.5 font-semibold">Document Title / Ref</th>
                <th class="px-4 py-2.5 font-semibold">Authority</th>
                <th class="px-4 py-2.5 font-semibold">Publication Date</th>
                <th class="px-4 py-2.5 font-semibold">Effective Date</th>
                <th class="px-4 py-2.5 font-semibold">Pages / Obligations</th>
                <th class="px-4 py-2.5 font-semibold">Status</th>
                <th class="px-4 py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E5E8]">
              <tr
                v-for="c in filteredCirculars"
                :key="c.id"
                class="hover:bg-[#F6F5F0]/60 transition-colors"
              >
                <td class="px-4 py-3">
                  <div class="font-semibold text-[#182533] flex items-center gap-1.5">
                    <AppIcon name="file-text" :size="13" class="text-[#167D83] flex-shrink-0" />
                    <span>{{ c.title }}</span>
                  </div>
                  <div class="text-[11px] text-[#526173] font-mono mt-0.5">{{ c.circular_number || c.filename }}</div>
                </td>
                <td class="px-4 py-3 font-medium text-[#182533]">{{ c.source_authority }}</td>
                <td class="px-4 py-3 font-mono text-[#526173]">{{ c.publication_date || 'N/A' }}</td>
                <td class="px-4 py-3 font-mono text-[#526173]">{{ c.effective_date || 'Immediate' }}</td>
                <td class="px-4 py-3">
                  <span class="font-mono text-[#182533] font-medium">{{ c.page_count }} pages</span>
                  <span class="text-[#526173] mx-1">·</span>
                  <span class="font-mono text-[#167D83] font-semibold">{{ c.obligations_count || 0 }} obligations</span>
                </td>
                <td class="px-4 py-3">
                  <AppBadge :variant="c.status === 'PARSED' ? 'success' : 'warning'">
                    {{ c.status }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <AppButton variant="outline" size="sm" @click="previewCircular(c)">
                    <AppIcon name="eye" :size="12" />
                    Preview
                  </AppButton>
                </td>
              </tr>
              <tr v-if="filteredCirculars.length === 0">
                <td colspan="7" class="p-8 text-center text-[#526173] text-xs">
                  No circular documents match your search criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE B: DOCUMENT AND OBLIGATION REVIEW                 -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-b'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module B: Document & Obligation Review</h2>
          <p class="text-xs text-[#526173]">Verify conditions, actors, and thresholds extracted from regulatory mandates.</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            v-for="status in ['ALL', 'PENDING', 'ACCEPTED', 'UNRESOLVED']"
            :key="status"
            @click="obligationFilter = status"
            class="px-2.5 py-1 text-xs rounded-[3px] border font-mono transition-colors"
            :class="obligationFilter === status ? 'bg-[#14263D] text-white border-[#14263D] font-medium' : 'bg-white border-[#E1E5E8] text-[#526173] hover:bg-[#F6F5F0]'"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Obligations List -->
        <div class="lg:col-span-7 space-y-3">
          <div
            v-for="ob in filteredObligations"
            :key="ob.id"
            @click="selectedObligation = ob"
            class="p-3.5 rounded-[3px] border bg-white cursor-pointer transition-all hover:border-[#167D83]/50 shadow-2xs"
            :class="selectedObligation?.id === ob.id ? 'border-[#167D83] ring-1 ring-[#167D83] bg-[#167D83]/5' : 'border-[#E1E5E8]'"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-xs font-bold text-[#14263D]">{{ ob.obligation_code }}</span>
              <div class="flex items-center gap-1.5">
                <AppBadge :variant="ob.review_status === 'ACCEPTED' ? 'success' : ob.review_status === 'PENDING' ? 'warning' : 'neutral'">
                  {{ ob.review_status }}
                </AppBadge>
                <AppBadge :variant="ob.applicability === 'APPLICABLE' ? 'teal' : 'neutral'">
                  {{ ob.applicability }}
                </AppBadge>
              </div>
            </div>

            <h4 class="text-xs font-semibold text-[#182533] mt-2">{{ ob.title }}</h4>
            <p class="text-[11px] text-[#526173] mt-1 line-clamp-2 italic font-sans leading-relaxed">
              "{{ ob.extracted_text }}"
            </p>

            <div class="mt-3 pt-2 border-t border-[#E1E5E8] flex items-center justify-between text-[11px] text-[#526173]">
              <span>Page Ref: <strong class="text-[#182533] font-mono">Page {{ ob.source_page }}</strong></span>
              <span v-if="ob.policy_code" class="font-mono text-[#167D83] font-medium">{{ ob.policy_code }}</span>
              <span v-else class="text-[#AD741B] font-medium">Unmapped Policy</span>
            </div>
          </div>
        </div>

        <!-- Obligation Details & Action Panel -->
        <div class="lg:col-span-5">
          <AppCard v-if="selectedObligation" title="Obligation Review Panel" subtitle="Certify regulatory conditions and reviewer draft status" noPadding>
            <div class="p-4 space-y-4 text-xs">
              <div>
                <div class="text-[10px] uppercase font-semibold text-[#526173] font-mono">Obligation Code & Title</div>
                <div class="font-mono font-bold text-[#14263D] text-sm mt-0.5">{{ selectedObligation.obligation_code }}</div>
                <div class="font-semibold text-[#182533] mt-1">{{ selectedObligation.title }}</div>
              </div>

              <div class="p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] space-y-2">
                <div class="text-[10px] uppercase font-semibold text-[#526173] font-mono">Extracted Source Clause</div>
                <p class="text-[11px] text-[#182533] italic font-sans leading-relaxed">
                  "{{ selectedObligation.extracted_text }}"
                </p>
                <div class="text-[10px] text-[#526173] flex items-center justify-between pt-1 border-t border-[#E1E5E8] font-mono">
                  <span>Source Span: {{ selectedObligation.source_span || 'Section 3' }}</span>
                  <span>Page {{ selectedObligation.source_page }}</span>
                </div>
              </div>

              <!-- Conditions & Thresholds -->
              <div class="grid grid-cols-2 gap-2 text-[11px]">
                <div class="p-2.5 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <span class="text-[10px] uppercase text-[#526173] font-semibold font-mono">Actor / Entity</span>
                  <div class="font-medium text-[#182533] mt-0.5">{{ selectedObligation.actor || 'Regulated Entity' }}</div>
                </div>
                <div class="p-2.5 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <span class="text-[10px] uppercase text-[#526173] font-semibold font-mono">Action / Threshold</span>
                  <div class="font-medium text-[#182533] mt-0.5">{{ selectedObligation.threshold || 'Enhanced RWA' }}</div>
                </div>
              </div>

              <!-- Reviewer Draft Notes -->
              <div>
                <label class="block text-[11px] font-semibold text-[#182533] uppercase mb-1 font-mono">Reviewer Notes & Clarifications</label>
                <textarea
                  v-model="reviewerDraftNotes"
                  rows="3"
                  class="w-full text-xs p-2.5 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
                  placeholder="Record verification notes or regulatory interpretation..."
                ></textarea>
              </div>

              <!-- Quick Status Update Actions -->
              <div class="pt-2 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  <AppButton
                    variant="primary"
                    size="sm"
                    customClass="flex-1"
                    @click="markObligationReviewed('ACCEPTED')"
                  >
                    <AppIcon name="check" :size="13" />
                    Accept & Mark Reviewed
                  </AppButton>
                  <AppButton
                    variant="outline"
                    size="sm"
                    customClass="flex-1"
                    @click="markObligationReviewed('UNRESOLVED')"
                  >
                    Flag Unresolved
                  </AppButton>
                </div>

                <div v-if="reviewActionFeedback" class="p-2 bg-[#247653]/10 border border-[#247653]/30 rounded-[3px] text-[11px] text-[#247653] text-center font-medium">
                  {{ reviewActionFeedback }}
                </div>
              </div>
            </div>
          </AppCard>

          <div v-else class="p-8 bg-white border border-[#E1E5E8] rounded-[3px] text-center text-[#526173] text-xs">
            Select an obligation from the left to inspect details and update review status.
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE C: SOURCE EVIDENCE VIEWER                         -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-c'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module C: Source Evidence Viewer</h2>
          <p class="text-xs text-[#526173]">Page-level provenance, cryptographic hash verification, and highlighted citation excerpts.</p>
        </div>
        <div class="flex items-center gap-2">
          <AppButton
            variant="outline"
            size="sm"
            :disabled="mockStore.activeEvidenceIndex === 0"
            @click="mockStore.setEvidenceIndex(mockStore.activeEvidenceIndex - 1)"
          >
            ← Previous Evidence
          </AppButton>
          <span class="text-xs font-mono text-[#526173]">
            {{ mockStore.activeEvidenceIndex + 1 }} / {{ mockStore.evidence.length }}
          </span>
          <AppButton
            variant="outline"
            size="sm"
            :disabled="mockStore.activeEvidenceIndex >= mockStore.evidence.length - 1"
            @click="mockStore.setEvidenceIndex(mockStore.activeEvidenceIndex + 1)"
          >
            Next Evidence →
          </AppButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Left: Document Context & Provenance Excerpt -->
        <div class="lg:col-span-8 space-y-4">
          <AppCard title="Regulatory Source Citation" subtitle="Direct excerpt from authentic authority publication" noPadding>
            <div class="p-3 bg-[#F6F5F0] border-b border-[#E1E5E8] flex items-center justify-between text-xs">
              <div class="flex items-center gap-2 font-mono">
                <span class="font-bold text-[#14263D]">{{ mockStore.currentEvidence.circular_ref }}</span>
                <span class="text-[#526173]">·</span>
                <span class="text-[#167D83] font-semibold">{{ mockStore.currentEvidence.obligation_code }}</span>
              </div>
              <span class="px-2 py-0.5 bg-white border border-[#E1E5E8] rounded-[3px] text-[11px] font-mono text-[#14263D]">
                Page {{ mockStore.currentEvidence.page_number }}
              </span>
            </div>

            <div class="p-4 space-y-4">
              <!-- Highlighted Excerpt -->
              <div class="p-3.5 bg-[#167D83]/5 border border-[#167D83]/20 rounded-[3px] space-y-2">
                <div class="flex items-center justify-between text-xs font-semibold text-[#14263D]">
                  <span class="flex items-center gap-1.5">
                    <AppIcon name="file-text" :size="13" class="text-[#167D83]" />
                    {{ mockStore.currentEvidence.section_title }}
                  </span>
                  <span class="font-mono text-[10px] text-[#526173]">SHA256: {{ mockStore.currentEvidence.hash.substring(0, 12) }}...</span>
                </div>

                <blockquote class="text-xs text-[#182533] leading-relaxed pl-3 border-l-2 border-[#167D83] italic font-sans py-1">
                  "{{ mockStore.currentEvidence.highlighted_text }}"
                </blockquote>

                <div class="text-[11px] text-[#526173] pt-2 border-t border-[#167D83]/15">
                  <span class="font-semibold text-[#182533]">Surrounding Context: </span>
                  {{ mockStore.currentEvidence.context_paragraph }}
                </div>
              </div>

              <!-- Evidence Verification Matrix -->
              <div class="grid grid-cols-3 gap-3 text-xs">
                <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <div class="text-[10px] text-[#526173] uppercase font-semibold font-mono">Extraction Confidence</div>
                  <div class="text-sm font-bold text-[#247653] mt-0.5 font-mono">
                    {{ (mockStore.currentEvidence.confidence * 100).toFixed(0) }}% Verified
                  </div>
                </div>

                <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <div class="text-[10px] text-[#526173] uppercase font-semibold font-mono">Risk Classification</div>
                  <div class="text-sm font-bold mt-0.5 font-mono" :class="mockStore.currentEvidence.risk_level === 'HIGH' ? 'text-[#B33A42]' : 'text-[#14263D]'">
                    {{ mockStore.currentEvidence.risk_level }} RISK
                  </div>
                </div>

                <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <div class="text-[10px] text-[#526173] uppercase font-semibold font-mono">Timestamp</div>
                  <div class="text-[11px] font-mono text-[#182533] mt-0.5 truncate">
                    {{ new Date(mockStore.currentEvidence.extracted_at).toLocaleDateString() }}
                  </div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Right: Evidence Records Navigation List -->
        <div class="lg:col-span-4 space-y-3">
          <AppCard title="Evidence Library" subtitle="Click to inspect citation details" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div
                v-for="(ev, idx) in mockStore.evidence"
                :key="ev.id"
                @click="mockStore.setEvidenceIndex(idx)"
                class="p-3 text-xs cursor-pointer transition-colors"
                :class="mockStore.activeEvidenceIndex === idx ? 'bg-[#167D83]/10 border-l-2 border-[#167D83]' : 'hover:bg-[#F6F5F0]'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-[#14263D]">{{ ev.obligation_code }}</span>
                  <span class="font-mono text-[10px] text-[#526173]">Page {{ ev.page_number }}</span>
                </div>
                <div class="font-medium text-[#182533] mt-1 truncate">{{ ev.section_title }}</div>
                <div class="text-[11px] text-[#526173] mt-0.5 line-clamp-1 italic font-sans">
                  "{{ ev.highlighted_text }}"
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE D: APPLICABILITY ASSESSMENT                       -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-d'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module D: Applicability Assessment</h2>
          <p class="text-xs text-[#526173]">Formally determine if an extracted obligation applies to the institution's lending or compliance operations.</p>
        </div>
        <AppButton variant="primary" size="sm" @click="saveApplicabilityAssessment">
          <AppIcon name="check" :size="13" />
          Save & Submit Assessment
        </AppButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Requirements Awaiting Assessment -->
        <div class="lg:col-span-7 space-y-3">
          <AppCard title="Extracted Requirements Queue" subtitle="Select a requirement to perform applicability triage" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div
                v-for="ob in mockStore.obligations"
                :key="ob.id"
                @click="selectedAssessmentObligation = ob; assessmentStatus = ob.applicability; assessmentReasoning = ob.reviewer_notes || ''"
                class="p-3.5 text-xs cursor-pointer transition-colors"
                :class="selectedAssessmentObligation?.id === ob.id ? 'bg-[#167D83]/10 border-l-2 border-[#167D83]' : 'hover:bg-[#F6F5F0]'"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-[#14263D]">{{ ob.obligation_code }}</span>
                  <AppBadge :variant="ob.applicability === 'APPLICABLE' ? 'success' : ob.applicability === 'UNRESOLVED' ? 'warning' : 'neutral'">
                    {{ ob.applicability }}
                  </AppBadge>
                </div>
                <div class="font-semibold text-[#182533] mt-1">{{ ob.title }}</div>
                <div class="text-[11px] text-[#526173] mt-1">
                  Actor: <strong class="text-[#182533]">{{ ob.actor || 'Commercial Banks' }}</strong> · Deadline: {{ ob.deadline || 'Immediate' }}
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Assessment Form Panel -->
        <div class="lg:col-span-5">
          <AppCard v-if="selectedAssessmentObligation" title="Applicability Evaluation" subtitle="Formal institutional determination" noPadding>
            <div class="p-4 space-y-4 text-xs">
              <div>
                <span class="text-[10px] text-[#526173] uppercase font-semibold font-mono">Requirement Code</span>
                <div class="font-mono font-bold text-[#14263D] text-sm mt-0.5">{{ selectedAssessmentObligation.obligation_code }}</div>
                <div class="font-medium text-[#182533] mt-1">{{ selectedAssessmentObligation.title }}</div>
              </div>

              <!-- Applicability Status Selection -->
              <div>
                <label class="block text-[11px] font-semibold text-[#182533] uppercase mb-1.5 font-mono">Applicability Determination</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    @click="assessmentStatus = 'APPLICABLE'"
                    class="py-2 px-1 text-center text-xs rounded-[3px] border font-mono transition-all"
                    :class="assessmentStatus === 'APPLICABLE' ? 'bg-[#247653]/10 border-[#247653] text-[#247653] font-bold ring-1 ring-[#247653]' : 'bg-white border-[#E1E5E8] text-[#526173]'"
                  >
                    Applicable
                  </button>
                  <button
                    type="button"
                    @click="assessmentStatus = 'NOT_APPLICABLE'"
                    class="py-2 px-1 text-center text-xs rounded-[3px] border font-mono transition-all"
                    :class="assessmentStatus === 'NOT_APPLICABLE' ? 'bg-[#B33A42]/10 border-[#B33A42] text-[#B33A42] font-bold ring-1 ring-[#B33A42]' : 'bg-white border-[#E1E5E8] text-[#526173]'"
                  >
                    Not Applicable
                  </button>
                  <button
                    type="button"
                    @click="assessmentStatus = 'UNRESOLVED'"
                    class="py-2 px-1 text-center text-xs rounded-[3px] border font-mono transition-all"
                    :class="assessmentStatus === 'UNRESOLVED' ? 'bg-[#AD741B]/10 border-[#AD741B] text-[#AD741B] font-bold ring-1 ring-[#AD741B]' : 'bg-white border-[#E1E5E8] text-[#526173]'"
                  >
                    Unresolved
                  </button>
                </div>
              </div>

              <!-- Reasoning and Comments -->
              <div>
                <label class="block text-[11px] font-semibold text-[#182533] uppercase mb-1.5 font-mono">Institutional Reasoning & Comments</label>
                <textarea
                  v-model="assessmentReasoning"
                  rows="4"
                  class="w-full text-xs p-2.5 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
                  placeholder="State the regulatory scope, product portfolio overlap, or statutory exemptions..."
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="pt-2 flex items-center gap-2">
                <AppButton variant="primary" size="sm" customClass="flex-1" @click="saveApplicabilityAssessment">
                  Save Assessment
                </AppButton>
                <AppButton variant="outline" size="sm" @click="assessmentReasoning = ''">
                  Reset
                </AppButton>
              </div>

              <div v-if="assessmentFeedback" class="p-2 bg-[#247653]/10 border border-[#247653]/30 rounded-[3px] text-[11px] text-[#247653] text-center font-medium">
                {{ assessmentFeedback }}
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE E: POLICY AND RULE MAPPING                        -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-e'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module E: Policy & Rule Mapping</h2>
          <p class="text-xs text-[#526173]">Map certified obligations to internal corporate policies and highlight regulatory discrepancies.</p>
        </div>
        <AppButton variant="primary" size="sm" @click="showMappingModal = true">
          <AppIcon name="mapping" :size="13" />
          Create Policy Mapping
        </AppButton>
      </div>

      <!-- Policy Mappings Table -->
      <AppCard noPadding>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-[10px] font-mono">
                <th class="px-4 py-2.5 font-semibold">Obligation Code</th>
                <th class="px-4 py-2.5 font-semibold">Target Corporate Policy</th>
                <th class="px-4 py-2.5 font-semibold">Match Score</th>
                <th class="px-4 py-2.5 font-semibold">Discrepancy / Gap Status</th>
                <th class="px-4 py-2.5 font-semibold">Rationale & Harmonization</th>
                <th class="px-4 py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E5E8]">
              <tr v-for="map in mockStore.mappings" :key="map.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
                <td class="px-4 py-3 font-mono font-bold text-[#14263D]">
                  {{ getObligationCode(map.obligation_id) }}
                </td>
                <td class="px-4 py-3">
                  <div class="font-semibold text-[#182533]">{{ getPolicyTitle(map.policy_id) }}</div>
                  <div class="text-[11px] font-mono text-[#526173]">{{ map.policy_id }}</div>
                </td>
                <td class="px-4 py-3 font-mono text-[#247653] font-bold">
                  {{ (map.match_score * 100).toFixed(0) }}%
                </td>
                <td class="px-4 py-3">
                  <AppBadge :variant="map.match_type === 'EXACT' ? 'success' : 'warning'">
                    {{ map.match_type === 'EXACT' ? 'ALIGNED' : 'GAP IDENTIFIED' }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3 text-[11px] text-[#526173] max-w-xs">
                  {{ map.rationale }}
                </td>
                <td class="px-4 py-3 text-right">
                  <AppButton variant="outline" size="sm" @click="editMapping(map)">
                    <AppIcon name="edit" :size="12" />
                    Edit
                  </AppButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>

      <!-- Gap Analysis Spotlight -->
      <div class="p-3.5 bg-[#AD741B]/10 border border-[#AD741B]/30 rounded-[3px] text-xs space-y-1.5">
        <div class="flex items-center gap-2 text-[#AD741B] font-bold font-mono">
          <AppIcon name="alert" :size="13" class="text-[#AD741B]" />
          <span>Active Regulatory Discrepancy: POL-CR-001 vs RBI Circular 2026/84</span>
        </div>
        <p class="text-[#182533] text-[11px] leading-relaxed">
          Internal Policy <code class="font-mono bg-white px-1 py-0.5 border border-[#E1E5E8] rounded-[3px]">POL-CR-001</code> specifies a 100% risk weight ceiling for personal loans. The new circular mandates 125%, creating an immediate regulatory gap passed to Rule Engineering for AST reconfiguration.
        </p>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- OVERVIEW TAB (DEFAULT)                                   -->
    <!-- ======================================================== -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Source Excerpt Box -->
        <div class="lg:col-span-7 space-y-4">
          <AppCard title="Regulatory Source Provenance" subtitle="Verifiable text excerpt from authentic authority publication" noPadding>
            <div class="p-3 bg-[#F6F5F0] border-b border-[#E1E5E8] flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="font-bold text-[#14263D]">Reserve Bank of India</span>
                <span class="text-[#526173]">·</span>
                <span class="font-mono text-[#526173]">DOR.STR.REC.57/21.06.001/2026-27</span>
              </div>
              <button @click="activeTab = 'module-c'" class="text-[#167D83] hover:text-[#14263D] font-medium text-xs flex items-center gap-1 transition-colors">
                Open Full Evidence Viewer →
              </button>
            </div>

            <div class="p-4 space-y-4">
              <div class="rounded-[3px] border border-[#E1E5E8] bg-[#F6F5F0]/60 p-3.5 relative">
                <div class="flex items-center justify-between text-xs text-[#182533] mb-2 font-medium">
                  <span class="font-semibold text-[#182533] flex items-center gap-1.5">
                    <AppIcon name="file-text" :size="13" class="text-[#167D83]" />
                    Section 3(a) · Regulatory Mandate
                  </span>
                  <span class="bg-white border border-[#E1E5E8] text-[#14263D] px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono">
                    Page 4
                  </span>
                </div>
                <blockquote class="text-xs text-[#182533] leading-relaxed pl-3 border-l-2 border-[#167D83] bg-white py-2 pr-3 rounded-[3px] italic font-sans">
                  "Risk weight on unsecured consumer credit by scheduled commercial banks is hereby enhanced from 100% to 125%. Credit extended to microfinance loans and self-help groups shall continue to attract the existing 100% risk weight."
                </blockquote>
                <div class="mt-2.5 pt-2 border-t border-[#E1E5E8] flex items-center justify-between text-[11px] text-[#526173]">
                  <span>Effective Date: <strong class="text-[#182533]">November 1, 2026</strong></span>
                  <span class="font-mono text-[#167D83]">Hash: e9c1..8fa3</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <div class="text-[10px] text-[#526173] uppercase font-semibold font-mono">Regulated Entity Class</div>
                  <div class="font-medium text-[#182533] mt-0.5">Commercial Banks & NBFCs</div>
                </div>
                <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
                  <div class="text-[10px] text-[#526173] uppercase font-semibold font-mono">Impacted Credit Category</div>
                  <div class="font-medium text-[#182533] mt-0.5">Unsecured Consumer Lending</div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Right: Recent Triage Activity -->
        <div class="lg:col-span-5 space-y-4">
          <AppCard title="Obligations In Ingestion Triage" subtitle="Extracted obligations awaiting certification" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div
                v-for="ob in mockStore.obligations.slice(0, 4)"
                :key="ob.id"
                @click="activeTab = 'module-b'; selectedObligation = ob"
                class="p-3 hover:bg-[#F6F5F0] cursor-pointer transition-colors"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="font-mono font-bold text-[#14263D]">{{ ob.obligation_code }}</span>
                  <AppBadge :variant="ob.applicability === 'APPLICABLE' ? 'success' : 'warning'">
                    {{ ob.applicability }}
                  </AppBadge>
                </div>
                <div class="text-xs font-semibold text-[#182533] mt-1">{{ ob.title }}</div>
                <div class="text-[10px] text-[#526173] mt-1 flex items-center justify-between font-mono">
                  <span>Page {{ ob.source_page }}</span>
                  <span class="text-[#167D83] font-medium">Review details →</span>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- UPLOAD MODAL WITH FRONTEND FILE PICKER & VALIDATION      -->
    <!-- ======================================================== -->
    <div v-if="showUploadModal" class="fixed inset-0 z-50 overflow-y-auto bg-[#0B1728]/70 backdrop-blur-2xs flex items-center justify-center p-4">
      <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-xl max-w-lg w-full p-5 space-y-4 text-left">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-sm font-bold text-[#14263D]">Ingest Regulatory Publication</h3>
            <p class="text-xs text-[#526173] mt-0.5">Upload a circular document with front-end file validation and simulated parsing.</p>
          </div>
          <button @click="showUploadModal = false" class="text-[#526173] hover:text-[#14263D]">
            <AppIcon name="close" :size="16" />
          </button>
        </div>

        <form @submit.prevent="handleUploadSubmit" class="space-y-3.5 text-xs">
          <!-- File Picker -->
          <div>
            <label class="block text-[11px] font-semibold text-[#182533] uppercase mb-1 font-mono">
              Document File (.pdf or .docx only, max 25MB) <span class="text-[#B33A42]">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.docx"
              @change="onFileSelected"
              class="w-full text-xs p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] file:mr-3 file:py-1 file:px-2.5 file:rounded-[3px] file:border-0 file:text-xs file:font-semibold file:bg-[#14263D] file:text-white hover:file:bg-[#167D83] file:transition-colors"
            />
            <p v-if="uploadFile" class="text-[10px] text-[#247653] mt-1 font-mono">
              Selected: {{ uploadFile.name }} ({{ (uploadFile.size / (1024 * 1024)).toFixed(2) }} MB)
            </p>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-[#182533] uppercase mb-1 font-mono">Document Title <span class="text-[#B33A42]">*</span></label>
            <input
              v-model="uploadTitle"
              type="text"
              required
              class="w-full p-2 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
              placeholder="e.g. Master Direction on Consumer Credit Exposure"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-[#182533] uppercase mb-1 font-mono">Authority</label>
              <select v-model="uploadAuthority" class="w-full p-2 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]">
                <option value="Reserve Bank of India">Reserve Bank of India</option>
                <option value="European Banking Authority">European Banking Authority</option>
                <option value="FinCEN">FinCEN</option>
                <option value="Securities and Exchange Commission">Securities and Exchange Commission</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-[#182533] uppercase mb-1 font-mono">Circular Number</label>
              <input
                v-model="uploadNumber"
                type="text"
                class="w-full p-2 bg-white border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
                placeholder="e.g. DOR.STR.REC.99/2026"
              />
            </div>
          </div>

          <!-- Progress Simulation -->
          <div v-if="uploadProgress > 0" class="space-y-1 pt-1">
            <div class="flex items-center justify-between text-[10px] font-mono text-[#526173]">
              <span>Ingesting & Parsing Document...</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <div class="w-full h-1.5 bg-[#E1E5E8] rounded-full overflow-hidden">
              <div class="h-full bg-[#167D83] transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
          </div>

          <p v-if="uploadError" class="text-[11px] text-[#B33A42] font-medium">{{ uploadError }}</p>

          <div class="pt-2 flex items-center justify-end gap-2 border-t border-[#E1E5E8]">
            <AppButton variant="outline" size="sm" type="button" @click="showUploadModal = false">
              Cancel
            </AppButton>
            <AppButton variant="primary" size="sm" type="submit" :loading="uploadProgress > 0">
              Start Ingestion
            </AppButton>
          </div>
        </form>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- PREVIEW CIRCULAR MODAL                                   -->
    <!-- ======================================================== -->
    <div v-if="previewDoc" class="fixed inset-0 z-50 overflow-y-auto bg-[#0B1728]/70 backdrop-blur-2xs flex items-center justify-center p-4">
      <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-xl max-w-xl w-full p-5 space-y-4 text-left">
        <div class="flex items-start justify-between">
          <div>
            <span class="text-[10px] font-mono text-[#167D83] font-bold uppercase">{{ previewDoc.source_authority }}</span>
            <h3 class="text-sm font-bold text-[#14263D]">{{ previewDoc.title }}</h3>
            <p class="text-xs text-[#526173] font-mono mt-0.5">{{ previewDoc.circular_number || previewDoc.filename }}</p>
          </div>
          <button @click="previewDoc = null" class="text-[#526173] hover:text-[#14263D]">
            <AppIcon name="close" :size="16" />
          </button>
        </div>

        <div class="p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-xs space-y-2">
          <div class="text-[10px] font-semibold text-[#526173] uppercase font-mono">Extracted Publication Text Summary</div>
          <p class="text-[#182533] leading-relaxed italic font-sans">
            {{ previewDoc.extracted_text || 'Document parsed successfully with page-level cryptographic provenance.' }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="p-2.5 bg-white border border-[#E1E5E8] rounded-[3px]">
            <span class="text-[10px] text-[#526173] uppercase font-mono">File Hash</span>
            <div class="font-mono text-[#182533] mt-0.5 truncate">{{ previewDoc.file_hash || 'SHA256 verified' }}</div>
          </div>
          <div class="p-2.5 bg-white border border-[#E1E5E8] rounded-[3px]">
            <span class="text-[10px] text-[#526173] uppercase font-mono">Effective Date</span>
            <div class="font-mono text-[#182533] mt-0.5">{{ previewDoc.effective_date || 'November 1, 2026' }}</div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <AppButton variant="primary" size="sm" @click="previewDoc = null">
            Close Preview
          </AppButton>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMockDataStore } from '../../stores/mockDataStore';
import type { Circular, Obligation, ObligationMapping } from '../../types';
import DashboardLayout, { type MetricCardConfig, type ModuleTabConfig } from '../../components/dashboard/DashboardLayout.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const mockStore = useMockDataStore();

const activeTab = ref('overview');
const searchQuery = ref('');
const selectedAuthority = ref('');
const obligationFilter = ref('ALL');

const selectedObligation = ref<Obligation | null>(mockStore.obligations[0] || null);
const reviewerDraftNotes = ref('');
const reviewActionFeedback = ref('');

const selectedAssessmentObligation = ref<Obligation | null>(mockStore.obligations[0] || null);
const assessmentStatus = ref<Obligation['applicability']>('APPLICABLE');
const assessmentReasoning = ref('');
const assessmentFeedback = ref('');

// Upload state
const showUploadModal = ref(false);
const uploadTitle = ref('');
const uploadAuthority = ref('Reserve Bank of India');
const uploadNumber = ref('');
const uploadFile = ref<File | null>(null);
const uploadError = ref('');
const uploadProgress = ref(0);

// Preview state
const previewDoc = ref<Circular | null>(null);
const showMappingModal = ref(false);

const moduleTabs: ModuleTabConfig[] = [
  { id: 'overview', label: 'Triage Overview', icon: 'overview' },
  { id: 'module-a', label: 'A. Circular Library & Upload', icon: 'circular', badge: mockStore.circulars.length },
  { id: 'module-b', label: 'B. Obligation Review', icon: 'obligation', badge: mockStore.obligations.length },
  { id: 'module-c', label: 'C. Source Evidence', icon: 'file-text' },
  { id: 'module-d', label: 'D. Applicability Assessment', icon: 'check' },
  { id: 'module-e', label: 'E. Policy & Rule Mapping', icon: 'mapping', badge: mockStore.mappings.length },
];

const metricCards = computed<MetricCardConfig[]>(() => [
  {
    title: 'Active Circulars',
    value: mockStore.analystMetrics.active_circulars,
    subtitle: 'RBI, EBA & FinCEN',
    tag: 'Live Ingestion',
  },
  {
    title: 'Awaiting Clarification',
    value: mockStore.analystMetrics.unresolved_applicability,
    subtitle: 'Unresolved applicability',
    valueClass: 'text-[#B7791F]',
    tag: 'Action Required',
    tagClass: 'bg-amber-100 text-amber-800',
  },
  {
    title: 'Certified Applicable',
    value: mockStore.analystMetrics.applicable_obligations,
    subtitle: 'Passed to rule engineering',
    valueClass: 'text-[#247653]',
  },
  {
    title: 'Policy Gaps Detected',
    value: mockStore.analystMetrics.gaps_detected,
    subtitle: 'Harmonization needed',
    valueClass: 'text-[#167D83]',
    tag: 'Discrepancy',
  },
]);

const filteredCirculars = computed(() => {
  let list = [...mockStore.circulars];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(c => c.title.toLowerCase().includes(q) || (c.circular_number && c.circular_number.toLowerCase().includes(q)));
  }
  if (selectedAuthority.value) {
    list = list.filter(c => c.source_authority === selectedAuthority.value);
  }
  return list;
});

const filteredObligations = computed(() => {
  let list = [...mockStore.obligations];
  if (obligationFilter.value !== 'ALL') {
    list = list.filter(o => o.review_status === obligationFilter.value || o.applicability === obligationFilter.value);
  }
  return list;
});

const getObligationCode = (obligationId: string) => {
  const o = mockStore.obligations.find(ob => ob.id === obligationId);
  return o ? o.obligation_code : obligationId;
};

const getPolicyTitle = (policyId?: string) => {
  if (!policyId) return 'Unassigned';
  const p = mockStore.policies.find(pol => pol.id === policyId);
  return p ? p.title : policyId;
};

const previewCircular = (c: Circular) => {
  previewDoc.value = c;
};

const onFileSelected = (e: Event) => {
  uploadError.value = '';
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      uploadError.value = 'Invalid file type. Supported formats are .pdf and .docx only.';
      uploadFile.value = null;
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      uploadError.value = 'File exceeds maximum supported size limit of 25MB.';
      uploadFile.value = null;
      return;
    }
    uploadFile.value = file;
    if (!uploadTitle.value) {
      uploadTitle.value = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
    }
  }
};

const handleUploadSubmit = () => {
  if (!uploadFile.value) {
    uploadError.value = 'Please select a supported document file (.pdf or .docx).';
    return;
  }

  uploadError.value = '';
  uploadProgress.value = 10;

  const interval = setInterval(() => {
    uploadProgress.value += 30;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        mockStore.uploadCircular({
          title: uploadTitle.value,
          source_authority: uploadAuthority.value,
          circular_number: uploadNumber.value,
          publication_date: new Date().toISOString().split('T')[0],
          effective_date: '2026-11-01',
          fileName: uploadFile.value!.name,
          fileSizeMb: Number((uploadFile.value!.size / (1024 * 1024)).toFixed(2)),
        });

        uploadProgress.value = 0;
        showUploadModal.value = false;
        uploadTitle.value = '';
        uploadNumber.value = '';
        uploadFile.value = null;
      }, 300);
    }
  }, 200);
};

const markObligationReviewed = (status: Obligation['review_status']) => {
  if (!selectedObligation.value) return;
  mockStore.updateObligationStatus(selectedObligation.value.id, status, reviewerDraftNotes.value);
  reviewActionFeedback.value = `Obligation ${selectedObligation.value.obligation_code} successfully updated to ${status}.`;
  setTimeout(() => {
    reviewActionFeedback.value = '';
  }, 2500);
};

const saveApplicabilityAssessment = () => {
  if (!selectedAssessmentObligation.value) return;
  mockStore.updateApplicability(selectedAssessmentObligation.value.id, assessmentStatus.value, assessmentReasoning.value);
  assessmentFeedback.value = `Certified as ${assessmentStatus.value} for ${selectedAssessmentObligation.value.obligation_code}.`;
  setTimeout(() => {
    assessmentFeedback.value = '';
  }, 2500);
};

const editMapping = (map: ObligationMapping) => {
  const newRationale = prompt('Edit Policy Mapping Rationale:', map.rationale || '');
  if (newRationale !== null) {
    mockStore.saveMapping(map.obligation_id, map.policy_id || 'pol-cr-001', newRationale, map.match_type);
  }
};
</script>
