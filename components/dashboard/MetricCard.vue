<script setup>
import { ArrowDownRight, ArrowUpRight } from 'lucide-vue-next'

const props = defineProps({
  label: String,
  value: String,
  change: String,
  positive: Boolean,
  icon: String,
  tint: String,
  spark: Array,
})

const tints = {
  violet: {
    icon: 'bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300',
    line: '#6bb39a',
  },
  orange: {
    icon: 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300',
    line: '#6bb39a',
  },
  blue: {
    icon: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
    line: '#6bb39a',
  },
  green: {
    icon: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    line: '#e59d8d',
  },
}
</script>

<template>
  <article
    class="min-w-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm"
  >
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ label }}</span>
      <span
        class="grid size-8 place-items-center rounded-lg text-sm font-semibold"
        :class="tints[props.tint]?.icon || tints.violet.icon"
      >
        {{ icon }}
      </span>
    </div>
    <div class="mt-2 flex items-end justify-between gap-2">
      <div class="min-w-0">
        <strong
          class="font-[Manrope,sans-serif] text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
        >
          {{ value }}
        </strong>
        <div class="mt-1 flex flex-wrap items-center gap-1 text-[10px]">
          <component
            :is="positive ? ArrowUpRight : ArrowDownRight"
            :size="13"
            :class="positive ? 'text-emerald-700' : 'text-rose-500'"
          />
          <b :class="positive ? 'text-emerald-700' : 'text-rose-500'">{{ change }}</b>
          <span class="text-slate-600 dark:text-slate-400">vs last month</span>
        </div>
      </div>
      <svg
        class="h-8 w-[76px] shrink-0"
        viewBox="0 0 98 36"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          :points="spark.map((n, i) => `${i * 16},${34 - n * 0.3}`).join(' ')"
          fill="none"
          :stroke="positive ? '#6bb39a' : '#e59d8d'"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </article>
</template>
