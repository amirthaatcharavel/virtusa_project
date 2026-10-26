<template>
  <DashboardLayout
    roleBadgeText="Rule Engineering Lab"
    operatorName="Arun Patel"
    pageTitle="Rule Engineering & Deterministic Execution Lab"
    pageSubtitle="Translate certified regulatory obligations into pure functional JSON Rule AST definitions, execute regression suites, and run portfolio simulations."
    :metricCards="metricCards"
    :moduleTabs="moduleTabs"
    v-model:activeTab="activeTab"
  >
    <template #header-actions>
      <AppButton variant="primary" size="sm" @click="activeTab = 'module-b'">
        <AppIcon name="rules" :size="14" />
        Rule Studio DSL
      </AppButton>
      <AppButton variant="outline" size="sm" @click="activeTab = 'module-c'; handleRunTests()">
        <AppIcon name="play" :size="14" />
        Run Test Lab
      </AppButton>
    </template>

    <!-- ======================================================== -->
    <!-- MODULE A: ENGINEERING DASHBOARD & ASSIGNED WORK          -->
    <!-- ======================================================== -->
    <div v-if="activeTab === 'module-a'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module A: Engineering Workload & Backlog</h2>
          <p class="text-xs text-[#526173]">Track development assignments for rule implementation, AST clauses, and condition guards.</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button
            v-for="st in ['ALL', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']"
            :key="st"
            @click="taskFilter = st"
            class="px-2.5 py-1 text-xs rounded-[3px] border font-mono transition-colors"
            :class="taskFilter === st ? 'bg-[#14263D] text-white border-[#14263D] font-medium' : 'bg-white border-[#E1E5E8] text-[#526173] hover:bg-[#F6F5F0]'"
          >
            {{ st }}
          </button>
        </div>
      </div>

      <!-- Task Summary Metric Sub-cards -->
      <div class="grid grid-cols-3 gap-3">
        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <span class="text-[10px] uppercase font-bold text-[#526173] font-mono">Assigned Work</span>
          <div class="text-lg font-bold text-[#14263D] font-mono mt-0.5">{{ mockStore.taskStats.assigned }} Tasks</div>
        </div>
        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <span class="text-[10px] uppercase font-bold text-[#AD741B] font-mono">In Development</span>
          <div class="text-lg font-bold text-[#AD741B] font-mono mt-0.5">{{ mockStore.taskStats.inProgress }} Active</div>
        </div>
        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <span class="text-[10px] uppercase font-bold text-[#247653] font-mono">Completed & Tested</span>
          <div class="text-lg font-bold text-[#247653] font-mono mt-0.5">{{ mockStore.taskStats.completed }} Ready</div>
        </div>
      </div>

      <!-- Tasks Workload Table -->
      <AppCard noPadding>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-[10px] font-mono">
                <th class="px-4 py-2.5 font-semibold">Priority</th>
                <th class="px-4 py-2.5 font-semibold">Task Title & Target Rule</th>
                <th class="px-4 py-2.5 font-semibold">Owner</th>
                <th class="px-4 py-2.5 font-semibold">Due Date</th>
                <th class="px-4 py-2.5 font-semibold">Status</th>
                <th class="px-4 py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E5E8]">
              <tr v-for="t in filteredTasks" :key="t.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
                <td class="px-4 py-3">
                  <AppBadge :variant="t.priority === 'CRITICAL' ? 'error' : t.priority === 'HIGH' ? 'warning' : 'navy'">
                    {{ t.priority }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3">
                  <div class="font-semibold text-[#182533]">{{ t.title }}</div>
                  <div class="text-[11px] font-mono text-[#167D83] mt-0.5 font-medium">{{ t.rule_code }}</div>
                </td>
                <td class="px-4 py-3 font-medium text-[#182533]">{{ t.owner }}</td>
                <td class="px-4 py-3 font-mono text-[#526173]">{{ t.due_date }}</td>
                <td class="px-4 py-3">
                  <AppBadge :variant="t.status === 'COMPLETED' ? 'success' : t.status === 'IN_PROGRESS' ? 'teal' : 'neutral'">
                    {{ t.status }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <select
                    :value="t.status"
                    @change="onTaskStatusChange(t.id, $event)"
                    class="text-xs bg-white border border-[#E1E5E8] rounded-[3px] px-2 py-1 text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
                  >
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE B: RULE STUDIO AND VERSION HISTORY                -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-b'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module B: Rule Studio & AST Version History</h2>
          <p class="text-xs text-[#526173]">Author pure functional JSON Abstract Syntax Trees, validate against evaluator schemas, and inspect diffs.</p>
        </div>
        <div class="flex items-center gap-2">
          <AppButton variant="outline" size="sm" @click="showVersionDiffModal = true">
            <AppIcon name="audit" :size="13" />
            Compare v1.0.0 vs v1.1.0 (Diff)
          </AppButton>
          <AppButton variant="primary" size="sm" @click="saveRuleDraft">
            <AppIcon name="check" :size="13" />
            Save Draft Version
          </AppButton>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <!-- Rule Editor (AST JSON & Condition Builder) -->
        <div class="lg:col-span-7 space-y-4">
          <AppCard title="Candidate Rule DSL Specification" subtitle="Pure functional Abstract Syntax Tree without arbitrary code execution" noPadding>
            <div class="p-3 bg-[#F6F5F0] border-b border-[#E1E5E8] flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="font-mono text-[#14263D] font-bold">RULE-CR-2026-01</span>
                <span class="text-[#526173]">·</span>
                <span class="font-mono text-xs text-[#167D83] bg-[#167D83]/10 border border-[#167D83]/20 px-2 py-0.5 rounded-[3px] font-semibold">v1.1.0-draft</span>
              </div>
              <span class="text-[11px] text-[#247653] font-semibold flex items-center gap-1 font-mono">
                <AppIcon name="check" :size="12" />
                AST Validated
              </span>
            </div>

            <div class="p-4 space-y-3">
              <!-- Readable Condition Logic Breakdown -->
              <div class="p-3.5 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] font-mono text-[11px] text-[#182533] leading-relaxed">
                <span class="text-[#167D83] font-bold">IF</span> loan_type == <span class="text-[#247653] font-semibold">"UNSECURED_PERSONAL_LOAN"</span><br/>
                <span class="text-[#167D83] font-bold">AND</span> borrower_type != <span class="text-[#247653] font-semibold">"MICROFINANCE_SHG"</span><br/>
                <span class="text-[#167D83] font-bold">THEN</span> decision: <span class="text-[#B33A42] font-bold">"ENHANCED_RISK_WEIGHT"</span>, risk_weight: <span class="text-[#182533] font-bold">{{ editableRiskWeight }}%</span><br/>
                <span class="text-[#167D83] font-bold">ELSE</span> decision: <span class="text-[#526173] font-bold">"STANDARD_CARVE_OUT"</span>, risk_weight: <span class="text-[#182533] font-bold">100%</span>
              </div>

              <!-- Editable Rule Configuration Controls -->
              <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px] space-y-3">
                <div class="font-semibold text-xs text-[#182533] font-mono uppercase">Editable Rule Parameters</div>
                <div class="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label class="block text-[11px] font-semibold text-[#526173] mb-1 font-mono">Target Enhanced RWA (%)</label>
                    <input
                      v-model.number="editableRiskWeight"
                      type="number"
                      step="5"
                      min="100"
                      max="200"
                      class="w-full p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] font-mono text-[#182533] font-bold focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-[#526173] mb-1 font-mono">Carve-Out Exemption Type</label>
                    <input
                      v-model="editableCarveOut"
                      type="text"
                      class="w-full p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] font-mono text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-semibold text-[#526173] mb-1 font-mono">Change Summary / Audit Memo</label>
                  <input
                    v-model="editableSummary"
                    type="text"
                    class="w-full p-2 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[#182533] focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
                    placeholder="Describe AST clause updates for independent review..."
                  />
                </div>
              </div>

              <!-- Validation Engine Feedback Notice -->
              <div class="p-3 bg-[#247653]/10 border border-[#247653]/30 rounded-[3px] text-xs text-[#247653] flex items-center gap-2">
                <AppIcon name="check" :size="14" class="text-[#247653] flex-shrink-0" />
                <div>
                  <strong>AST Schema Conforming:</strong> Safe recursive evaluator validated. No <code>eval()</code>, arbitrary loop, or runtime side effects detected.
                </div>
              </div>

              <div v-if="ruleSaveFeedback" class="p-2 bg-[#247653]/10 border border-[#247653]/30 rounded-[3px] text-[11px] text-[#247653] text-center font-medium">
                {{ ruleSaveFeedback }}
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Version History List -->
        <div class="lg:col-span-5 space-y-3">
          <AppCard title="Rule Version History" subtitle="Immutable AST version lineage" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div
                v-for="v in mockStore.ruleVersions"
                :key="v.id"
                class="p-3.5 text-xs hover:bg-[#F6F5F0] transition-colors"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-[#14263D]">{{ v.version_number }}</span>
                  <AppBadge :variant="v.version_number.includes('draft') ? 'warning' : 'success'">
                    {{ v.version_number.includes('draft') ? 'CANDIDATE' : 'DEPLOYED' }}
                  </AppBadge>
                </div>
                <div class="text-[#182533] font-medium mt-1">{{ v.change_summary }}</div>
                <div class="text-[10px] font-mono text-[#526173] mt-1.5 flex items-center justify-between">
                  <span>Created: {{ new Date(v.created_at).toLocaleDateString() }}</span>
                  <span class="text-[#167D83] hover:text-[#14263D] cursor-pointer font-medium" @click="showVersionDiffModal = true">View diff →</span>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE C: TEST LAB AND REGRESSION TESTING                -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-c'" class="space-y-5">
      <!-- Section Header with Demo Label -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module C: Test Lab & Regression Matrix</h2>
            <span class="px-2 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#AD741B]/10 text-[#AD741B] border border-[#AD741B]/30 font-medium">
              Demo Simulation Result
            </span>
          </div>
          <p class="text-xs text-[#526173]">Deterministic regression test suite verifying functional boundary and carve-out assertions.</p>
        </div>
        <AppButton variant="primary" size="sm" :loading="runningTests" @click="handleRunTests">
          <AppIcon name="play" :size="13" />
          Execute Test Suite
        </AppButton>
      </div>

      <!-- Test Execution Simulation Banner -->
      <div v-if="testRunProgress > 0" class="p-3 bg-white border border-[#E1E5E8] rounded-[3px] space-y-1.5">
        <div class="flex items-center justify-between text-xs text-[#526173] font-mono">
          <span>Executing boundary test cases in memory evaluator...</span>
          <span>{{ testRunProgress }}%</span>
        </div>
        <div class="w-full h-1.5 bg-[#E1E5E8] rounded-full overflow-hidden">
          <div class="h-full bg-[#167D83] transition-all duration-200" :style="{ width: `${testRunProgress}%` }"></div>
        </div>
      </div>

      <!-- Test Results Summary Ribbon -->
      <div class="grid grid-cols-3 gap-3 text-xs">
        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <div class="text-[10px] uppercase font-bold text-[#247653] font-mono">Passed Assertions</div>
          <div class="text-lg font-bold text-[#247653] font-mono mt-1">
            {{ mockStore.latestTestRun.passed_tests }} / {{ mockStore.latestTestRun.total_tests }} PASS
          </div>
          <div class="text-[10px] text-[#526173] mt-0.5">100% Pass Rate</div>
        </div>

        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <div class="text-[10px] uppercase font-bold text-[#526173] font-mono">Failed Tests</div>
          <div class="text-lg font-bold text-[#14263D] font-mono mt-1">
            {{ mockStore.latestTestRun.failed_tests }} FAIL
          </div>
          <div class="text-[10px] text-[#526173] mt-0.5">Zero Logic Regressions</div>
        </div>

        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <div class="text-[10px] uppercase font-bold text-[#167D83] font-mono">Target Rule Version</div>
          <div class="text-sm font-bold text-[#14263D] font-mono mt-1 truncate">
            {{ mockStore.latestTestRun.rule_version_id }}
          </div>
          <div class="text-[10px] text-[#526173] font-mono mt-0.5">Tested: {{ new Date(mockStore.latestTestRun.executed_at).toLocaleTimeString() }}</div>
        </div>
      </div>

      <!-- Test Cases List -->
      <AppCard title="Test Suite Execution Matrix" subtitle="Automated regulatory assertions (simulated execution for demonstration)" noPadding>
        <div class="divide-y divide-[#E1E5E8]">
          <div
            v-for="tc in mockStore.testCases"
            :key="tc.id"
            class="p-3.5 text-xs hover:bg-[#F6F5F0] transition-colors"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-[#14263D]">{{ tc.id }}</span>
                <span class="text-[#526173]">·</span>
                <span class="font-semibold text-[#182533]">{{ tc.name }}</span>
              </div>
              <AppBadge variant="success">PASS</AppBadge>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5 p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] text-[11px] font-mono">
              <div>
                <span class="text-[#526173] block mb-0.5 uppercase text-[9px] font-semibold">Input Payload:</span>
                <code class="text-[#182533]">{{ JSON.stringify(tc.input_payload) }}</code>
              </div>
              <div>
                <span class="text-[#526173] block mb-0.5 uppercase text-[9px] font-semibold">Expected Outcome:</span>
                <span class="text-[#247653] font-bold">{{ JSON.stringify(tc.expected_outcome) }}</span>
              </div>
            </div>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE D: IMPACT SIMULATOR & BEFORE/AFTER COMPARISON     -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-d'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module D: Synthetic Impact Simulator</h2>
            <span class="px-2 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#167D83]/10 text-[#167D83] border border-[#167D83]/30 font-medium">
              Simulated Data
            </span>
          </div>
          <p class="text-xs text-[#526173]">Evaluate baseline vs candidate version outcomes on 10,000 anonymized synthetic bank accounts.</p>
        </div>
        <AppButton variant="primary" size="sm" :loading="simulatingImpact" @click="handleSimulateImpact">
          <AppIcon name="simulator" :size="13" />
          Run Simulation
        </AppButton>
      </div>

      <!-- Impact Metrics Summary -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <span class="text-[10px] uppercase font-bold text-[#526173] font-mono">Total Evaluated</span>
          <div class="text-lg font-bold text-[#14263D] font-mono mt-0.5">10,000 Accounts</div>
          <div class="text-[10px] text-[#526173]">Synthetic Retail Portfolio</div>
        </div>
        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <span class="text-[10px] uppercase font-bold text-[#167D83] font-mono">Re-weighted Loans</span>
          <div class="text-lg font-bold text-[#167D83] font-mono mt-0.5">4,380 Loans (43.8%)</div>
          <div class="text-[10px] text-[#167D83] font-medium">+25% Risk Weight Applied</div>
        </div>
        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <span class="text-[10px] uppercase font-bold text-[#247653] font-mono">Exempt Carve-Outs</span>
          <div class="text-lg font-bold text-[#247653] font-mono mt-0.5">5,620 Loans (56.2%)</div>
          <div class="text-[10px] text-[#526173]">Microfinance / Secured</div>
        </div>
        <div class="p-3 bg-white border border-[#E1E5E8] rounded-[3px]">
          <span class="text-[10px] uppercase font-bold text-[#AD741B] font-mono">Estimated RWA Delta</span>
          <div class="text-lg font-bold text-[#AD741B] font-mono mt-0.5">+₹27.50M INR</div>
          <div class="text-[10px] text-[#526173]">Capital Buffer Delta</div>
        </div>
      </div>

      <!-- Before and After Comparison Table -->
      <AppCard title="Differential Record Outcomes (Baseline vs Candidate)" subtitle="Demonstration analysis of simulated loan accounts" noPadding>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-[10px] font-mono">
                <th class="px-4 py-2.5 font-semibold">Record ID</th>
                <th class="px-4 py-2.5 font-semibold">Loan Type & Parameters</th>
                <th class="px-4 py-2.5 font-semibold">Baseline Outcome (v1.0.0)</th>
                <th class="px-4 py-2.5 font-semibold">Candidate Outcome (v1.1.0)</th>
                <th class="px-4 py-2.5 font-semibold">Impact Outcome</th>
                <th class="px-4 py-2.5 font-semibold">Regulatory Reason</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E5E8]">
              <tr
                v-for="diff in mockStore.latestImpactReport.differences"
                :key="diff.record_id"
                class="hover:bg-[#F6F5F0]/60 transition-colors"
              >
                <td class="px-4 py-3 font-mono font-bold text-[#14263D]">{{ diff.record_id }}</td>
                <td class="px-4 py-3">
                  <div class="font-semibold text-[#182533]">{{ diff.input_data.loan_type }}</div>
                  <div class="text-[10px] font-mono text-[#526173]">₹{{ (diff.input_data.amount || 0).toLocaleString() }} · {{ diff.input_data.borrower }}</div>
                </td>
                <td class="px-4 py-3 font-mono">
                  <span class="text-[#526173]">100% RWA (Standard)</span>
                </td>
                <td class="px-4 py-3 font-mono">
                  <span v-if="diff.changed" class="text-[#167D83] font-bold">125% RWA (Enhanced)</span>
                  <span v-else class="text-[#247653] font-bold">100% RWA (Carve-Out)</span>
                </td>
                <td class="px-4 py-3">
                  <AppBadge :variant="diff.changed ? 'warning' : 'success'">
                    {{ diff.changed ? 'INCREASED RWA' : 'UNCHANGED' }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3 text-[11px] text-[#526173] max-w-xs">
                  {{ diff.difference_reason }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- MODULE E: SANDBOX RELEASE AND ROLLBACK                   -->
    <!-- ======================================================== -->
    <div v-else-if="activeTab === 'module-e'" class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xs font-bold text-[#14263D] uppercase tracking-wider font-mono">Module E: Sandbox Deployment & Rollback Gate</h2>
            <span class="px-2 py-0.5 rounded-[3px] text-[10px] font-mono bg-[#14263D]/10 text-[#14263D] border border-[#14263D]/20 font-medium">
              Demo Actions Only
            </span>
          </div>
          <p class="text-xs text-[#526173]">Promote certified rule versions to runtime sandbox or execute zero-downtime rollback.</p>
        </div>
        <div class="flex items-center gap-2">
          <AppButton variant="outline" size="sm" @click="openRollbackModal">
            <AppIcon name="rollback" :size="13" />
            Simulate Rollback
          </AppButton>
          <AppButton variant="primary" size="sm" @click="openDeployModal">
            <AppIcon name="deployments" :size="13" />
            Simulate Sandbox Release
          </AppButton>
        </div>
      </div>

      <!-- Current Sandbox Status Card -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-white border border-[#E1E5E8] rounded-[3px] shadow-2xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#14263D] uppercase font-mono">Active Sandbox Version</span>
            <AppBadge variant="success">SERVING DECISIONS</AppBadge>
          </div>
          <div class="text-lg font-mono font-bold text-[#14263D]">RULE-CR-2026-01 (v1.0.0)</div>
          <p class="text-[11px] text-[#526173]">Baseline flat 100% risk weight currently evaluating shadow transaction feeds.</p>
        </div>

        <div class="p-4 bg-white border border-[#E1E5E8] rounded-[3px] shadow-2xs space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#14263D] uppercase font-mono">Staged Candidate Version</span>
            <AppBadge variant="warning">AWAITING SIGN-OFF</AppBadge>
          </div>
          <div class="text-lg font-mono font-bold text-[#AD741B]">RULE-CR-2026-01 (v1.1.0-draft)</div>
          <p class="text-[11px] text-[#526173]">Blocked by dual-control policy: Requires sign-off by Vikram Mehta before live activation.</p>
        </div>
      </div>

      <!-- Release History Table -->
      <AppCard title="Sandbox Release & Rollback Ledger" subtitle="Immutable log of deployment actions" noPadding>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-[#F6F5F0] text-[#526173] border-b border-[#E1E5E8] uppercase tracking-wider text-[10px] font-mono">
                <th class="px-4 py-2.5 font-semibold">Deployment ID</th>
                <th class="px-4 py-2.5 font-semibold">Rule Version</th>
                <th class="px-4 py-2.5 font-semibold">Environment</th>
                <th class="px-4 py-2.5 font-semibold">Status</th>
                <th class="px-4 py-2.5 font-semibold">Deployed At</th>
                <th class="px-4 py-2.5 font-semibold">Operational Notes</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E1E5E8]">
              <tr v-for="d in mockStore.deployments" :key="d.id" class="hover:bg-[#F6F5F0]/60 transition-colors">
                <td class="px-4 py-3 font-mono font-bold text-[#14263D]">{{ d.id }}</td>
                <td class="px-4 py-3 font-mono font-semibold text-[#182533]">{{ d.rule_version_id }}</td>
                <td class="px-4 py-3 font-mono text-[#526173]">{{ d.environment }}</td>
                <td class="px-4 py-3">
                  <AppBadge :variant="d.status === 'DEPLOYED' ? 'success' : 'error'">
                    {{ d.status }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3 font-mono text-[#526173]">{{ new Date(d.deployed_at).toLocaleDateString() }}</td>
                <td class="px-4 py-3 text-[11px] text-[#526173]">{{ d.notes }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </AppCard>
    </div>

    <!-- ======================================================== -->
    <!-- OVERVIEW TAB (DEFAULT)                                   -->
    <!-- ======================================================== -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div class="lg:col-span-7 space-y-4">
          <AppCard title="Target Rule Engineering Overview" subtitle="RULE-CR-2026-01 AST Logic" noPadding>
            <div class="p-3 bg-[#F6F5F0] border-b border-[#E1E5E8] flex items-center justify-between text-xs">
              <span class="font-mono text-[#14263D] font-bold">RULE-CR-2026-01 (v1.1.0-draft)</span>
              <button @click="activeTab = 'module-b'" class="text-[#167D83] hover:text-[#14263D] font-medium text-xs transition-colors">
                Open Rule Studio →
              </button>
            </div>
            <div class="p-4 space-y-3 text-xs">
              <div class="p-3 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[3px] font-mono text-[11px] leading-relaxed">
                <span class="text-[#167D83] font-bold">IF</span> loan_type == "UNSECURED_PERSONAL_LOAN" AND borrower_type != "MICROFINANCE_SHG"<br/>
                <span class="text-[#167D83] font-bold">THEN</span> 125% Enhanced RWA<br/>
                <span class="text-[#167D83] font-bold">ELSE</span> 100% Standard RWA Carve-Out
              </div>
              <div class="flex items-center justify-between text-[11px] text-[#526173] font-mono">
                <span>Status: <strong class="text-[#14263D]">Tested & Conforming</strong></span>
                <span class="text-[#247653] font-semibold">5 of 5 Assertions Passing</span>
              </div>
            </div>
          </AppCard>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <AppCard title="Active Engineering Tasks" subtitle="Prioritized rule authoring backlog" noPadding>
            <div class="divide-y divide-[#E1E5E8]">
              <div
                v-for="t in mockStore.engineeringTasks.slice(0, 3)"
                :key="t.id"
                @click="activeTab = 'module-a'"
                class="p-3 hover:bg-[#F6F5F0] cursor-pointer transition-colors text-xs"
              >
                <div class="flex items-center justify-between">
                  <span class="font-mono font-bold text-[#14263D]">{{ t.id }}</span>
                  <AppBadge :variant="t.status === 'COMPLETED' ? 'success' : 'teal'">
                    {{ t.status }}
                  </AppBadge>
                </div>
                <div class="font-semibold text-[#182533] mt-1">{{ t.title }}</div>
                <div class="text-[10px] text-[#526173] mt-1 font-mono">Due: {{ t.due_date }}</div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal for Simulated Deployments / Rollbacks -->
    <ConfirmModal
      :open="confirmModalOpen"
      :title="modalTitle"
      :subtitle="modalSubtitle"
      :variant="modalVariant"
      :confirmText="modalConfirmText"
      :requireComment="modalRequireComment"
      v-model:comment="modalComment"
      @confirm="executeModalAction"
      @cancel="confirmModalOpen = false"
    >
      <p class="text-[11px] text-[#182533] leading-relaxed">
        {{ modalMessage }}
      </p>
    </ConfirmModal>

    <!-- Version Diff Modal -->
    <div v-if="showVersionDiffModal" class="fixed inset-0 z-50 overflow-y-auto bg-[#0B1728]/70 backdrop-blur-2xs flex items-center justify-center p-4">
      <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-xl max-w-2xl w-full p-5 space-y-4 text-left">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-sm font-bold text-[#14263D]">AST Version Comparison: v1.0.0 vs v1.1.0</h3>
            <p class="text-xs text-[#526173] mt-0.5">Structural condition differences between baseline and candidate release.</p>
          </div>
          <button @click="showVersionDiffModal = false" class="text-[#526173] hover:text-[#14263D]">
            <AppIcon name="close" :size="16" />
          </button>
        </div>

        <div class="grid grid-cols-2 gap-3 text-xs font-mono">
          <div class="p-3 bg-[#B33A42]/5 border border-[#B33A42]/20 rounded-[3px]">
            <span class="text-[10px] text-[#B33A42] font-bold uppercase block mb-1 font-mono">Baseline v1.0.0</span>
            <pre class="text-[10px] text-[#182533] overflow-x-auto leading-relaxed">
risk_weight: 100%
conditions: [
  loan_type in [
    PERSONAL_LOAN,
    CREDIT_CARD,
    MICROFINANCE
  ]
]</pre>
          </div>

          <div class="p-3 bg-[#247653]/5 border border-[#247653]/20 rounded-[3px]">
            <span class="text-[10px] text-[#247653] font-bold uppercase block mb-1 font-mono">Candidate v1.1.0-draft</span>
            <pre class="text-[10px] text-[#182533] overflow-x-auto leading-relaxed">
+ risk_weight: 125%
+ conditions: [
+   loan_type in [PERSONAL, CARD]
+   AND borrower != "MICROFINANCE_SHG"
+ ]
+ fallback: 100% (Carve-Out)</pre>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <AppButton variant="primary" size="sm" @click="showVersionDiffModal = false">
            Close Diff
          </AppButton>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMockDataStore } from '../../stores/mockDataStore';
import type { EngineeringTask } from '../../mock/mockData';
import DashboardLayout, { type MetricCardConfig, type ModuleTabConfig } from '../../components/dashboard/DashboardLayout.vue';
import AppCard from '../../components/ui/AppCard.vue';
import AppBadge from '../../components/ui/AppBadge.vue';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';
import ConfirmModal from '../../components/dashboard/ConfirmModal.vue';

const mockStore = useMockDataStore();

const activeTab = ref('overview');
const taskFilter = ref('ALL');

// Editable Rule DSL
const editableRiskWeight = ref(125);
const editableCarveOut = ref('MICROFINANCE_SHG');
const editableSummary = ref('Enhanced risk weight to 125% per RBI circular with microfinance carve-out');
const ruleSaveFeedback = ref('');

// Test Execution State
const runningTests = ref(false);
const testRunProgress = ref(0);

// Impact Simulation State
const simulatingImpact = ref(false);

// Modals
const showVersionDiffModal = ref(false);
const confirmModalOpen = ref(false);
const modalActionType = ref<'DEPLOY' | 'ROLLBACK'>('DEPLOY');
const modalTitle = ref('');
const modalSubtitle = ref('');
const modalMessage = ref('');
const modalConfirmText = ref('');
const modalVariant = ref<'primary' | 'danger'>('primary');
const modalRequireComment = ref(false);
const modalComment = ref('');

const moduleTabs: ModuleTabConfig[] = [
  { id: 'overview', label: 'Lab Overview', icon: 'overview' },
  { id: 'module-a', label: 'A. Engineering Workload', icon: 'check', badge: mockStore.engineeringTasks.length },
  { id: 'module-b', label: 'B. Rule Studio & AST', icon: 'rules', badge: 'v1.1.0' },
  { id: 'module-c', label: 'C. Test Lab & Regression', icon: 'simulator', badge: '5 PASS' },
  { id: 'module-d', label: 'D. Impact Simulator', icon: 'activity' },
  { id: 'module-e', label: 'E. Sandbox & Rollback', icon: 'deployments' },
];

const metricCards = computed<MetricCardConfig[]>(() => [
  {
    title: 'Target Rule Code',
    value: 'RULE-CR-2026-01',
    subtitle: 'Consumer Credit RWA',
    tag: 'Active Target',
  },
  {
    title: 'Candidate Version',
    value: mockStore.engineerMetrics.candidate_version,
    subtitle: 'Draft authored by Arun Patel',
    valueClass: 'text-[#167D83]',
  },
  {
    title: 'Regression Status',
    value: `${mockStore.engineerMetrics.tests_passing} / ${mockStore.engineerMetrics.tests_total} Passing`,
    subtitle: '100% boundary assertion pass',
    valueClass: 'text-[#247653]',
  },
  {
    title: 'Separation of Duties',
    value: 'Author Gate Active',
    subtitle: 'Requires Vikram Mehta Sign-off',
    tag: 'Dual-Control',
    tagClass: 'bg-[#247653]/10 text-[#247653]',
  },
]);

const filteredTasks = computed(() => {
  let list = [...mockStore.engineeringTasks];
  if (taskFilter.value !== 'ALL') {
    list = list.filter(t => t.status === taskFilter.value);
  }
  return list;
});

const onTaskStatusChange = (taskId: string, e: Event) => {
  const target = e.target as HTMLSelectElement;
  mockStore.updateTaskStatus(taskId, target.value as EngineeringTask['status']);
};

const saveRuleDraft = () => {
  mockStore.saveRuleDraft(
    'rule-cr-2026-01',
    {
      rule_code: 'RULE-CR-2026-01',
      risk_weight: editableRiskWeight.value,
      carve_out: editableCarveOut.value,
    },
    editableSummary.value
  );
  ruleSaveFeedback.value = 'Candidate rule AST saved to version history and verified by AST compiler.';
  setTimeout(() => {
    ruleSaveFeedback.value = '';
  }, 2500);
};

const handleRunTests = async () => {
  runningTests.value = true;
  testRunProgress.value = 15;

  const interval = setInterval(() => {
    testRunProgress.value += 25;
    if (testRunProgress.value >= 100) {
      clearInterval(interval);
      mockStore.runSimulatedTests().then(() => {
        runningTests.value = false;
        testRunProgress.value = 0;
      });
    }
  }, 180);
};

const handleSimulateImpact = async () => {
  simulatingImpact.value = true;
  await mockStore.runSimulatedImpact();
  simulatingImpact.value = false;
};

const openDeployModal = () => {
  modalActionType.value = 'DEPLOY';
  modalTitle.value = 'Simulate Sandbox Deployment';
  modalSubtitle.value = 'Demonstration action: Stage candidate version v1.1.0-draft';
  modalMessage.value = 'This simulated action records a deployment event for demonstration testing. In live production, dual-control policy requires Vikram Mehta to sign off before deployment.';
  modalConfirmText.value = 'Execute Sandbox Promotion';
  modalVariant.value = 'primary';
  modalRequireComment.value = false;
  modalComment.value = '';
  confirmModalOpen.value = true;
};

const openRollbackModal = () => {
  modalActionType.value = 'ROLLBACK';
  modalTitle.value = 'Simulate Rollback to Baseline (v1.0.0)';
  modalSubtitle.value = 'Demonstration action: Demote candidate back to v1.0.0';
  modalMessage.value = 'Please provide an engineering rollback justification to simulate a zero-downtime rollback in the sandbox ledger.';
  modalConfirmText.value = 'Confirm Simulated Rollback';
  modalVariant.value = 'danger';
  modalRequireComment.value = true;
  modalComment.value = 'Routine rollback drill to verify instant fallback';
  confirmModalOpen.value = true;
};

const executeModalAction = () => {
  if (modalActionType.value === 'DEPLOY') {
    mockStore.deploySandbox('ver-cr-v110-draft', 'Promoted via Rule Engineer Sandbox Console (Demo)');
  } else {
    mockStore.rollbackSandbox('ver-cr-v100', modalComment.value);
  }
  confirmModalOpen.value = false;
};
</script>
