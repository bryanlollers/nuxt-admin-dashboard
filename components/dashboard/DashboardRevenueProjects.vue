<script setup>
import { useNavigationStore } from '~/stores/navigation'
import { useNotificationStore } from '~/stores/notifications'
import { useDashboardStore } from '~/stores/dashboard'
import { CalendarDays, ChevronDown, ChevronRight, Ellipsis, TrendingUp } from 'lucide-vue-next'
import { useProjectStore } from '~/stores/projects'

const navigation = useNavigationStore()
const notifications = useNotificationStore()
const dashboard = useDashboardStore()

const projectStore = useProjectStore()
const emit = defineEmits(['new-project'])

function toggleRange() {
  dashboard.setRange(dashboard.range === 'Last 30 days' ? 'Last 7 days' : 'Last 30 days')
}
</script>

<template>
  <section class="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]">
    <BaseCard class="p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Revenue overview</h2>
            <button
              type="button"
              class="outline-none grid size-6 cursor-pointer place-items-center rounded-full border border-slate-300 text-[10px] text-slate-600 dark:text-slate-400 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-slate-600 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
              aria-label="Revenue details"
            >
              i
            </button>
          </div>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">Track your income over time</p>
        </div>
        <BaseButton variant="secondary" size="small" @click="toggleRange">
          <CalendarDays :size="14" />
          {{ dashboard.range }}
          <ChevronDown :size="14" />
        </BaseButton>
      </div>
      <div class="mt-5 flex items-baseline gap-2.5">
        <strong
          class="font-[Manrope,sans-serif] text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50"
        >
          $48,294
          <span class="text-base text-slate-600 dark:text-slate-400">.00</span>
        </strong>
        <span class="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <TrendingUp :size="14" />
          12.8%
        </span>
        <span class="text-[10px] text-slate-600 dark:text-slate-400">vs. previous period</span>
      </div>
      <RevenueChart class="mt-3" />
      <div class="ml-9 mt-3 flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400">
        <span class="inline-flex items-center gap-1.5">
          <i class="size-2 rounded-sm bg-violet-500" />
          Revenue
        </span>
        <span class="inline-flex items-center gap-1.5">
          <i class="size-2 rounded-sm bg-violet-100" />
          Expenses
        </span>
        <span
          class="ml-auto hidden items-center gap-1.5 text-slate-600 dark:text-slate-400 sm:inline-flex"
        >
          Updated just now
          <i class="size-1.5 rounded-full bg-emerald-400" />
        </span>
      </div>
    </BaseCard>

    <BaseCard class="p-4 sm:p-5">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Active projects</h2>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Keep an eye on the good stuff
          </p>
        </div>
        <BaseButton
          variant="ghost"
          size="icon"
          aria-label="More project options"
          @click="notifications.announce('Project options opened')"
        >
          <Ellipsis :size="20" />
        </BaseButton>
      </div>
      <EmptyState
        v-if="projectStore.projects.length === 0"
        class="py-6"
        title="No projects yet"
        description="Create a project to start tracking delivery."
      >
        <template #action>
          <BaseButton variant="secondary" size="small" @click="$emit('new-project')">
            Create project
          </BaseButton>
        </template>
      </EmptyState>
      <div v-else class="mt-3 divide-y divide-slate-100 dark:divide-slate-700">
        <div v-for="project in projectStore.projects" :key="project.id" class="py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span
                class="grid size-8 place-items-center rounded-lg bg-violet-50 text-xs font-bold text-violet-600 dark:bg-violet-950/50 dark:text-violet-300"
              >
                {{ project.initials.slice(0, 1) }}
              </span>
              <span class="flex flex-col gap-0.5">
                <strong class="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  {{ project.name }}
                </strong>
                <small class="text-[10px] text-slate-600 dark:text-slate-400">
                  {{ project.client }}
                </small>
              </span>
            </div>
            <BaseButton
              variant="ghost"
              size="icon"
              class="!size-7"
              :aria-label="`More options for ${project.name}`"
              @click="notifications.announce(`${project.name} options`)"
            >
              <Ellipsis :size="17" />
            </BaseButton>
          </div>
          <div class="mt-2 flex justify-between text-[10px] text-slate-600 dark:text-slate-400">
            <span>{{ project.status }}</span>
            <b class="font-semibold text-slate-600 dark:text-slate-300">{{ project.progress }}%</b>
          </div>
          <div class="mt-1 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              class="h-full rounded-full bg-violet-400"
              :style="{ width: `${project.progress}%` }"
            />
          </div>
          <div
            class="mt-2 flex items-center justify-between text-[9px] text-slate-600 dark:text-slate-400"
          >
            <span class="inline-flex items-center gap-1">
              <CalendarDays :size="12" />
              Due {{ project.due.split(',')[0] }}
            </span>
            <span class="flex -space-x-1.5">
              <i
                v-for="(member, index) in project.team"
                :key="member"
                class="grid size-5 place-items-center rounded-full border-2 border-white bg-violet-100 text-[7px] not-italic text-violet-700 dark:border-slate-900 dark:bg-violet-950/60 dark:text-violet-300"
                :class="
                  index % 2
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
                    : ''
                "
              >
                {{ member }}
              </i>
            </span>
          </div>
        </div>
      </div>
      <BaseButton
        variant="ghost"
        size="small"
        class="mt-1 !px-2 text-violet-600"
        @click="navigation.navigateToSection('Projects')"
      >
        View all projects
        <ChevronRight :size="14" />
      </BaseButton>
    </BaseCard>
  </section>
</template>
