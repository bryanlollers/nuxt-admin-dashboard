<script setup>
import { getInitials } from '~/utils/string'
import { isValidEmail } from '~/utils/validation'
import { formatDate } from '~/utils/date'
import { Pencil, Plus } from 'lucide-vue-next'
import { useCustomerStore } from '~/stores/customers'
import { useProjectStore } from '~/stores/projects'

const focusValidationError = useValidationFocus()

const customerStore = useCustomerStore()
const projectStore = useProjectStore()
const formOpen = ref(false)
const detailsOpen = ref(false)
const deleteOpen = ref(false)
const selectedCustomer = ref(null)
const formErrors = ref({})
const operationError = ref('')
const form = reactive({ name: '', email: '', company: '', phone: '', status: 'Active' })

const relatedProjects = computed(() =>
  projectStore.projects.filter((project) => project.client === selectedCustomer.value?.company),
)

function openCreate() {
  selectedCustomer.value = null
  Object.assign(form, { name: '', email: '', company: '', phone: '', status: 'Active' })
  formErrors.value = {}
  formOpen.value = true
}

function openEdit(customer) {
  selectedCustomer.value = customer
  Object.assign(form, {
    name: customer.name,
    email: customer.email,
    company: customer.company,
    phone: customer.phone || '',
    status: customer.status,
  })
  formErrors.value = {}
  formOpen.value = true
}

function validateForm() {
  formErrors.value = {}
  if (form.name.trim().length < 2)
    formErrors.value.name = 'Enter a name with at least 2 characters.'
  if (!isValidEmail(form.email)) formErrors.value.email = 'Enter a valid email address.'
  if (form.company.trim().length < 2) formErrors.value.company = 'Enter a company name.'
  const duplicate = customerStore.customers.some(
    (customer) =>
      customer.email.toLowerCase() === form.email.trim().toLowerCase() &&
      customer.id !== selectedCustomer.value?.id,
  )
  if (duplicate) formErrors.value.email = 'A customer with this email already exists.'
  return Object.keys(formErrors.value).length === 0
}

function saveCustomer() {
  operationError.value = ''
  if (!validateForm()) {
    focusValidationError()
    return
  }
  const name = form.name.trim()
  const email = form.email.trim()
  const company = form.company.trim()
  const customer = {
    id: selectedCustomer.value?.id || Date.now(),
    name,
    email,
    company,
    phone: form.phone.trim(),
    status: form.status,
    initials: getInitials(name),
    color: selectedCustomer.value?.color || 'violet',
    spent: selectedCustomer.value?.spent || '$0',
    joined: selectedCustomer.value?.joined || formatDate(new Date()),
  }
  try {
    customerStore.saveCustomer(customer)
    formOpen.value = false
  } catch {
    operationError.value = 'Your customer changes could not be saved. Please try again.'
  }
}

function askDelete(customer) {
  selectedCustomer.value = customer
  deleteOpen.value = true
}

function deleteCustomer() {
  if (!selectedCustomer.value) return
  customerStore.deleteCustomer(selectedCustomer.value.id)
  deleteOpen.value = false
  detailsOpen.value = false
  selectedCustomer.value = null
}

function showDetails(customer) {
  selectedCustomer.value = customer
  detailsOpen.value = true
}

function editFromDetails() {
  if (!selectedCustomer.value) return
  const customer = selectedCustomer.value
  detailsOpen.value = false
  openEdit(customer)
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:px-9 lg:py-8">
    <PageHeader
      eyebrow="CUSTOMER RELATIONSHIPS"
      title="Customers"
      description="Manage your customer profiles, contacts, and account activity."
    >
      <template #actions>
        <BaseButton variant="primary" class="w-full sm:w-auto" @click="openCreate">
          <Plus :size="16" />
          Add customer
        </BaseButton>
      </template>
    </PageHeader>

    <CustomersTable @view="showDetails" @edit="openEdit" @delete="askDelete" />

    <BaseModal
      v-model="formOpen"
      :title="selectedCustomer ? 'Edit customer' : 'Add customer'"
      description="Keep contact details and account status up to date."
    >
      <ErrorState
        v-if="operationError"
        title="Could not save customer"
        :description="operationError"
        @retry="saveCustomer"
      />
      <form
        v-else
        id="customer-form"
        class="grid gap-3 sm:grid-cols-2"
        @submit.prevent="saveCustomer"
        novalidate
      >
        <BaseInput
          v-model="form.name"
          label="Full name"
          placeholder="Alex Morgan"
          :error="formErrors.name"
          required
        />
        <BaseInput
          v-model="form.email"
          label="Email address"
          type="email"
          placeholder="alex@example.com"
          :error="formErrors.email"
          required
        />
        <BaseInput
          v-model="form.company"
          label="Company"
          placeholder="Acme, Inc."
          :error="formErrors.company"
          required
        />
        <BaseInput
          v-model="form.phone"
          label="Phone number"
          type="tel"
          placeholder="+1 (555) 000-0000"
        />
        <label class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
          <span>Status</span>
          <select
            v-model="form.status"
            class="h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm outline-none focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          >
            <option>Active</option>
            <option>Pending</option>
            <option>Inactive</option>
          </select>
        </label>
      </form>
      <template #actions>
        <BaseButton variant="secondary" @click="formOpen = false">Cancel</BaseButton>
        <BaseButton variant="primary" type="submit" form="customer-form">Save customer</BaseButton>
      </template>
    </BaseModal>

    <BaseModal
      v-model="detailsOpen"
      :title="selectedCustomer?.name || 'Customer details'"
      description="Customer profile and account activity."
    >
      <div v-if="selectedCustomer" class="space-y-5">
        <div class="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
          <span
            class="grid size-12 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
          >
            {{ selectedCustomer.initials }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-slate-800 dark:text-slate-100">
              {{ selectedCustomer.company }}
            </p>
            <p class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
              Customer since {{ selectedCustomer.joined }}
            </p>
          </div>
          <BaseBadge
            :variant="
              selectedCustomer.status === 'Active'
                ? 'success'
                : selectedCustomer.status === 'Pending'
                  ? 'warning'
                  : 'neutral'
            "
          >
            {{ selectedCustomer.status }}
          </BaseBadge>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <p
              class="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
            >
              Email
            </p>
            <p class="mt-1 break-all text-sm text-slate-700 dark:text-slate-200">
              {{ selectedCustomer.email }}
            </p>
          </div>
          <div>
            <p
              class="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
            >
              Phone
            </p>
            <p class="mt-1 text-sm text-slate-700 dark:text-slate-200">
              {{ selectedCustomer.phone || 'Not provided' }}
            </p>
          </div>
          <div>
            <p
              class="text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400"
            >
              Lifetime value
            </p>
            <p class="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {{ selectedCustomer.spent }}
            </p>
          </div>
        </div>
        <div>
          <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-200">Projects</h3>
          <div v-if="relatedProjects.length" class="mt-2 space-y-2">
            <div
              v-for="project in relatedProjects"
              :key="project.id"
              class="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-700 px-3 py-2 text-xs"
            >
              <span>{{ project.name }}</span>
              <span class="text-slate-600 dark:text-slate-400">
                {{ project.progress }}% complete
              </span>
            </div>
          </div>
          <p v-else class="mt-2 text-xs text-slate-600 dark:text-slate-400">
            No projects linked to this customer yet.
          </p>
        </div>
        <div>
          <h3 class="text-xs font-semibold text-slate-700 dark:text-slate-200">Recent activity</h3>
          <p
            class="mt-2 rounded-lg border border-slate-100 dark:border-slate-700 px-3 py-2 text-xs text-slate-500 dark:text-slate-400"
          >
            Account profile viewed · {{ selectedCustomer.joined }}
          </p>
        </div>
      </div>
      <template #actions>
        <BaseButton variant="secondary" @click="detailsOpen = false">Close</BaseButton>
        <BaseButton v-if="selectedCustomer" variant="primary" @click="editFromDetails">
          <Pencil :size="14" />
          Edit customer
        </BaseButton>
      </template>
    </BaseModal>

    <ConfirmDialog
      v-model="deleteOpen"
      title="Delete customer?"
      description="This customer will be removed from your local workspace."
      confirm-label="Delete customer"
      @confirm="deleteCustomer"
    />
  </div>
</template>
