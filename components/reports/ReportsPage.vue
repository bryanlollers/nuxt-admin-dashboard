<script setup>
import { downloadCsv } from '~/utils/csv'
import { toDateInput } from '~/utils/date'
import { useNotificationStore } from '~/stores/notifications'
import { Download, Printer } from 'lucide-vue-next'
import { useProjectStore } from '~/stores/projects'
import { useTaskStore } from '~/stores/tasks'
import { useTeamStore } from '~/stores/team'

const notifications = useNotificationStore()

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const teamStore = useTeamStore()
const today = useAppDate()
const startDate = ref('2024-01-01')
const endDate = ref(today.value)
const invalidRange = computed(() => startDate.value > endDate.value)

const reportProjects = computed(() => {
  if (invalidRange.value) return []
  return projectStore.projects.filter((project) => {
    const date = toDateInput(project.due)
    if (!date) return false
    return date >= startDate.value && date <= endDate.value
  })
})
const reportTasks = computed(() => {
  const includedProjects = new Set(reportProjects.value.map((project) => project.name))
  return taskStore.tasks.filter((task) => includedProjects.has(task.project))
})

const projectSummary = computed(() => [
  { label: 'Total projects', value: reportProjects.value.length, color: 'bg-violet-500' },
  {
    label: 'In delivery',
    value: reportProjects.value.filter((project) => project.status !== 'Completed').length,
    color: 'bg-blue-500',
  },
  {
    label: 'Completed',
    value: reportProjects.value.filter((project) => project.status === 'Completed').length,
    color: 'bg-emerald-500',
  },
])
const taskSummary = computed(() => [
  {
    label: 'To do',
    value: reportTasks.value.filter((task) => task.status === 'To do').length,
    color: 'bg-amber-400',
  },
  {
    label: 'In progress',
    value: reportTasks.value.filter((task) => task.status === 'In progress').length,
    color: 'bg-violet-500',
  },
  {
    label: 'Completed',
    value: reportTasks.value.filter((task) => task.status === 'Completed').length,
    color: 'bg-emerald-500',
  },
])
const averageProgress = computed(() =>
  reportProjects.value.length
    ? Math.round(
        reportProjects.value.reduce((total, project) => total + project.progress, 0) /
          reportProjects.value.length,
      )
    : 0,
)
const completionRate = computed(() =>
  reportTasks.value.length
    ? Math.round(
        (reportTasks.value.filter((task) => task.done).length / reportTasks.value.length) * 100,
      )
    : 0,
)

function exportCsv() {
  const rows = [
    ['Project', 'Customer', 'Status', 'Progress', 'Due date', 'Tasks', 'Completed tasks'],
    ...reportProjects.value.map((project) => {
      const projectTasks = taskStore.tasks.filter((task) => task.project === project.name)
      return [
        project.name,
        project.client,
        project.status,
        `${project.progress}%`,
        project.due,
        projectTasks.length,
        projectTasks.filter((task) => task.done).length,
      ]
    }),
  ]
  downloadCsv(rows, 'sample-project-report.csv')
  notifications.announce('Report exported as CSV')
}

function printReport() {
  window.print()
}

function resetDateRange() {
  startDate.value = '2024-01-01'
  endDate.value = today.value
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:px-9 lg:py-8">
    <PageHeader
      eyebrow="BUSINESS INTELLIGENCE"
      title="Reports"
      description="A live snapshot of project delivery, team capacity, and task completion."
    >
      <template #actions>
        <BaseButton
          variant="secondary"
          class="flex-1 sm:flex-none"
          :disabled="invalidRange"
          @click="printReport"
        >
          <Printer :size="15" />
          Print
        </BaseButton>
        <BaseButton
          variant="primary"
          class="flex-1 sm:flex-none"
          :disabled="invalidRange"
          @click="exportCsv"
        >
          <Download :size="15" />
          Export CSV
        </BaseButton>
      </template>
    </PageHeader>

    <BaseCard class="mb-4 flex flex-wrap items-end gap-3 p-4 sm:p-5 print:hidden">
      <BaseInput
        v-model="startDate"
        label="From"
        type="date"
        :error="invalidRange ? 'Start date must be on or before end date.' : ''"
      />
      <BaseInput
        v-model="endDate"
        label="To"
        type="date"
        :error="invalidRange ? 'End date must be on or after start date.' : ''"
      />
      <p class="pb-2 text-xs text-slate-600 dark:text-slate-400">
        Report data is generated from the current local workspace.
      </p>
    </BaseCard>

    <ReportsSummaryCards
      :project-count="reportProjects.length"
      :average-progress="averageProgress"
      :completion-rate="completionRate"
      :team-count="teamStore.users.length"
    />

    <ReportsStatusCharts
      :project-summary="projectSummary"
      :task-summary="taskSummary"
      :report-projects="reportProjects"
      :report-tasks="reportTasks"
    />

    <ReportsProjectTable
      :report-projects="reportProjects"
      :report-tasks="reportTasks"
      :start-date="startDate"
      :end-date="endDate"
      :invalid-range="invalidRange"
      @retry="resetDateRange"
    />

    <ReportsTeamStats :report-projects="reportProjects" />
  </div>
</template>
