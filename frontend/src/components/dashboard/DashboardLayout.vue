<template>
  <div class="space-y-5">
    <!-- Purpose-Built Enterprise Header -->
    <div class="bg-white border border-[#E1E5E8] rounded-[4px] p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
          <AppBadge variant="teal">{{ roleBadgeText }}</AppBadge>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#526173] font-mono">Assigned Operator: <strong class="text-[#182533] font-semibold">{{ operatorName }}</strong></span>
          <span class="text-[#E1E5E8]">|</span>
          <span class="text-xs text-[#247653] font-medium flex items-center gap-1.5 font-mono">
            <span class="w-1.5 h-1.5 rounded-full bg-[#247653]"></span>
            Active Session
          </span>
        </div>
        <h1 class="text-lg font-bold text-[#182533] tracking-tight">
          {{ pageTitle }}
        </h1>
        <p class="text-xs text-[#526173] mt-0.5 leading-relaxed">
          {{ pageSubtitle }}
        </p>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <slot name="header-actions" />
      </div>
    </div>

    <!-- Summary Metrics Ribbon (4 Role-Specific Data Cards) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="card in metricCards"
        :key="card.title"
        class="bg-white border border-[#E1E5E8] rounded-[4px] p-3.5 shadow-2xs transition-all hover:border-[#167D83]/40"
      >
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase font-bold tracking-wider text-[#526173]">{{ card.title }}</span>
          <span
            v-if="card.tag"
            class="text-[10px] px-1.5 py-0.5 rounded-[2px] font-mono font-medium border"
            :class="card.tagClass || 'bg-[#167D83]/10 text-[#167D83] border-[#167D83]/20'"
          >
            {{ card.tag }}
          </span>
        </div>
        <div class="text-xl font-bold mt-1 font-mono tracking-tight" :class="card.valueClass || 'text-[#182533]'">
          {{ card.value }}
        </div>
        <div class="text-[11px] text-[#526173] mt-0.5 truncate">
          {{ card.subtitle }}
        </div>
      </div>
    </div>

    <!-- Interactive Navigation Module Tabs (Modules A through E) -->
    <div class="bg-white border border-[#E1E5E8] rounded-[4px] shadow-2xs overflow-hidden">
      <!-- Clean Tab Bar with Teal Active Indicator -->
      <div class="border-b border-[#E1E5E8] px-4 bg-[#F6F5F0] flex items-center justify-between gap-2 overflow-x-auto">
        <div class="flex items-center gap-1 pt-1.5 min-w-max">
          <button
            v-for="tab in moduleTabs"
            :key="tab.id"
            @click="$emit('update:activeTab', tab.id)"
            class="px-3.5 py-2 text-xs transition-all flex items-center gap-2 border-b-2 font-medium select-none"
            :class="activeTab === tab.id
              ? 'border-[#167D83] text-[#182533] font-semibold bg-white rounded-t-[3px] shadow-2xs'
              : 'border-transparent text-[#526173] hover:text-[#182533] hover:bg-white/60'"
          >
            <AppIcon v-if="tab.icon" :name="tab.icon" :size="13" />
            <span>{{ tab.label }}</span>
            <span
              v-if="tab.badge !== undefined"
              class="px-1.5 py-0.2 rounded-[2px] text-[10px] font-mono border"
              :class="activeTab === tab.id ? 'bg-[#167D83]/10 text-[#167D83] border-[#167D83]/20 font-semibold' : 'bg-[#E1E5E8] text-[#526173] border-transparent'"
            >
              {{ tab.badge }}
            </span>
          </button>
        </div>

        <div class="hidden md:flex items-center gap-1.5 text-[11px] text-[#526173] font-mono pr-2">
          <span>Active Module:</span>
          <strong class="text-[#167D83] font-semibold uppercase">{{ currentTabLabel }}</strong>
        </div>
      </div>

      <!-- Active Module Canvas Slot -->
      <div class="p-5 md:p-6 bg-[#FFFFFF]">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AppBadge from '../ui/AppBadge.vue';
import AppIcon from '../icons/AppIcon.vue';

export interface MetricCardConfig {
  title: string;
  value: string | number;
  subtitle: string;
  valueClass?: string;
  tag?: string;
  tagClass?: string;
}

export interface ModuleTabConfig {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

const props = withDefaults(defineProps<{
  roleBadgeText: string;
  operatorName: string;
  pageTitle: string;
  pageSubtitle: string;
  metricCards: MetricCardConfig[];
  moduleTabs: ModuleTabConfig[];
  activeTab: string;
}>(), {
  activeTab: 'overview',
});

defineEmits<{
  (e: 'update:activeTab', tabId: string): void;
}>();

const currentTabLabel = computed(() => {
  const t = props.moduleTabs.find(tab => tab.id === props.activeTab);
  return t ? t.label : props.activeTab;
});
</script>
