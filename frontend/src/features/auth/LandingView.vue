<template>
  <div class="min-h-screen bg-[#F1F6FA] text-[#172B3A] font-sans antialiased selection:bg-purple-100 selection:text-purple-900">
    <!-- Top Enterprise Navigation -->
    <header class="h-16 bg-white border-b border-[#D8E3EC] sticky top-0 z-50 shadow-2xs">
      <div class="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <!-- Brand Identity -->
        <router-link to="/landing" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 font-bold text-xs tracking-wider shadow-inner">
            <svg class="w-4 h-4 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div class="font-bold text-xs tracking-wider text-[#172B3A] uppercase leading-tight">Regulatory Change</div>
            <div class="text-[10px] text-purple-700 font-semibold tracking-wide">Intelligence Platform</div>
          </div>
        </router-link>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center gap-6 text-xs text-[#647789] font-medium">
          <a href="#architecture" class="hover:text-[#172B3A] transition-colors">Architecture</a>
          <a href="#personas" class="hover:text-[#172B3A] transition-colors">Role Workspaces</a>
          <a href="#governance" class="hover:text-[#172B3A] transition-colors">Dual-Control Governance</a>
          <a href="#security" class="hover:text-[#172B3A] transition-colors">Institutional Security</a>
        </div>

        <!-- Auth CTAs -->
        <div class="flex items-center gap-3">
          <router-link to="/login">
            <AppButton variant="outline" size="sm">
              <AppIcon name="users" :size="13" />
              Sign In / Select Persona
            </AppButton>
          </router-link>
          <router-link :to="authStore.defaultLandingRoute">
            <AppButton variant="primary" size="sm">
              Launch Workspace →
            </AppButton>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="py-16 md:py-24 px-6 border-b border-[#D8E3EC] bg-white">
      <div class="max-w-5xl mx-auto text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F5EE] text-[#16845B] border border-[#B2DEC7]">
          <span class="w-1.5 h-1.5 rounded-full bg-[#16845B]"></span>
          <span>RBI & Basel Regulatory Governance Engine · Active Sandbox v1.0</span>
        </div>

        <h1 class="text-3xl md:text-5xl font-extrabold text-[#172B3A] tracking-tight leading-tight">
          Deterministic Regulatory Intelligence & Automated Compliance Gating
        </h1>

        <p class="text-base md:text-lg text-[#647789] max-w-3xl mx-auto leading-relaxed">
          Ingest complex regulatory circulars, extract verifiable obligations with exact page and span provenance, build deterministic AST rules, and enforce dual-control compliance sign-offs with zero arbitrary code execution.
        </p>

        <!-- CTAs -->
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <router-link :to="authStore.defaultLandingRoute">
            <AppButton variant="primary" size="lg" customClass="w-full sm:w-auto px-8">
              Open {{ authStore.roleLabel }} Workspace →
            </AppButton>
          </router-link>
          <router-link to="/login">
            <AppButton variant="secondary" size="lg" customClass="w-full sm:w-auto px-6">
              Switch Institutional Persona
            </AppButton>
          </router-link>
        </div>

        <!-- Trust & Compliance Indicators -->
        <div class="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div class="p-3.5 bg-[#F1F6FA] border border-[#D8E3EC] rounded-lg">
            <div class="text-[10px] font-bold text-[#647789] uppercase tracking-wide">Source Provenance</div>
            <div class="font-bold text-[#172B3A] text-sm mt-0.5">100% Verifiable</div>
            <div class="text-[11px] text-[#16845B] font-medium mt-0.5">Exact Span Citations</div>
          </div>
          <div class="p-3.5 bg-[#F1F6FA] border border-[#D8E3EC] rounded-lg">
            <div class="text-[10px] font-bold text-[#647789] uppercase tracking-wide">Rule Execution</div>
            <div class="font-bold text-[#172B3A] text-sm mt-0.5">Pure Functional AST</div>
            <div class="text-[11px] text-purple-700 font-medium mt-0.5">Zero eval / exec</div>
          </div>
          <div class="p-3.5 bg-[#F1F6FA] border border-[#D8E3EC] rounded-lg">
            <div class="text-[10px] font-bold text-[#647789] uppercase tracking-wide">Governance Standard</div>
            <div class="font-bold text-[#172B3A] text-sm mt-0.5">4-Eyes Dual-Control</div>
            <div class="text-[11px] text-[#16845B] font-medium mt-0.5">Mandatory Gating</div>
          </div>
          <div class="p-3.5 bg-[#F1F6FA] border border-[#D8E3EC] rounded-lg">
            <div class="text-[10px] font-bold text-[#647789] uppercase tracking-wide">Audit Ledger</div>
            <div class="font-bold text-[#172B3A] text-sm mt-0.5">Cryptographic Trail</div>
            <div class="text-[11px] text-[#647789] font-medium mt-0.5">Tamper-evident log</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Role Workspaces Architecture -->
    <section id="personas" class="py-16 px-6 max-w-7xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-[#172B3A] tracking-tight">
          Purpose-Built Workspaces for Every Governance Role
        </h2>
        <p class="text-sm text-[#647789] mt-2">
          Each user role operates inside a specialized layout engineered for their distinct cognitive responsibilities, not a generic dashboard template.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Persona 1: Analyst -->
        <div class="bg-white rounded-lg border border-[#D8E3EC] p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200 uppercase">
                Analysis & Triage
              </span>
              <AppIcon name="file-text" :size="16" class="text-purple-600" />
            </div>
            <h3 class="text-base font-bold text-[#172B3A]">Compliance Analyst</h3>
            <p class="text-xs text-[#647789] mt-1.5 leading-relaxed">
              Document-centred workspace for regulatory circular ingestion, PDF text verification, and obligation triage.
            </p>
            <ul class="mt-4 space-y-1.5 text-xs text-[#172B3A]">
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Page-by-page document reader</span>
              </li>
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Exact span text citations</span>
              </li>
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Internal policy harmonization</span>
              </li>
            </ul>
          </div>
          <div class="mt-6 pt-4 border-t border-[#D8E3EC]">
            <button
              @click="loginAsRole('usr-analyst-01', '/analyst/dashboard')"
              class="w-full py-2 px-3 rounded bg-[#F1F6FA] hover:bg-purple-50 text-xs font-semibold text-[#172B3A] hover:text-purple-900 border border-[#D8E3EC] hover:border-purple-300 transition-colors flex items-center justify-center gap-1.5"
            >
              Enter as Maya Sen →
            </button>
          </div>
        </div>

        <!-- Persona 2: Engineer -->
        <div class="bg-white rounded-lg border border-[#D8E3EC] p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F6FA] text-[#172B3A] border border-[#D8E3EC] uppercase">
                DSL & Simulation
              </span>
              <AppIcon name="terminal" :size="16" class="text-purple-600" />
            </div>
            <h3 class="text-base font-bold text-[#172B3A]">Rule Engineer / IT</h3>
            <p class="text-xs text-[#647789] mt-1.5 leading-relaxed">
              IDE layout with AST syntax validation, automated regression test runs, and loan portfolio impact simulation.
            </p>
            <ul class="mt-4 space-y-1.5 text-xs text-[#172B3A]">
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Deterministic DSL editor</span>
              </li>
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>100% passing test matrix</span>
              </li>
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Delta risk weight simulator</span>
              </li>
            </ul>
          </div>
          <div class="mt-6 pt-4 border-t border-[#D8E3EC]">
            <button
              @click="loginAsRole('usr-engineer-01', '/engineer/dashboard')"
              class="w-full py-2 px-3 rounded bg-[#F1F6FA] hover:bg-purple-50 text-xs font-semibold text-[#172B3A] hover:text-purple-900 border border-[#D8E3EC] hover:border-purple-300 transition-colors flex items-center justify-center gap-1.5"
            >
              Enter as Arun Patel →
            </button>
          </div>
        </div>

        <!-- Persona 3: Approver -->
        <div class="bg-white rounded-lg border border-[#D8E3EC] p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5EE] text-[#16845B] border border-[#B2DEC7] uppercase">
                Dual Control
              </span>
              <AppIcon name="shield" :size="16" class="text-[#16845B]" />
            </div>
            <h3 class="text-base font-bold text-[#172B3A]">Compliance Approver</h3>
            <p class="text-xs text-[#647789] mt-1.5 leading-relaxed">
              Evidence cockpit evaluating candidate rule dossiers, test results, impact reports, and mandatory sign-offs.
            </p>
            <ul class="mt-4 space-y-1.5 text-xs text-[#172B3A]">
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Dual-control sign-off gating</span>
              </li>
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Rule version dossier review</span>
              </li>
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Formal audit justification</span>
              </li>
            </ul>
          </div>
          <div class="mt-6 pt-4 border-t border-[#D8E3EC]">
            <button
              @click="loginAsRole('usr-approver-01', '/approver/dashboard')"
              class="w-full py-2 px-3 rounded bg-[#F1F6FA] hover:bg-purple-50 text-xs font-semibold text-[#172B3A] hover:text-purple-900 border border-[#D8E3EC] hover:border-purple-300 transition-colors flex items-center justify-center gap-1.5"
            >
              Enter as Vikram Mehta →
            </button>
          </div>
        </div>

        <!-- Persona 4: Admin -->
        <div class="bg-white rounded-lg border border-[#D8E3EC] p-5 shadow-xs flex flex-col justify-between hover:border-purple-300 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF6E9] text-[#B7791F] border border-[#E8D2A6] uppercase">
                Governance & RBAC
              </span>
              <AppIcon name="settings" :size="16" class="text-[#B7791F]" />
            </div>
            <h3 class="text-base font-bold text-[#172B3A]">Platform Admin</h3>
            <p class="text-xs text-[#647789] mt-1.5 leading-relaxed">
              Governance hub managing institutional users, role-based boundaries, cryptographic audit ledger, and uptime.
            </p>
            <ul class="mt-4 space-y-1.5 text-xs text-[#172B3A]">
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Granular RBAC boundaries</span>
              </li>
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>Tamper-evident audit streams</span>
              </li>
              <li class="flex items-center gap-1.5 text-[#16845B]">
                <AppIcon name="check" :size="13" />
                <span>System health telemetry</span>
              </li>
            </ul>
          </div>
          <div class="mt-6 pt-4 border-t border-[#D8E3EC]">
            <button
              @click="loginAsRole('usr-admin-01', '/admin/dashboard')"
              class="w-full py-2 px-3 rounded bg-[#F1F6FA] hover:bg-purple-50 text-xs font-semibold text-[#172B3A] hover:text-purple-900 border border-[#D8E3EC] hover:border-purple-300 transition-colors flex items-center justify-center gap-1.5"
            >
              Enter as Elena Rostova →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Governance & Verification Flow -->
    <section id="governance" class="py-16 px-6 bg-white border-t border-b border-[#D8E3EC]">
      <div class="max-w-5xl mx-auto space-y-8">
        <div class="text-center">
          <span class="text-xs font-bold text-purple-700 uppercase tracking-wider">Traceability Chain</span>
          <h2 class="text-2xl font-bold text-[#172B3A] mt-1">End-to-End Regulatory Traceability Architecture</h2>
          <p class="text-xs text-[#647789] mt-1">From circular publication to production sandbox execution without guesswork</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div class="p-4 bg-[#F1F6FA] border border-[#D8E3EC] rounded-lg space-y-2">
            <span class="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">1</span>
            <div class="font-bold text-[#172B3A]">Circular Ingestion</div>
            <p class="text-[#647789]">Official circular (e.g. RBI 2026/84) ingested and parsed into verifiable text spans.</p>
          </div>

          <div class="p-4 bg-[#F1F6FA] border border-[#D8E3EC] rounded-lg space-y-2">
            <span class="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">2</span>
            <div class="font-bold text-[#172B3A]">Obligation Triage</div>
            <p class="text-[#647789]">Analysts review extracted obligations, establish applicability, and map to internal credit policies.</p>
          </div>

          <div class="p-4 bg-[#F1F6FA] border border-[#D8E3EC] rounded-lg space-y-2">
            <span class="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">3</span>
            <div class="font-bold text-[#172B3A]">AST Rule & Simulation</div>
            <p class="text-[#647789]">Engineers translate obligations into AST conditions and verify against loans portfolio test suites.</p>
          </div>

          <div class="p-4 bg-[#F1F6FA] border border-[#D8E3EC] rounded-lg space-y-2">
            <span class="w-6 h-6 rounded-full bg-[#16845B] text-white font-bold flex items-center justify-center text-xs">4</span>
            <div class="font-bold text-[#172B3A]">Dual-Control Gating</div>
            <p class="text-[#647789]">Approver inspects test evidence and certifies deployment with mandatory compliance sign-off.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Institutional Footer -->
    <footer id="security" class="py-12 px-6 bg-slate-900 text-slate-300 text-xs">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded bg-purple-900 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-xs">
            RC
          </div>
          <div>
            <div class="font-bold text-slate-100">Regulatory Change Intelligence Platform</div>
            <div class="text-[10px] text-slate-400">Institutional Governance & Rule Simulation Suite</div>
          </div>
        </div>

        <div class="flex items-center gap-6 text-[11px] text-slate-400">
          <span>RBI Master Directions Compliant</span>
          <span>•</span>
          <span>Zero-Arbitrary-Execution AST</span>
          <span>•</span>
          <span>Dual-Control 4-Eyes Certified</span>
        </div>

        <div>
          <router-link to="/login" class="text-purple-300 hover:text-white underline">
            Sign In to Institutional Gateway →
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import AppButton from '../../components/ui/AppButton.vue';
import AppIcon from '../../components/icons/AppIcon.vue';

const router = useRouter();
const authStore = useAuthStore();

const loginAsRole = (userId: string, targetRoute: string) => {
  authStore.switchUser(userId);
  router.push(targetRoute);
};
</script>
