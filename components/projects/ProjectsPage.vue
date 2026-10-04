<script setup>
import { getInitials } from '~/utils/string'
import { toDateInput, formatDate } from '~/utils/date'
import { Pencil, Plus } from 'lucide-vue-next'
import { useCustomerStore } from '~/stores/customers'
import { useProjectStore } from '~/stores/projects'
import { useTaskStore } from '~/stores/tasks'
import { useTeamStore } from '~/stores/team'

const validationId = useId()
const focusValidationError = useValidationFocus()

const customerStore = useCustomerStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const teamStore = useTeamStore()
const formOpen = ref(false)
const detailsOpen = ref(false)
const deleteOpen = ref(false)
const selectedProject = ref(null)
const formErrors = ref({})
const form = reactive({ name: '', client: '', status: 'Planning', progress: 0, due: '', team: '' })

const customers = computed(() => [...new Set(customerStore.customers.map((item) => item.company))])
const relatedTasks = computed(() =>
  taskStore.tasks.filter((task) => task.project === selectedProject.value?.name),
)

function openCreate() {
  selectedProject.value = null
  Object.assign(form, { name: '', client: '', status: 'Planning', progress: 0, due: '', team: '' })
  formErrors.value = {}
  formOpen.value = true
}

function openEdit(project) {
  selectedProject.value = project
  Object.assign(form, {
    name: project.name,
    client: project.client,
    status: project.status,
    progress: project.progress,
    due: toDateInput(project.due),
    team: project.team.join(', '),
  })
  formErrors.value = {}
  formOpen.value = true
}

function saveProject() {
  formErrors.value = {}
  if (form.name.trim().length < 3) formErrors.value.name = 'Enter at least 3 characters.'
  if (!form.client) formErrors.value.client = 'Choose a customer.'
  if (!form.due) formErrors.value.due = 'Choose a due date.'
  if (Number(form.progress) < 0 || Number(form.progress) > 100) {
    formErrors.value.progress = 'Progress must be from 0 to 100.'
  }
  if (Object.keys(formErrors.value).length) {
    focusValidationError()
    return
  }

  const project = {
    id: selectedProject.value?.id || Date.now(),
    name: form.name.trim(),
    client: form.client,
    initials: getInitials(form.client),
    color: selectedProject.value?.color || 'lavender',
    progress: Number(form.progress),
    due: formatDate(form.due),
    team: form.team
      .split(',')
      .map((member) => member.trim().toUpperCase())
      .filter(Boolean),
    status: form.status,
  }
  projectStore.saveProject(project)
  formOpen.value = false
}

function deleteProject() {
  if (!selectedProject.value) return
  projectStore.deleteProject(selectedProject.value.id)
  deleteOpen.value = false
  detailsOpen.value = false
  selectedProject.value = null
}

function askDelete(project) {
  selectedProject.value = project
  deleteOpen.value = true
}

function editFromDetails() {
  if (!selectedProject.value) return
  const project = selectedProject.value
  detailsOpen.value = false
  openEdit(project)
}

function showDetails(project) {
  selectedProject.value = project
  detailsOpen.value = true
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:px-9 lg:py-8">
    <PageHeader
      eyebrow="DELIVERY WORKSPACE"
      title="Projects"
      description="Track customer work, delivery health, and upcoming milestones."
    >
      <template #actions>
        <BaseButton variant="primary" class="w-full sm:w-auto" @click="openCreate">
          <Plus :size="16" />
          New project
        </BaseButton>
      </template>
    </PageHeader>

    <ProjectsTable @view="showDetails" @edit="openEdit" @delete="askDelete" />

    <BaseModal
      v-model="formOpen"
      :title="selectedProject ? 'Edit project' : 'Create project'"
      description="Set the customer, delivery status, and project timeline."
    >
      <form
        id="project-form"
        class="grid gap-3 sm:grid-cols-2"
        @submit.prevent="saveProject"
        novalidate
      >
        <BaseInput
          v-model="form.name"
          label="Project name"
          placeholder="Website refresh"
          :error="formErrors.name"
          required
        />
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Customer</span>
          <select
            v-model="form.client"
            required
            :aria-invalid="Boolean(formErrors.client)"
            :aria-describedby="formErrors.client ? `${validationId}-client-error` : undefined"
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option value="">Select a customer</option>
            <option v-for="item in customerStore.customers" :key="item.id" :value="item.company">
              {{ item.company }}
            </option>
          </select>
          <small
            :id="`${validationId}-client-error`"
            role="alert"
            v-if="formErrors.client"
            class="font-normal text-rose-600 dark:text-rose-400"
          >
            {{ formErrors.client }}
          </small>
        </label>
        <BaseInput
          v-model="form.due"
          label="Due date"
          type="date"
          :error="formErrors.due"
          required
        />
        <BaseInput
          v-model="form.progress"
          label="Progress (%)"
          type="number"
          :error="formErrors.progress"
        />
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Status</span>
          <select
            v-model="form.status"
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option>Planning</option>
            <option>In progress</option>
            <option>On track</option>
            <option>In review</option>
            <option>At risk</option>
            <option>Completed</option>
          </select>
        </label>
        <BaseInput v-model="form.team" label="Team initials" placeholder="OR, PB, LS" />
      </form>
      <template #actions>
        <BaseButton variant="secondary" @click="formOpen = false">Cancel</BaseButton>
        <BaseButton variant="primary" type="submit" form="project-form">Save project</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      v-model="detailsOpen"
      :title="selectedProject?.name || 'Project details'"
      description="Project overview, delivery progress, team, and tasks."
    >
      <div v-if="selectedProject" class="space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <BaseBadge variant="violet">{{ selectedProject.client }}</BaseBadge>
          <BaseBadge :variant="selectedProject.status === 'Completed' ? 'success' : 'warning'">
            {{ selectedProject.status }}
          </BaseBadge>
        </div>
        <div>
          <div class="mb-2 flex justify-between text-xs">
            <span class="text-slate-500 dark:text-slate-400">Project progress</span>
            <strong class="text-slate-700 dark:text-slate-200">
              {{ selectedProject.progress }}%
            </strong>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              class="h-full rounded-full bg-violet-500"
              :style="{ width: `${selectedProject.progress}%` }"
            />
          </div>
        </div>
        <div>
          <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-200">Team members</h3>
          <div class="mt-2 flex flex-wrap gap-2">
            <BaseBadge v-for="member in selectedProject.team" :key="member" variant="neutral">
              {{ teamStore.users.find((user) => user.initials === member)?.name || member }}
            </BaseBadge>
          </div>
        </div>
        <div>
          <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-200">Tasks</h3>
          <div v-if="relatedTasks.length" class="mt-2 space-y-2">
            <div
              v-for="task in relatedTasks"
              :key="task.id"
              class="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 px-3 py-2 text-xs"
            >
              <span class="truncate">{{ task.title }}</span>
              <BaseBadge :variant="task.done ? 'success' : 'neutral'">{{ task.status }}</BaseBadge>
            </div>
          </div>
          <p v-else class="mt-2 text-xs text-slate-600 dark:text-slate-400">
            No tasks have been added to this project.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
          <div>
            <p
              class="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
            >
              Due date
            </p>
            <p class="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
              {{ selectedProject.due }}
            </p>
          </div>
          <div>
            <p
              class="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
            >
              Timeline
            </p>
            <p class="mt-1 text-xs font-medium text-slate-700 dark:text-slate-200">
              {{ selectedProject.progress === 100 ? 'Completed' : 'In delivery' }}
            </p>
          </div>
        </div>
        <div>
          <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-200">Activity</h3>
          <p
            class="mt-2 rounded-lg border border-slate-100 dark:border-slate-700 px-3 py-2 text-xs text-slate-500 dark:text-slate-400"
          >
            Project updated · {{ selectedProject.due }}
          </p>
        </div>
      </div>
      <template #actions>
        <BaseButton variant="secondary" @click="detailsOpen = false">Close</BaseButton>
        <BaseButton v-if="selectedProject" variant="primary" @click="editFromDetails">
          <Pencil :size="14" />
          Edit project
        </BaseButton>
      </template>
    </BaseModal>
    <ConfirmDialog
      v-model="deleteOpen"
      title="Delete project?"
      description="This project will be removed from the local workspace."
      confirm-label="Delete project"
      @confirm="deleteProject"
    />
  </div>
</template>
