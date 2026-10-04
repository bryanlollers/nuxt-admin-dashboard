<script setup>
import { getInitials } from '~/utils/string'
import { ArrowRight, Eye, GripVertical, Pencil, Plus, Search, Trash2 } from 'lucide-vue-next'
import { useTaskStore } from '~/stores/tasks'

const emit = defineEmits(['create', 'view', 'edit', 'delete'])
const taskStore = useTaskStore()
const search = ref('')
const moveAnnouncement = ref('')
const boardHintId = useId()
const priorityFilter = ref('All priorities')
const projectFilter = ref('All projects')
const draggedTaskId = ref(null)
const columns = ['To do', 'In progress', 'Completed']
const statuses = ['To do', 'In progress', 'Completed']
const tasksByStatus = computed(() => {
  const needle = search.value.trim().toLowerCase()
  const result = {}
  for (const status of statuses) {
    result[status] = taskStore.tasks.filter((task) => {
      const matchesQuery = `${task.title} ${task.project} ${task.assignee}`
        .toLowerCase()
        .includes(needle)
      return (
        task.status === status &&
        matchesQuery &&
        (priorityFilter.value === 'All priorities' || task.priority === priorityFilter.value) &&
        (projectFilter.value === 'All projects' || task.project === projectFilter.value)
      )
    })
  }
  return result
})
const taskProjects = computed(() => [...new Set(taskStore.tasks.map((task) => task.project))])

function startDrag(task) {
  draggedTaskId.value = task.id
}

function dropTask(status) {
  if (draggedTaskId.value === null) return
  const task = taskStore.tasks.find((item) => item.id === draggedTaskId.value)
  if (task) moveTask(task, status)
  draggedTaskId.value = null
}

async function moveTask(task, status) {
  taskStore.setTaskStatus(task.id, status)
  moveAnnouncement.value = `${task.title} moved to ${status}.`
  await nextTick()
  document.querySelector(`[data-task-id="${task.id}"] button`)?.focus()
}
</script>

<template>
  <p class="sr-only" role="status" aria-live="polite" aria-atomic="true">{{ moveAnnouncement }}</p>
  <p :id="boardHintId" class="sr-only">
    Use each task's actions button to move it between columns without dragging.
  </p>
  <div class="mb-4 flex flex-col gap-2 sm:flex-row">
    <label
      data-global-search
      class="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-slate-600 dark:text-slate-400 sm:max-w-sm"
    >
      <Search :size="15" />
      <input
        v-model="search"
        class="min-w-0 flex-1 text-xs text-slate-700 dark:text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
        placeholder="Search tasks, projects, assignees"
        aria-label="Search tasks"
      />
    </label>
    <BaseSelect
      v-model="priorityFilter"
      label="Filter tasks by priority"
      :options="['All priorities', 'High', 'Medium', 'Low']"
    />
    <BaseSelect
      v-model="projectFilter"
      label="Filter tasks by project"
      :options="['All projects', ...taskProjects]"
    />
  </div>

  <p class="mb-2 text-xs text-slate-600 dark:text-slate-400 lg:hidden">
    Swipe across the board to view each status. Use a task menu to move a task between columns.
  </p>
  <div
    tabindex="0"
    role="region"
    aria-label="Task board"
    :aria-describedby="boardHintId"
    class="focus-visible:ring-2 focus-visible:ring-violet-600 -mx-4 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-3"
  >
    <section
      v-for="(status, index) in columns"
      :key="status"
      class="w-[min(85vw,22rem)] shrink-0 snap-start rounded-xl border border-slate-200 bg-slate-100/70 p-3 sm:p-4 lg:w-auto lg:min-w-0 lg:shrink dark:border-slate-700 dark:bg-slate-700/70"
      :aria-label="`${status} tasks`"
      @dragover.prevent
      @drop.prevent="dropTask(status)"
    >
      <div class="mb-3 flex items-center justify-between px-1">
        <div class="flex items-center gap-2">
          <span
            class="size-2 rounded-full"
            :class="index === 0 ? 'bg-slate-400' : index === 1 ? 'bg-violet-500' : 'bg-emerald-500'"
          />
          <h2 class="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            {{ status }}
          </h2>
          <BaseBadge>{{ tasksByStatus[status].length }}</BaseBadge>
        </div>
        <BaseButton
          variant="ghost"
          size="icon"
          class="!size-7 text-slate-600 dark:text-slate-400"
          :aria-label="`Add task to ${status}`"
          @click="emit('create', status)"
        >
          <Plus :size="16" />
        </BaseButton>
      </div>
      <div class="min-h-36 space-y-3">
        <article
          v-for="task in tasksByStatus[status]"
          :key="task.id"
          :data-task-id="task.id"
          class="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm transition hover:border-violet-200 hover:shadow-md"
          draggable="true"
          @dragstart="startDrag(task)"
          @dragend="draggedTaskId = null"
        >
          <div class="flex items-start gap-2">
            <GripVertical
              :size="15"
              class="mt-0.5 shrink-0 cursor-grab text-slate-300 group-hover:text-slate-500 dark:text-slate-500"
            />
            <button
              type="button"
              class="outline-none min-w-0 flex-1 cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
              @click="emit('view', task)"
            >
              <span
                class="line-clamp-2 text-xs font-semibold leading-5 text-slate-800 dark:text-slate-100"
              >
                {{ task.title }}
              </span>
            </button>
            <BaseDropdown>
              <template #trigger="{ triggerAttrs }">
                <BaseButton
                  v-bind="triggerAttrs"
                  variant="ghost"
                  size="icon"
                  class="!size-7 -mr-1 -mt-1 text-slate-600 dark:text-slate-400"
                  :aria-label="`Actions for ${task.title}`"
                >
                  <span aria-hidden="true">···</span>
                </BaseButton>
              </template>
              <div class="flex flex-col p-1">
                <BaseButton
                  variant="ghost"
                  size="small"
                  class="!justify-start"
                  @click="emit('view', task)"
                >
                  <Eye :size="14" />
                  View details
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  class="!justify-start"
                  @click="emit('edit', task)"
                >
                  <Pencil :size="14" />
                  Edit task
                </BaseButton>
                <BaseButton
                  v-for="nextStatus in statuses.filter((item) => item !== task.status)"
                  :key="nextStatus"
                  variant="ghost"
                  size="small"
                  class="!justify-start"
                  @click="moveTask(task, nextStatus)"
                >
                  <ArrowRight :size="14" />
                  Move to {{ nextStatus }}
                </BaseButton>
                <BaseButton
                  variant="ghost"
                  size="small"
                  class="!justify-start text-rose-600"
                  @click="emit('delete', task)"
                >
                  <Trash2 :size="14" />
                  Delete task
                </BaseButton>
              </div>
            </BaseDropdown>
          </div>
          <p class="mt-2 truncate pl-6 text-[10px] text-slate-600 dark:text-slate-400">
            {{ task.project }}
          </p>
          <div class="mt-3 flex flex-wrap items-center justify-between gap-2 pl-6">
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
            <div class="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400">
              <span>{{ task.due }}</span>
              <span
                :aria-label="`Assigned to ${task.assignee}`"
                role="img"
                class="grid size-6 place-items-center rounded-full bg-violet-100 font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
              >
                {{ getInitials(task.assignee) }}
              </span>
            </div>
          </div>
        </article>
        <EmptyState
          v-if="tasksByStatus[status].length === 0"
          title="No tasks here"
          description="Drop a task in this column or add one."
        />
      </div>
    </section>
  </div>
</template>
