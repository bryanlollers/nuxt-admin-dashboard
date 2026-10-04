<script setup>
import { formatDate } from '~/utils/date'
import { useNotificationStore } from '~/stores/notifications'
import { Download, Plus } from 'lucide-vue-next'

const notifications = useNotificationStore()

const projectModalOpen = ref(false)
const today = useAppDate()
const todayLabel = formatDate(today.value, {
  weekday: 'long',
  month: 'long',
  day: '2-digit',
  year: 'numeric',
}).toUpperCase()

function exportReport() {
  notifications.announce('Customer report exported')
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:px-9 lg:py-8">
    <PageHeader
      :eyebrow="todayLabel"
      title="Good morning, Jordan"
      description="Here's what's happening with your business today."
    >
      <template #actions>
        <BaseButton variant="secondary" class="flex-1 sm:flex-none" @click="exportReport">
          <Download :size="16" />
          Export report
        </BaseButton>
        <BaseButton variant="primary" class="flex-1 sm:flex-none" @click="projectModalOpen = true">
          <Plus :size="17" />
          New project
        </BaseButton>
      </template>
    </PageHeader>

    <DashboardMetrics />
    <DashboardRevenueProjects @new-project="projectModalOpen = true" />
    <DashboardInsights @new-project="projectModalOpen = true" />

    <section class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
      <DashboardCustomerTable />
      <DashboardTaskCard />
    </section>

    <footer
      class="mt-5 flex flex-wrap items-center justify-between gap-3 px-1 text-[10px] text-slate-600 dark:text-slate-400"
    >
      <span>&copy; 2024 Sample, Inc.</span>
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="outline-none cursor-pointer px-1 py-2 hover:text-slate-700 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          @click="notifications.announce('Help center opened')"
        >
          Help center
        </button>
        <span>&middot;</span>
        <button
          type="button"
          class="outline-none cursor-pointer px-1 py-2 hover:text-slate-700 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          @click="notifications.announce('Privacy settings opened')"
        >
          Privacy
        </button>
        <span>&middot;</span>
        <button
          type="button"
          class="outline-none cursor-pointer px-1 py-2 hover:text-slate-700 dark:hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          @click="notifications.announce('Terms opened')"
        >
          Terms
        </button>
      </div>
      <span class="inline-flex items-center gap-1.5">
        <i class="size-1.5 rounded-full bg-emerald-500" />
        All systems operational
      </span>
    </footer>

    <DashboardProjectModal v-model="projectModalOpen" />
  </div>
</template>
