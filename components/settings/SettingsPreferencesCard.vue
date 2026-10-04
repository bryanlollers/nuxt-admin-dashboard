<script setup>
import { Save } from 'lucide-vue-next'

defineProps({ preferences: { type: Object, required: true } })
defineEmits(['save', 'theme-change', 'toggle-sidebar'])
</script>

<template>
  <BaseCard class="p-4 sm:p-6">
    <div class="mb-5">
      <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Preferences</h2>
      <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Customize how Sample looks and behaves.
      </p>
    </div>
    <div class="divide-y divide-slate-100 dark:divide-slate-700">
      <div class="flex items-center justify-between gap-4 py-4 first:pt-0">
        <div>
          <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Color theme</p>
          <p class="mt-1 text-[10px] text-slate-600 dark:text-slate-400">
            Choose a light or dark workspace.
          </p>
        </div>
        <BaseSelect
          v-model="preferences.theme"
          label="Color theme"
          @update:model-value="$emit('theme-change', $event)"
          :options="[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]"
        />
      </div>
      <div class="flex items-center justify-between gap-4 py-4">
        <div>
          <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Collapsed sidebar</p>
          <p class="mt-1 text-[10px] text-slate-600 dark:text-slate-400">
            Keep more room for your workspace.
          </p>
        </div>
        <button
          type="button"
          class="outline-none relative h-6 w-11 cursor-pointer rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          :class="preferences.sidebarCollapsed ? 'bg-violet-500' : 'bg-slate-300'"
          role="switch"
          :aria-checked="preferences.sidebarCollapsed"
          aria-label="Toggle collapsed sidebar"
          @click="$emit('toggle-sidebar')"
        >
          <span
            class="absolute top-0.5 size-5 rounded-full bg-white dark:bg-slate-900 shadow transition-all"
            :class="preferences.sidebarCollapsed ? 'left-[22px]' : 'left-0.5'"
          />
        </button>
      </div>
      <div class="py-4">
        <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Notifications</p>
        <div class="mt-3 space-y-3">
          <label
            class="flex cursor-pointer items-center gap-3 text-xs text-slate-600 dark:text-slate-300"
          >
            <input
              v-model="preferences.notifications.email"
              type="checkbox"
              class="outline-none size-4 cursor-pointer accent-violet-500 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
            />
            Email updates
          </label>
          <label
            class="flex cursor-pointer items-center gap-3 text-xs text-slate-600 dark:text-slate-300"
          >
            <input
              v-model="preferences.notifications.inApp"
              type="checkbox"
              class="outline-none size-4 cursor-pointer accent-violet-500 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
            />
            In-app notifications
          </label>
          <label
            class="flex cursor-pointer items-center gap-3 text-xs text-slate-600 dark:text-slate-300"
          >
            <input
              v-model="preferences.notifications.weeklySummary"
              type="checkbox"
              class="outline-none size-4 cursor-pointer accent-violet-500 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
            />
            Weekly summary
          </label>
        </div>
      </div>
      <div class="flex justify-end border-t border-slate-100 dark:border-slate-700 pt-4">
        <BaseButton variant="primary" @click="$emit('save')">
          <Save :size="15" />
          Save preferences
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
