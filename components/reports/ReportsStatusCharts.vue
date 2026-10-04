<script setup>
defineProps({
  projectSummary: Array,
  taskSummary: Array,
  reportProjects: Array,
  reportTasks: Array,
})
</script>

<template>
  <section class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
    <BaseCard class="p-4 sm:p-5">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Project statistics</h2>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Delivery status across active work
          </p>
        </div>
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {{ reportProjects.length }} total
        </span>
      </div>
      <div class="mt-5 space-y-4">
        <div v-for="item in projectSummary" :key="item.label">
          <div class="mb-1.5 flex justify-between text-xs">
            <span class="text-slate-500 dark:text-slate-400">{{ item.label }}</span>
            <strong class="text-slate-700 dark:text-slate-200">{{ item.value }}</strong>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              class="h-full rounded-full"
              :class="item.color"
              :style="{
                width: `${reportProjects.length ? (item.value / reportProjects.length) * 100 : 0}%`,
              }"
            />
          </div>
        </div>
      </div>
    </BaseCard>
    <BaseCard class="p-4 sm:p-5">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Task statistics</h2>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">Workload by current status</p>
        </div>
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {{ reportTasks.length }} total
        </span>
      </div>
      <div class="mt-5 space-y-4">
        <div v-for="item in taskSummary" :key="item.label">
          <div class="mb-1.5 flex justify-between text-xs">
            <span class="text-slate-500 dark:text-slate-400">{{ item.label }}</span>
            <strong class="text-slate-700 dark:text-slate-200">{{ item.value }}</strong>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              class="h-full rounded-full"
              :class="item.color"
              :style="{
                width: `${reportTasks.length ? (item.value / reportTasks.length) * 100 : 0}%`,
              }"
            />
          </div>
        </div>
      </div>
    </BaseCard>
  </section>
</template>
