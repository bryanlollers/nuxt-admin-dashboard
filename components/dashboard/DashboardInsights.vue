<script setup>
import { useNavigationStore } from '~/stores/navigation'
import { useNotificationStore } from '~/stores/notifications'
import {
  CalendarDays,
  Check,
  Clock3,
  FileText,
  FolderKanban,
  MessageSquareText,
  Plus,
  UsersRound,
} from 'lucide-vue-next'
import { monthlyActivity, teamActivity, upcomingDeadlines } from '~/data/activity'
import { useProjectStore } from '~/stores/projects'
import { useTaskStore } from '~/stores/tasks'

const navigation = useNavigationStore()
const notifications = useNotificationStore()

const projectStore = useProjectStore()
const taskStore = useTaskStore()
const emit = defineEmits(['new-project'])

const activity = teamActivity
const deadlines = upcomingDeadlines
const projectStatuses = computed(() => {
  const statusGroups = [
    { label: 'On track', color: 'bg-emerald-500' },
    { label: 'In progress', color: 'bg-violet-500' },
    { label: 'Just started', color: 'bg-amber-400' },
  ]
  return statusGroups.map((status) => ({
    ...status,
    count: projectStore.projects.filter((project) => project.status === status.label).length,
  }))
})
const projectTotal = computed(() => projectStore.projects.length)
const taskStatuses = computed(() => [
  {
    label: 'Completed',
    count: taskStore.tasks.filter((task) => task.status === 'Completed').length,
    color: 'bg-emerald-500',
  },
  {
    label: 'In progress',
    count: taskStore.tasks.filter((task) => task.status === 'In progress').length,
    color: 'bg-violet-500',
  },
  {
    label: 'To do',
    count: taskStore.tasks.filter((task) => task.status === 'To do').length,
    color: 'bg-amber-400',
  },
])
const taskTotal = computed(() => taskStore.tasks.length)

function runQuickAction(action) {
  if (action === 'New project') {
    emit('new-project')
    return
  }

  const destinations = {
    'Add customer': 'Customers',
    'Invite team member': 'Team',
    'Create report': 'Reports',
    'Send update': 'Tasks',
  }
  const destination = destinations[action]

  if (destination) {
    navigation.navigateToSection(destination)
    return
  }

  notifications.announce(`${action} shortcut selected`)
}
</script>

<template>
  <section class="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-3" aria-label="Business analytics">
    <BaseCard class="p-4 sm:p-5">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Project status</h2>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {{ projectTotal }} projects across your workspace
          </p>
        </div>
        <FolderKanban :size="18" class="text-violet-500" />
      </div>
      <div
        class="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
        role="img"
        :aria-label="`${projectTotal} projects grouped by status`"
      >
        <span
          v-for="status in projectStatuses"
          :key="status.label"
          :class="status.color"
          :style="{ width: `${projectTotal ? (status.count / projectTotal) * 100 : 0}%` }"
        />
      </div>
      <div class="mt-4 space-y-3">
        <div
          v-for="status in projectStatuses"
          :key="status.label"
          class="flex items-center justify-between text-xs"
        >
          <span class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <i class="size-2 rounded-full" :class="status.color" />
            {{ status.label }}
          </span>
          <span class="font-semibold text-slate-700 dark:text-slate-200">
            {{ status.count }}
            <span class="font-normal text-slate-600 dark:text-slate-400">
              ({{ Math.round(projectTotal ? (status.count / projectTotal) * 100 : 0) }}%)
            </span>
          </span>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="p-4 sm:p-5">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Task status</h2>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {{ taskTotal.toLocaleString('en-US') }} tasks in your workspace
          </p>
        </div>
        <Check :size="18" class="text-emerald-700" />
      </div>
      <div
        class="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"
        role="img"
        :aria-label="`${taskTotal} tasks grouped by status`"
      >
        <span
          v-for="status in taskStatuses"
          :key="status.label"
          :class="status.color"
          :style="{ width: `${taskTotal ? (status.count / taskTotal) * 100 : 0}%` }"
        />
      </div>
      <div class="mt-4 space-y-3">
        <div
          v-for="status in taskStatuses"
          :key="status.label"
          class="flex items-center justify-between text-xs"
        >
          <span class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <i class="size-2 rounded-full" :class="status.color" />
            {{ status.label }}
          </span>
          <span class="font-semibold text-slate-700 dark:text-slate-200">
            {{ status.count.toLocaleString('en-US') }}
            <span class="font-normal text-slate-600 dark:text-slate-400">
              ({{ Math.round(taskTotal ? (status.count / taskTotal) * 100 : 0) }}%)
            </span>
          </span>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="p-4 sm:p-5">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Monthly activity</h2>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Projects and tasks completed
          </p>
        </div>
        <CalendarDays :size="18" class="text-violet-500" />
      </div>
      <div
        class="mt-5 flex h-32 items-end justify-between gap-2"
        role="img"
        aria-label="Monthly activity from May through October"
      >
        <div
          v-for="month in monthlyActivity"
          :key="month.month"
          class="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
        >
          <div class="flex h-24 w-full items-end justify-center gap-1">
            <span
              class="w-2.5 rounded-t bg-violet-500 sm:w-3 dark:bg-violet-400"
              :style="{ height: `${(month.projects / 60) * 100}%` }"
            />
            <span
              class="w-2.5 rounded-t bg-violet-200 sm:w-3 dark:bg-violet-800"
              :style="{ height: `${(month.tasks / 85) * 100}%` }"
            />
          </div>
          <span class="text-[10px] text-slate-600 dark:text-slate-400">{{ month.month }}</span>
        </div>
      </div>
      <div
        class="mt-3 flex items-center justify-center gap-4 text-[10px] text-slate-500 dark:text-slate-400"
      >
        <span class="inline-flex items-center gap-1.5">
          <i class="size-2 rounded-sm bg-violet-500" />
          Projects
        </span>
        <span class="inline-flex items-center gap-1.5">
          <i class="size-2 rounded-sm bg-violet-200 dark:bg-violet-800" />
          Tasks
        </span>
      </div>
    </BaseCard>
  </section>

  <section class="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-3" aria-label="Team and upcoming work">
    <BaseCard class="p-4 sm:p-5 xl:col-span-2">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Team activity</h2>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            See what your team has been up to
          </p>
        </div>
        <UsersRound :size="18" class="text-violet-500" />
      </div>
      <div class="mt-2 divide-y divide-slate-100 dark:divide-slate-700">
        <div
          v-for="(item, index) in activity"
          :key="`${item.name}-${index}`"
          class="flex items-center gap-3 py-3"
        >
          <span
            class="grid size-9 shrink-0 place-items-center rounded-full text-[10px] font-semibold"
            :class="item.tone"
          >
            {{ item.initials }}
          </span>
          <p class="min-w-0 flex-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            <strong class="font-semibold text-slate-700 dark:text-slate-200">
              {{ item.name }}
            </strong>
            {{ item.action }}
          </p>
          <span class="shrink-0 text-[10px] text-slate-600 dark:text-slate-400">
            {{ item.time }}
          </span>
        </div>
      </div>
      <BaseButton
        variant="ghost"
        size="small"
        class="!px-2 text-violet-600"
        @click="navigation.navigateToSection('Team')"
      >
        View team activity
      </BaseButton>
    </BaseCard>

    <BaseCard class="p-4 sm:p-5">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Upcoming deadlines</h2>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Keep the next milestones in sight
          </p>
        </div>
        <Clock3 :size="18" class="text-amber-700" />
      </div>
      <div class="mt-2 divide-y divide-slate-100 dark:divide-slate-700">
        <div
          v-for="deadline in deadlines"
          :key="`${deadline.project}-${deadline.title}`"
          class="flex items-center gap-3 py-3"
        >
          <div class="grid size-9 shrink-0 place-items-center rounded-lg" :class="deadline.tone">
            <CalendarDays :size="16" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
              {{ deadline.title }}
            </p>
            <p class="mt-0.5 text-[10px] text-slate-600 dark:text-slate-400">
              {{ deadline.project }}
            </p>
          </div>
          <div class="shrink-0 text-right">
            <p class="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
              {{ deadline.date }}
            </p>
            <p class="mt-0.5 text-[9px] text-slate-600 dark:text-slate-400">{{ deadline.days }}</p>
          </div>
        </div>
      </div>
      <BaseButton
        variant="ghost"
        size="small"
        class="!px-2 text-violet-600"
        @click="navigation.navigateToSection('Projects')"
      >
        View project timeline
      </BaseButton>
    </BaseCard>
  </section>

  <BaseCard class="mb-4 p-4 sm:p-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Quick actions</h2>
        <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Jump into your most common workflows
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <BaseButton variant="primary" size="small" @click="runQuickAction('New project')">
          <Plus :size="15" />
          New project
        </BaseButton>
        <BaseButton variant="secondary" size="small" @click="runQuickAction('Add customer')">
          <UsersRound :size="15" />
          Add customer
        </BaseButton>
        <BaseButton variant="secondary" size="small" @click="runQuickAction('Invite team member')">
          <UsersRound :size="15" />
          Invite team
        </BaseButton>
        <BaseButton variant="secondary" size="small" @click="runQuickAction('Create report')">
          <FileText :size="15" />
          Create report
        </BaseButton>
        <BaseButton variant="secondary" size="small" @click="runQuickAction('Send update')">
          <MessageSquareText :size="15" />
          Send update
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
