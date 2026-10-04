<script setup>
import { useNavigationStore } from '~/stores/navigation'
import { useNotificationStore } from '~/stores/notifications'
import { ChevronRight, Ellipsis, Sparkles } from 'lucide-vue-next'
import { useTaskStore } from '~/stores/tasks'

const navigation = useNavigationStore()
const notifications = useNotificationStore()

const taskStore = useTaskStore()
const taskCompletion = computed(() =>
  taskStore.tasks.length
    ? Math.round((taskStore.completedTasks / taskStore.tasks.length) * 100)
    : 0,
)
</script>

<template>
  <BaseCard class="p-4 sm:p-5">
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">My tasks</h2>
        <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">A few things on your plate</p>
      </div>
      <BaseButton
        variant="ghost"
        size="icon"
        aria-label="Task options"
        @click="notifications.announce('Task options opened')"
      >
        <Ellipsis :size="20" />
      </BaseButton>
    </div>
    <div
      class="mt-4 flex items-center gap-2 rounded-lg bg-violet-50/70 p-2.5 dark:bg-violet-950/40"
    >
      <span
        class="grid size-7 place-items-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300"
      >
        <Sparkles :size="15" />
      </span>
      <span class="flex flex-1 flex-col gap-0.5">
        <strong class="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
          You’re on a roll!
        </strong>
        <small class="text-[10px] text-slate-600 dark:text-slate-400">
          {{ taskStore.completedTasks }} of {{ taskStore.tasks.length }} tasks completed
        </small>
      </span>
      <b class="text-[10px] font-semibold text-violet-700 dark:text-violet-300">
        {{ taskCompletion }}%
      </b>
    </div>
    <div class="mx-2 mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
      <div
        class="h-full rounded-full bg-violet-500 transition-all"
        :style="{ width: `${taskCompletion}%` }"
      />
    </div>
    <div class="mt-2 divide-y divide-slate-100 dark:divide-slate-700">
      <template v-if="taskStore.tasks.length">
        <label
          v-for="task in taskStore.tasks"
          :key="task.id"
          class="flex min-h-12 cursor-pointer items-center gap-2.5 py-2"
        >
          <input
            type="checkbox"
            :checked="task.done"
            class="outline-none size-3.5 cursor-pointer accent-violet-500 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
            @change="taskStore.toggleTask(task.id)"
          />
          <span
            class="flex min-w-0 flex-1 flex-col gap-0.5"
            :class="
              task.done
                ? 'text-slate-600 dark:text-slate-400 line-through'
                : 'text-slate-700 dark:text-slate-200'
            "
          >
            <strong class="truncate text-[11px] font-medium">{{ task.title }}</strong>
            <small class="text-[9px] text-slate-600 dark:text-slate-400">
              {{ task.project }}
            </small>
          </span>
          <BaseBadge
            :variant="
              task.priority === 'High'
                ? 'danger'
                : task.priority === 'Medium'
                  ? 'warning'
                  : 'neutral'
            "
          >
            {{ task.priority }}
          </BaseBadge>
        </label>
      </template>
      <EmptyState
        v-if="taskStore.tasks.length === 0"
        title="No tasks yet"
        description="Create a task to see your progress here."
      >
        <template #action>
          <BaseButton
            variant="secondary"
            size="small"
            @click="navigation.navigateToSection('Tasks')"
          >
            Go to tasks
          </BaseButton>
        </template>
      </EmptyState>
    </div>
    <BaseButton
      variant="ghost"
      size="small"
      class="mt-1 !px-2 text-violet-600"
      @click="navigation.navigateToSection('Tasks')"
    >
      View all tasks
      <ChevronRight :size="14" />
    </BaseButton>
  </BaseCard>
</template>
