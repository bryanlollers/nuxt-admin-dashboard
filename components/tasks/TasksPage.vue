<script setup>
import { toDateInput, formatDate } from '~/utils/date'
import { Pencil, Plus } from 'lucide-vue-next'
import { useTaskStore } from '~/stores/tasks'
import { useProjectStore } from '~/stores/projects'
import { useTeamStore } from '~/stores/team'

const validationId = useId()
const focusValidationError = useValidationFocus()

const taskStore = useTaskStore()
const projectStore = useProjectStore()
const teamStore = useTeamStore()
const formOpen = ref(false)
const detailsOpen = ref(false)
const deleteOpen = ref(false)
const selectedTask = ref(null)
const formErrors = ref({})
const form = reactive({
  title: '',
  project: '',
  priority: 'Medium',
  status: 'To do',
  due: '',
  assignee: '',
})

const statuses = ['To do', 'In progress', 'Completed']

function openCreate() {
  selectedTask.value = null
  Object.assign(form, {
    title: '',
    project: projectStore.projects[0]?.name || '',
    priority: 'Medium',
    status: 'To do',
    due: '',
    assignee: teamStore.users[0]?.name || '',
  })
  formErrors.value = {}
  formOpen.value = true
}

function openCreateForStatus(status) {
  openCreate()
  form.status = status
}

function openEdit(task) {
  selectedTask.value = task
  Object.assign(form, {
    title: task.title,
    project: task.project,
    priority: task.priority,
    status: task.status,
    due: toDateInput(task.due),
    assignee: task.assignee,
  })
  formErrors.value = {}
  formOpen.value = true
}

function saveTask() {
  formErrors.value = {}
  if (form.title.trim().length < 3) formErrors.value.title = 'Enter at least 3 characters.'
  if (!form.project) formErrors.value.project = 'Choose a project.'
  if (!form.assignee) formErrors.value.assignee = 'Choose an assignee.'
  if (Object.keys(formErrors.value).length) {
    focusValidationError()
    return
  }

  taskStore.saveTask({
    id: selectedTask.value?.id || Date.now(),
    title: form.title.trim(),
    project: form.project,
    priority: form.priority,
    status: form.status,
    due: form.due
      ? formatDate(form.due, { month: 'short', day: 'numeric', year: 'numeric' })
      : 'No due date',
    assignee: form.assignee,
    done: form.status === 'Completed',
  })
  formOpen.value = false
}

function updateSelectedStatus(event) {
  if (!selectedTask.value) return
  const status = event.target.value
  taskStore.setTaskStatus(selectedTask.value.id, status)
  selectedTask.value.status = status
  selectedTask.value.done = status === 'Completed'
}

function askDelete(task) {
  selectedTask.value = task
  deleteOpen.value = true
}

function editFromDetails() {
  if (!selectedTask.value) return
  const task = selectedTask.value
  detailsOpen.value = false
  openEdit(task)
}

function deleteTask() {
  if (!selectedTask.value) return
  taskStore.deleteTask(selectedTask.value.id)
  detailsOpen.value = false
  deleteOpen.value = false
  selectedTask.value = null
}

function showDetails(task) {
  selectedTask.value = task
  detailsOpen.value = true
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:px-9 lg:py-8">
    <PageHeader
      eyebrow="TEAM WORKFLOW"
      title="Tasks"
      description="Plan work, set ownership, and move tasks through delivery."
    >
      <template #actions>
        <BaseButton variant="primary" class="w-full sm:w-auto" @click="openCreate">
          <Plus :size="16" />
          New task
        </BaseButton>
      </template>
    </PageHeader>

    <TasksBoard
      @create="openCreateForStatus"
      @view="showDetails"
      @edit="openEdit"
      @delete="askDelete"
    />

    <BaseModal
      v-model="formOpen"
      :title="selectedTask ? 'Edit task' : 'Create task'"
      description="Add clear ownership, priority, and a due date."
    >
      <form id="task-form" class="grid gap-3 sm:grid-cols-2" @submit.prevent="saveTask" novalidate>
        <div class="sm:col-span-2">
          <BaseInput
            v-model="form.title"
            label="Task title"
            placeholder="Prepare project kickoff"
            :error="formErrors.title"
            required
          />
        </div>
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Project</span>
          <select
            v-model="form.project"
            required
            :aria-invalid="Boolean(formErrors.project)"
            :aria-describedby="formErrors.project ? `${validationId}-project-error` : undefined"
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option value="">Select a project</option>
            <option
              v-for="project in projectStore.projects"
              :key="project.id"
              :value="project.name"
            >
              {{ project.name }}
            </option>
          </select>
          <small
            :id="`${validationId}-project-error`"
            role="alert"
            v-if="formErrors.project"
            class="font-normal text-rose-600 dark:text-rose-400"
          >
            {{ formErrors.project }}
          </small>
        </label>
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Assignee</span>
          <select
            v-model="form.assignee"
            required
            :aria-invalid="Boolean(formErrors.assignee)"
            :aria-describedby="formErrors.assignee ? `${validationId}-assignee-error` : undefined"
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option value="">Select a teammate</option>
            <option v-for="user in teamStore.users" :key="user.id" :value="user.name">
              {{ user.name }}
            </option>
          </select>
          <small
            :id="`${validationId}-assignee-error`"
            role="alert"
            v-if="formErrors.assignee"
            class="font-normal text-rose-600 dark:text-rose-400"
          >
            {{ formErrors.assignee }}
          </small>
        </label>
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Status</span>
          <select
            v-model="form.status"
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option v-for="option in statuses" :key="option">{{ option }}</option>
          </select>
        </label>
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Priority</span>
          <select
            v-model="form.priority"
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </label>
        <BaseInput v-model="form.due" label="Due date" type="date" />
      </form>
      <template #actions>
        <BaseButton variant="secondary" @click="formOpen = false">Cancel</BaseButton>
        <BaseButton variant="primary" type="submit" form="task-form">Save task</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      v-model="detailsOpen"
      :title="selectedTask?.title || 'Task details'"
      description="Task ownership, status, and delivery information."
    >
      <div v-if="selectedTask" class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <BaseBadge
            :variant="
              selectedTask.priority === 'High'
                ? 'danger'
                : selectedTask.priority === 'Medium'
                  ? 'warning'
                  : 'neutral'
            "
          >
            {{ selectedTask.priority }} priority
          </BaseBadge>
          <BaseBadge :variant="selectedTask.done ? 'success' : 'violet'">
            {{ selectedTask.status }}
          </BaseBadge>
        </div>
        <dl class="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 dark:bg-slate-800 p-4 text-xs">
          <div>
            <dt class="text-slate-600 dark:text-slate-400">Project</dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-200">
              {{ selectedTask.project }}
            </dd>
          </div>
          <div>
            <dt class="text-slate-600 dark:text-slate-400">Assignee</dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-200">
              {{ selectedTask.assignee }}
            </dd>
          </div>
          <div>
            <dt class="text-slate-600 dark:text-slate-400">Due date</dt>
            <dd class="mt-1 font-medium text-slate-700 dark:text-slate-200">
              {{ selectedTask.due }}
            </dd>
          </div>
        </dl>
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Move task</span>
          <select
            :value="selectedTask.status"
            class="outline-none h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
            @change="updateSelectedStatus"
          >
            <option v-for="option in statuses" :key="option">{{ option }}</option>
          </select>
        </label>
      </div>
      <template #actions>
        <BaseButton variant="secondary" @click="detailsOpen = false">Close</BaseButton>
        <BaseButton v-if="selectedTask" variant="primary" @click="editFromDetails">
          <Pencil :size="14" />
          Edit task
        </BaseButton>
      </template>
    </BaseModal>
    <ConfirmDialog
      v-model="deleteOpen"
      title="Delete task?"
      description="This task will be removed from the local workspace."
      confirm-label="Delete task"
      @confirm="deleteTask"
    />
  </div>
</template>
