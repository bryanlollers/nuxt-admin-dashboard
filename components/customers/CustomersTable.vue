<script setup>
import { Eye, Pencil, Search, Trash2 } from 'lucide-vue-next'
import { useCustomerStore } from '~/stores/customers'

const emit = defineEmits(['view', 'edit', 'delete'])
const customerStore = useCustomerStore()
const search = ref('')
const status = ref('All status')
const sortBy = ref('name')
const sortDirection = ref('asc')
const page = ref(1)
const pageSize = 6
const columns = [
  { key: 'name', label: 'CUSTOMER' },
  { key: 'company', label: 'COMPANY' },
  { key: 'status', label: 'STATUS' },
  { key: 'spent', label: 'TOTAL SPENT' },
  { key: 'joined', label: 'CUSTOMER SINCE' },
]
const statusOptions = ['All status', 'Active', 'Pending', 'Inactive']
const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Company', value: 'company' },
  { label: 'Total spent', value: 'spent' },
  { label: 'Date joined', value: 'joined' },
]
const filteredCustomers = computed(() => {
  const needle = search.value.trim().toLowerCase()
  return customerStore.customers
    .filter((customer) => {
      const matchesSearch = `${customer.name} ${customer.email} ${customer.company}`
        .toLowerCase()
        .includes(needle)
      return matchesSearch && (status.value === 'All status' || customer.status === status.value)
    })
    .sort((first, second) => {
      let comparison
      if (sortBy.value === 'spent') {
        comparison =
          Number(first.spent.replace(/[^\d.-]/g, '')) - Number(second.spent.replace(/[^\d.-]/g, ''))
      } else if (sortBy.value === 'joined') {
        comparison = new Date(first.joined).getTime() - new Date(second.joined).getTime()
      } else {
        comparison = String(first[sortBy.value] || '').localeCompare(
          String(second[sortBy.value] || ''),
          'en-US',
          { numeric: true },
        )
      }
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
})
const pageCount = computed(() => Math.max(1, Math.ceil(filteredCustomers.value.length / pageSize)))
const pagedCustomers = computed(() =>
  filteredCustomers.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)
const rangeStart = computed(() =>
  filteredCustomers.value.length ? (page.value - 1) * pageSize + 1 : 0,
)
const rangeEnd = computed(() => Math.min(page.value * pageSize, filteredCustomers.value.length))

function resetPage() {
  page.value = 1
}

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})
</script>

<template>
  <BaseCard class="overflow-hidden">
    <div
      class="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-700 p-4 sm:flex-row sm:items-center sm:p-5"
    >
      <label
        data-global-search
        class="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 text-slate-600 dark:text-slate-400 sm:max-w-sm"
      >
        <Search :size="15" />
        <input
          v-model="search"
          class="min-w-0 flex-1 text-xs text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          placeholder="Search name, email, or company"
          aria-label="Search customers"
          @input="resetPage"
        />
      </label>
      <div class="flex flex-wrap gap-2">
        <BaseSelect
          v-model="status"
          label="Filter customers by status"
          :options="statusOptions"
          @change="resetPage"
        />
        <BaseSelect v-model="sortBy" label="Sort customers by" :options="sortOptions" />
        <BaseButton
          variant="secondary"
          size="small"
          :aria-label="`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`"
          @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'"
        >
          {{ sortDirection === 'asc' ? 'A–Z' : 'Z–A' }}
        </BaseButton>
      </div>
    </div>

    <DataTable
      label="Customers"
      :columns="columns"
      :rows="pagedCustomers"
      empty-title="No customers found"
      empty-description="Try another search or status filter, or add a customer."
    >
      <template #cell-name="{ row }">
        <button
          type="button"
          class="outline-none flex cursor-pointer items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          @click="emit('view', row)"
        >
          <span
            class="grid size-9 shrink-0 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
          >
            {{ row.initials }}
          </span>
          <span class="flex min-w-0 flex-col gap-1">
            <strong class="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {{ row.name }}
            </strong>
            <small class="text-[10px] text-slate-600 dark:text-slate-400">{{ row.email }}</small>
          </span>
        </button>
      </template>
      <template #cell-company="{ row }">
        <span class="text-xs text-slate-600 dark:text-slate-300">{{ row.company }}</span>
      </template>
      <template #cell-status="{ row }">
        <BaseBadge
          :variant="
            row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'neutral'
          "
        >
          {{ row.status }}
        </BaseBadge>
      </template>
      <template #cell-spent="{ row }">
        <strong class="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {{ row.spent }}
        </strong>
      </template>
      <template #cell-joined="{ row }">
        <span class="text-xs text-slate-500 dark:text-slate-400">{{ row.joined }}</span>
      </template>
      <template #actions="{ row }">
        <BaseDropdown>
          <template #trigger="{ triggerAttrs }">
            <BaseButton
              v-bind="triggerAttrs"
              variant="ghost"
              size="icon"
              class="!size-8"
              :aria-label="`Actions for ${row.name}`"
            >
              <span aria-hidden="true">···</span>
            </BaseButton>
          </template>
          <div class="flex flex-col p-1">
            <BaseButton
              variant="ghost"
              size="small"
              class="!justify-start"
              @click="emit('view', row)"
            >
              <Eye :size="14" />
              View details
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="small"
              class="!justify-start"
              @click="emit('edit', row)"
            >
              <Pencil :size="14" />
              Edit customer
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="small"
              class="!justify-start text-rose-600"
              @click="emit('delete', row)"
            >
              <Trash2 :size="14" />
              Delete customer
            </BaseButton>
          </div>
        </BaseDropdown>
      </template>
    </DataTable>
    <Pagination
      :page="page"
      :page-count="pageCount"
      :start="rangeStart"
      :end="rangeEnd"
      :total="filteredCustomers.length"
      item-label="customers"
      @update:page="page = $event"
    />
  </BaseCard>
</template>
