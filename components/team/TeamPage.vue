<script setup>
import { getInitials } from '~/utils/string'
import { isValidEmail } from '~/utils/validation'
import { Pencil, Plus } from 'lucide-vue-next'
import { useTeamStore } from '~/stores/team'
import { useProjectStore } from '~/stores/projects'

const focusValidationError = useValidationFocus()

const teamStore = useTeamStore()
const projectStore = useProjectStore()
const departments = computed(() => [...new Set(teamStore.users.map((user) => user.department))])
const formOpen = ref(false)
const detailsOpen = ref(false)
const deleteOpen = ref(false)
const selectedUser = ref(null)
const errors = ref({})
const form = reactive({
  name: '',
  email: '',
  role: '',
  department: 'Operations',
  phone: '',
  status: 'Active',
})

function openCreate() {
  selectedUser.value = null
  Object.assign(form, {
    name: '',
    email: '',
    role: '',
    department: 'Operations',
    phone: '',
    status: 'Active',
  })
  errors.value = {}
  formOpen.value = true
}

function openEdit(user) {
  selectedUser.value = user
  Object.assign(form, user)
  errors.value = {}
  formOpen.value = true
}

function saveUser() {
  errors.value = {}
  if (form.name.trim().length < 2) errors.value.name = 'Enter a name with at least 2 characters.'
  if (!isValidEmail(form.email)) errors.value.email = 'Enter a valid email address.'
  if (form.role.trim().length < 2) errors.value.role = 'Enter a role.'
  const duplicate = teamStore.users.some(
    (user) =>
      user.email.toLowerCase() === form.email.trim().toLowerCase() &&
      user.id !== selectedUser.value?.id,
  )
  if (duplicate) errors.value.email = 'A team member with this email already exists.'
  if (Object.keys(errors.value).length) {
    focusValidationError()
    return
  }

  const name = form.name.trim()
  teamStore.saveUser({
    id: selectedUser.value?.id || Date.now(),
    name,
    email: form.email.trim(),
    role: form.role.trim(),
    department: form.department,
    phone: form.phone.trim(),
    status: form.status,
    initials: getInitials(name),
    color: selectedUser.value?.color || 'violet',
  })
  formOpen.value = false
}

function deleteUser() {
  if (!selectedUser.value) return
  teamStore.deleteUser(selectedUser.value.id)
  deleteOpen.value = false
  detailsOpen.value = false
  selectedUser.value = null
}

function showDetails(user) {
  selectedUser.value = user
  detailsOpen.value = true
}

function askDelete(user) {
  selectedUser.value = user
  deleteOpen.value = true
}

function editFromDetails() {
  if (!selectedUser.value) return
  const user = selectedUser.value
  detailsOpen.value = false
  openEdit(user)
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:px-9 lg:py-8">
    <PageHeader
      eyebrow="PEOPLE & PERMISSIONS"
      title="Team"
      description="Manage teammates, roles, and availability across your workspace."
    >
      <template #actions>
        <BaseButton variant="primary" class="w-full sm:w-auto" @click="openCreate">
          <Plus :size="16" />
          Add team member
        </BaseButton>
      </template>
    </PageHeader>

    <section class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <MetricCard
        label="Team members"
        :value="String(teamStore.users.length)"
        change="4.2%"
        :positive="true"
        icon="T"
        tint="violet"
        :spark="[18, 22, 20, 28, 26, 34, 39]"
      />
      <MetricCard
        label="Active today"
        :value="String(teamStore.users.filter((user) => user.status === 'Active').length)"
        change="2.1%"
        :positive="true"
        icon="A"
        tint="green"
        :spark="[26, 22, 30, 28, 34, 31, 38]"
      />
      <MetricCard
        label="Departments"
        :value="String(departments.length)"
        change="1 new"
        :positive="true"
        icon="D"
        tint="blue"
        :spark="[14, 16, 18, 18, 23, 23, 29]"
      />
    </section>

    <TeamTable @view="showDetails" @edit="openEdit" @delete="askDelete" />

    <BaseModal
      v-model="formOpen"
      :title="selectedUser ? 'Edit team member' : 'Add team member'"
      description="Keep team profile and contact details up to date."
    >
      <form id="team-form" class="grid gap-3 sm:grid-cols-2" @submit.prevent="saveUser" novalidate>
        <BaseInput
          v-model="form.name"
          label="Full name"
          placeholder="Alex Morgan"
          :error="errors.name"
          required
        />
        <BaseInput
          v-model="form.email"
          label="Work email"
          type="email"
          placeholder="alex@sample.co"
          :error="errors.email"
          required
        />
        <BaseInput
          v-model="form.role"
          label="Role"
          placeholder="Product Designer"
          :error="errors.role"
          required
        />
        <BaseInput v-model="form.phone" label="Phone" type="tel" placeholder="+1 (555) 000-0000" />
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Department</span>
          <select
            v-model="form.department"
            class="outline-none h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option>Operations</option>
            <option>Design</option>
            <option>Engineering</option>
            <option>Marketing</option>
            <option>Sales</option>
            <option>Finance</option>
          </select>
        </label>
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Status</span>
          <select
            v-model="form.status"
            class="outline-none h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option>Active</option>
            <option>Away</option>
            <option>Inactive</option>
          </select>
        </label>
      </form>
      <template #actions>
        <BaseButton variant="secondary" @click="formOpen = false">Cancel</BaseButton>
        <BaseButton variant="primary" type="submit" form="team-form">Save member</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      v-model="detailsOpen"
      :title="selectedUser?.name || 'Team member'"
      description="Team member profile and contact information."
    >
      <div v-if="selectedUser" class="space-y-4">
        <div class="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
          <span
            class="grid size-12 place-items-center rounded-full bg-violet-100 font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
          >
            {{ selectedUser.initials }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-slate-800 dark:text-slate-100">{{ selectedUser.role }}</p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {{ selectedUser.department }}
            </p>
          </div>
          <BaseBadge
            :variant="
              selectedUser.status === 'Active'
                ? 'success'
                : selectedUser.status === 'Away'
                  ? 'warning'
                  : 'neutral'
            "
          >
            {{ selectedUser.status }}
          </BaseBadge>
        </div>
        <dl class="grid gap-4 sm:grid-cols-2">
          <div>
            <dt
              class="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
            >
              Email
            </dt>
            <dd class="mt-1 break-all text-sm text-slate-700 dark:text-slate-200">
              {{ selectedUser.email }}
            </dd>
          </div>
          <div>
            <dt
              class="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
            >
              Phone
            </dt>
            <dd class="mt-1 text-sm text-slate-700 dark:text-slate-200">
              {{ selectedUser.phone || 'Not provided' }}
            </dd>
          </div>
        </dl>
        <div>
          <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Assigned projects
          </h3>
          <p
            v-for="project in projectStore.projects.filter((item) =>
              item.team.includes(selectedUser.initials),
            )"
            :key="project.id"
            class="mt-2 rounded-lg border border-slate-100 dark:border-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300"
          >
            {{ project.name }} · {{ project.progress }}% complete
          </p>
          <p
            v-if="!projectStore.projects.some((item) => item.team.includes(selectedUser.initials))"
            class="mt-2 text-xs text-slate-600 dark:text-slate-400"
          >
            No projects assigned.
          </p>
        </div>
      </div>
      <template #actions>
        <BaseButton variant="secondary" @click="detailsOpen = false">Close</BaseButton>
        <BaseButton v-if="selectedUser" variant="primary" @click="editFromDetails">
          <Pencil :size="14" />
          Edit member
        </BaseButton>
      </template>
    </BaseModal>
    <ConfirmDialog
      v-model="deleteOpen"
      title="Remove team member?"
      description="This member will be removed from the local workspace."
      confirm-label="Remove member"
      @confirm="deleteUser"
    />
  </div>
</template>
