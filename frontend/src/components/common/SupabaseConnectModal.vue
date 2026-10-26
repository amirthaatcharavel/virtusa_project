<template>
  <div v-if="open" class="fixed inset-0 z-50 overflow-y-auto bg-[#0B1728]/75 backdrop-blur-2xs flex items-center justify-center p-4">
    <div class="bg-white rounded-[4px] border border-[#E1E5E8] shadow-2xl max-w-xl w-full p-6 space-y-5 text-left transition-all">
      <!-- Modal Header -->
      <div class="flex items-start justify-between gap-3 border-b border-[#E1E5E8] pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-[4px] bg-[#00C58E]/10 border border-[#00C58E]/30 flex items-center justify-center text-[#00C58E]">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L.32 14.152a.396.396 0 0 0 .31.637H12v8.811a.396.396 0 0 0 .716.234l10.963-13.84a.396.396 0 0 0-.317-.64z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-[#182533] tracking-wide">Connect Supabase</h3>
              <span
                class="px-2 py-0.5 rounded-[3px] text-xs font-mono font-bold flex items-center gap-1.5"
                :class="isConnected ? 'bg-[#EDF6F1] text-[#247653] border border-[#BCE0CE]' : 'bg-[#FDF7EB] text-[#AD741B] border border-[#EED7A8]'"
              >
                <span class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-[#247653] animate-pulse' : 'bg-[#AD741B]'"></span>
                {{ isConnected ? 'Connected' : 'Offline / Standalone' }}
              </span>
            </div>
            <p class="text-xs text-[#526173] mt-0.5">
              Live PostgreSQL database, real-time audit subscriptions, and document storage.
            </p>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="text-[#526173] hover:text-[#182533] p-1.5 rounded-[3px] hover:bg-[#F6F5F0]"
        >
          <AppIcon name="close" :size="18" />
        </button>
      </div>

      <!-- Test Connection Result Notification -->
      <div
        v-if="testResult"
        class="p-3.5 rounded-[4px] border text-xs flex items-start gap-2.5 transition-all"
        :class="testResult.success ? 'bg-[#EDF6F1] border-[#BCE0CE] text-[#247653]' : 'bg-[#FDF1F2] border-[#F5C2C6] text-[#B33A42]'"
      >
        <AppIcon :name="testResult.success ? 'check' : 'alert'" :size="16" class="flex-shrink-0 mt-0.5" />
        <div class="flex-1 leading-relaxed">
          <strong class="font-bold">{{ testResult.success ? 'Connection Verified' : 'Connection Failed' }}:</strong>
          {{ testResult.message }}
        </div>
      </div>

      <!-- Credentials Form -->
      <div class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-[#182533] uppercase tracking-wide mb-1.5">
            Supabase Project URL <span class="text-[#B33A42]">*</span>
          </label>
          <input
            v-model="supabaseUrl"
            type="url"
            placeholder="https://your-project-id.supabase.co"
            class="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E1E5E8] rounded-[4px] text-[#182533] font-mono focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
          />
          <span class="text-[11px] text-[#526173] mt-1 block">
            Found in Supabase Dashboard → <strong>Project Settings → API → Project URL</strong>
          </span>
        </div>

        <div>
          <label class="block font-bold text-[#182533] uppercase tracking-wide mb-1.5">
            Supabase Anon Public API Key <span class="text-[#B33A42]">*</span>
          </label>
          <input
            v-model="supabaseAnonKey"
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            class="w-full text-sm px-3.5 py-2.5 bg-white border border-[#E1E5E8] rounded-[4px] text-[#182533] font-mono focus:outline-none focus:ring-1 focus:ring-[#167D83] focus:border-[#167D83]"
          />
          <span class="text-[11px] text-[#526173] mt-1 block">
            Found in Supabase Dashboard → <strong>Project Settings → API → Project API Keys → anon (public)</strong>
          </span>
        </div>
      </div>

      <!-- Quick Setup Instructions Box -->
      <div class="p-4 bg-[#F6F5F0] border border-[#E1E5E8] rounded-[4px] space-y-2 text-xs">
        <div class="flex items-center justify-between font-bold text-[#14263D]">
          <span>Database Tables & SQL Migration:</span>
          <span class="text-[#167D83] font-mono font-semibold">supabase_schema.sql</span>
        </div>
        <p class="text-[#526173] leading-relaxed">
          The full PostgreSQL migration file is ready at <code class="bg-white px-1.5 py-0.5 rounded border border-[#E1E5E8] text-[#182533] font-mono">virtusa_project/supabase_schema.sql</code>. Copy and run it in the Supabase <strong>SQL Editor</strong> to create all 14 tables and initial institutional test fixtures with one click.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="pt-3 flex items-center justify-between gap-2.5 border-t border-[#E1E5E8]">
        <div>
          <button
            v-if="isConnected"
            @click="handleDisconnect"
            class="text-xs text-[#B33A42] hover:underline font-semibold"
          >
            Disconnect Credentials
          </button>
        </div>

        <div class="flex items-center gap-2">
          <AppButton
            variant="outline"
            size="md"
            :loading="testing"
            @click="handleTest"
          >
            <AppIcon name="refresh" :size="14" />
            Test Connection
          </AppButton>

          <AppButton
            variant="primary"
            size="md"
            @click="handleSave"
          >
            Save & Connect
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AppButton from '../ui/AppButton.vue';
import AppIcon from '../icons/AppIcon.vue';
import {
  getSupabaseConfig,
  isSupabaseConfigured,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection
} from '../../services/supabase';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'connected'): void;
}>();

const supabaseUrl = ref('');
const supabaseAnonKey = ref('');
const isConnected = ref(false);
const testing = ref(false);
const testResult = ref<{ success: boolean; message: string } | null>(null);

const loadConfig = () => {
  const cfg = getSupabaseConfig();
  supabaseUrl.value = cfg.url;
  supabaseAnonKey.value = cfg.anonKey;
  isConnected.value = isSupabaseConfigured();
};

onMounted(loadConfig);

const handleTest = async () => {
  if (!supabaseUrl.value || !supabaseAnonKey.value) {
    testResult.value = {
      success: false,
      message: 'Please enter both Supabase Project URL and Anon Public Key before testing.',
    };
    return;
  }

  // Temporarily save to test
  saveSupabaseCredentials(supabaseUrl.value, supabaseAnonKey.value);
  testing.value = true;
  testResult.value = null;

  try {
    const res = await testSupabaseConnection();
    testResult.value = res;
    isConnected.value = res.success;
  } catch (err: any) {
    testResult.value = {
      success: false,
      message: err?.message || 'Error executing test request.',
    };
  } finally {
    testing.value = false;
  }
};

const handleSave = async () => {
  if (!supabaseUrl.value || !supabaseAnonKey.value) {
    testResult.value = {
      success: false,
      message: 'Both Project URL and Anon Key are required to save.',
    };
    return;
  }

  saveSupabaseCredentials(supabaseUrl.value, supabaseAnonKey.value);
  const test = await testSupabaseConnection();
  testResult.value = test;
  isConnected.value = test.success;

  if (test.success) {
    emit('connected');
    setTimeout(() => {
      emit('close');
    }, 1200);
  }
};

const handleDisconnect = () => {
  clearSupabaseCredentials();
  supabaseUrl.value = '';
  supabaseAnonKey.value = '';
  isConnected.value = false;
  testResult.value = {
    success: true,
    message: 'Supabase credentials cleared. Using local demo engine and mock store.',
  };
};
</script>
