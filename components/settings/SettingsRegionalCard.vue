<script setup>
import { Save } from 'lucide-vue-next'

defineProps({ preferences: { type: Object, required: true } })
defineEmits(['save'])
</script>

<template>
  <BaseCard class="h-fit p-4 sm:p-6">
    <div class="mb-5">
      <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Regional settings</h2>
      <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Set defaults for dates, times, and currency.
      </p>
    </div>
    <div class="space-y-4">
      <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>Date format</span>
        <select
          v-model="preferences.dateFormat"
          class="h-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-offset-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option>MMM D, YYYY</option>
          <option>DD/MM/YYYY</option>
          <option>YYYY-MM-DD</option>
        </select>
      </label>
      <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>Time format</span>
        <select
          v-model="preferences.timeFormat"
          class="h-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-offset-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option value="12-hour">12-hour</option>
          <option value="24-hour">24-hour</option>
        </select>
      </label>
      <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>Currency</span>
        <select
          v-model="preferences.currency"
          class="h-10 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus-visible:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-offset-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <option>USD</option>
          <option>EUR</option>
          <option>GBP</option>
          <option>CAD</option>
          <option>AUD</option>
        </select>
      </label>
      <div class="border-t border-slate-100 dark:border-slate-700 pt-4">
        <BaseButton variant="primary" class="w-full" @click="$emit('save')">
          <Save :size="15" />
          Save regional settings
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
