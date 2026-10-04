<script setup>
import { formatDate } from '~/utils/date'

defineProps({
  reportProjects: Array,
  reportTasks: Array,
  startDate: String,
  endDate: String,
  invalidRange: Boolean,
})
const emit = defineEmits(['retry'])
const today = useAppDate()
const generatedDate = formatDate(today.value, { year: 'numeric', month: 'numeric', day: 'numeric' })
</script>

<template>
  <BaseCard class="mb-4 overflow-hidden">
    <div class="border-b border-slate-100 dark:border-slate-700 p-4 sm:p-5">
      <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Project performance</h2>
      <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Project progress, customer, and task completion
      </p>
    </div>
    <DataTable
      label="Projects"
      :columns="[
        { key: 'project', label: 'PROJECT' },
        { key: 'customer', label: 'CUSTOMER' },
        { key: 'status', label: 'STATUS' },
        { key: 'progress', label: 'PROGRESS' },
        { key: 'tasks', label: 'TASKS' },
        { key: 'due', label: 'DUE DATE' },
      ]"
      :rows="reportProjects"
      :error="invalidRange ? 'Choose a valid date range to view report data.' : ''"
      @retry="emit('retry')"
      empty-title="No project data for this range"
      empty-description="Adjust the date range or create a project with a due date in this period."
    >
      <template #cell-project="{ row }">
        <span class="font-semibold text-slate-700 dark:text-slate-200">{{ row.name }}</span>
      </template>
      <template #cell-customer="{ row }">
        <span class="text-slate-500 dark:text-slate-400">{{ row.client }}</span>
      </template>
      <template #cell-status="{ row }">
        <BaseBadge :variant="row.status === 'Completed' ? 'success' : 'violet'">
          {{ row.status }}
        </BaseBadge>
      </template>
      <template #cell-progress="{ row }">
        <div class="flex min-w-28 items-center gap-2">
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div class="h-full rounded-full bg-violet-500" :style="{ width: `${row.progress}%` }" />
          </div>
          <span class="w-8 text-right text-[10px] text-slate-500 dark:text-slate-400">
            {{ row.progress }}%
          </span>
        </div>
      </template>
      <template #cell-tasks="{ row }">
        <span class="text-slate-500 dark:text-slate-400">
          {{ reportTasks.filter((task) => task.project === row.name).length }}
        </span>
      </template>
      <template #cell-due="{ row }">
        <span class="text-slate-500 dark:text-slate-400">{{ row.due }}</span>
      </template>
    </DataTable>
    <div
      class="flex flex-wrap justify-between gap-2 border-t border-slate-100 dark:border-slate-700 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 sm:px-5"
    >
      <span>Range: {{ startDate }} – {{ endDate }}</span>
      <span>Report generated {{ generatedDate }}</span>
    </div>
  </BaseCard>
</template>
