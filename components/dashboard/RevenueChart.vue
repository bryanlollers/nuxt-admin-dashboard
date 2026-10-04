<script setup>
const bars = [
  38, 45, 43, 58, 54, 49, 62, 56, 68, 63, 76, 69, 80, 74, 91, 83, 89, 75, 96, 87, 98, 85, 100, 92,
]
const line = [
  31, 37, 35, 46, 42, 48, 40, 52, 49, 61, 54, 66, 60, 70, 63, 71, 68, 79, 73, 86, 77, 89, 83, 94,
]
const points = computed(() => line.map((y, i) => `${i * (640 / 23)},${180 - y * 1.52}`).join(' '))
</script>
<template>
  <figure class="m-0">
    <figcaption class="sr-only">
      March revenue and activity trend. Both rise during the month. Revenue trend values:
      {{ line.join(', ') }}. Activity values: {{ bars.join(', ') }}. Values are relative indices.
    </figcaption>
    <div aria-hidden="true" class="flex h-44 pt-2">
      <div
        class="flex w-9 shrink-0 flex-col justify-between pb-6 text-[9px] text-slate-600 dark:text-slate-400"
      >
        <span>$12k</span>
        <span>$9k</span>
        <span>$6k</span>
        <span>$3k</span>
        <span>$0</span>
      </div>
      <div class="relative mb-6 min-w-0 flex-1">
        <div class="absolute inset-0 flex flex-col justify-between">
          <i
            v-for="n in 5"
            :key="n"
            class="w-full border-t border-dashed border-slate-200 dark:border-slate-700"
          />
        </div>
        <div class="absolute inset-0 flex items-end justify-between gap-1 px-0.5">
          <div
            v-for="(bar, i) in bars"
            :key="i"
            class="max-w-3 flex-1 rounded-t-sm bg-violet-100 even:bg-violet-200/70 dark:bg-violet-900/70 dark:even:bg-violet-800/70"
            :style="{ height: `${bar}%` }"
          />
        </div>
        <svg
          class="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 640 180"
          preserveAspectRatio="none"
          aria-label="Revenue trend line"
        >
          <defs>
            <linearGradient id="lineShade" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="#8775db" stop-opacity=".17" />
              <stop offset="100%" stop-color="#8775db" stop-opacity="0" />
            </linearGradient>
          </defs>
          <polygon :points="`0,180 ${points} 640,180`" fill="url(#lineShade)" />
          <polyline
            :points="points"
            fill="none"
            stroke="#8170d2"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div
          class="absolute -bottom-6 left-0 right-0 flex justify-between text-[8px] text-slate-600 dark:text-slate-400"
        >
          <span>Mar 01</span>
          <span>Mar 05</span>
          <span>Mar 10</span>
          <span>Mar 15</span>
          <span>Mar 20</span>
          <span>Mar 25</span>
          <span>Mar 30</span>
        </div>
      </div>
    </div>
  </figure>
</template>
