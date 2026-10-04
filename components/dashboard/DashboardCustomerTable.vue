<script setup>
import { useNavigationStore } from '~/stores/navigation'
import { useNotificationStore } from '~/stores/notifications'
import { ChevronRight, Ellipsis, Filter, Search, UsersRound } from 'lucide-vue-next'
import { useCustomerStore } from '~/stores/customers'

const navigation = useNavigationStore()
const notifications = useNotificationStore()

const customerStore = useCustomerStore()
const search = ref('')
const status = ref('All status')
const statusOptions = ['All status', 'Active', 'Pending', 'Inactive']
const customerColumns = [
  { key: 'selection', label: '' },
  { key: 'name', label: 'NAME' },
  { key: 'company', label: 'COMPANY' },
  { key: 'status', label: 'STATUS' },
  { key: 'spent', label: 'TOTAL SPENT' },
  { key: 'joined', label: 'JOINED' },
]
const startItem = computed(() =>
  customerStore.filteredCustomers.length
    ? (customerStore.page - 1) * customerStore.pageSize + 1
    : 0,
)
const endItem = computed(() =>
  Math.min(customerStore.page * customerStore.pageSize, customerStore.filteredCustomers.length),
)

function onSearch() {
  customerStore.setQuery(search.value)
}
function onStatus() {
  customerStore.setStatus(status.value)
}
function clearCustomerFilters() {
  search.value = ''
  status.value = 'All status'
  customerStore.setQuery('')
  customerStore.setStatus('All status')
}
</script>

<template>
  <BaseCard class="overflow-hidden pt-4">
    <div class="flex items-start justify-between px-4 pb-3 sm:px-5">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Recent customers</h2>
          <BaseBadge variant="violet">{{ customerStore.customers.length }}</BaseBadge>
        </div>
        <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
          A little hello to your newest customers
        </p>
      </div>
      <BaseButton
        variant="ghost"
        size="small"
        class="text-violet-600"
        @click="navigation.navigateToSection('Customers')"
      >
        View all
        <ChevronRight :size="14" />
      </BaseButton>
    </div>
    <div class="flex flex-wrap items-center gap-2 px-4 pb-3 sm:px-5">
      <label
        class="customer-search flex h-9 min-w-40 flex-1 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 text-slate-600 dark:text-slate-400 sm:max-w-56"
      >
        <Search :size="15" />
        <input
          v-model="search"
          class="min-w-0 flex-1 text-xs text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          placeholder="Search customers..."
          aria-label="Search customers"
          @input="onSearch"
        />
      </label>
      <BaseSelect
        v-model="status"
        label="Filter customers by status"
        :options="statusOptions"
        @change="onStatus"
      />
      <BaseButton
        variant="secondary"
        size="small"
        @click="notifications.announce('Showing all customer filters')"
      >
        <Filter :size="14" />
        <span class="hidden sm:inline">Filters</span>
      </BaseButton>
    </div>
    <DataTable
      label="Customers"
      :columns="customerColumns"
      :rows="customerStore.pagedCustomers"
      empty-title="No customers found"
      empty-description="Try another name or status filter."
    >
      <template #emptyIcon>
        <UsersRound :size="22" class="text-slate-300 dark:text-slate-500" />
      </template>
      <template #header-selection>
        <input
          type="checkbox"
          aria-label="Select all customers"
          class="outline-none size-3.5 cursor-pointer accent-violet-500 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
        />
      </template>
      <template #cell-selection="{ row }">
        <input
          type="checkbox"
          :aria-label="`Select ${row.name}`"
          class="outline-none size-3.5 cursor-pointer accent-violet-500 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
        />
      </template>
      <template #cell-name="{ row }">
        <div class="flex items-center gap-2.5">
          <span
            class="grid size-8 place-items-center rounded-full bg-violet-100 text-[9px] font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
          >
            {{ row.initials }}
          </span>
          <span class="flex flex-col gap-0.5">
            <strong class="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {{ row.name }}
            </strong>
            <small class="text-[10px] text-slate-600 dark:text-slate-400">
              {{ row.email }}
            </small>
          </span>
        </div>
      </template>
      <template #cell-company="{ row }">
        <span class="text-xs text-slate-500 dark:text-slate-400">{{ row.company }}</span>
      </template>
      <template #cell-status="{ row }">
        <BaseBadge
          :variant="
            row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'neutral'
          "
        >
          <i
            class="size-1.5 rounded-full"
            :class="
              row.status === 'Active'
                ? 'bg-emerald-500'
                : row.status === 'Pending'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
            "
          />
          {{ row.status }}
        </BaseBadge>
      </template>
      <template #cell-spent="{ row }">
        <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {{ row.spent }}
        </span>
      </template>
      <template #cell-joined="{ row }">
        <span class="text-xs text-slate-500 dark:text-slate-400">{{ row.joined }}</span>
      </template>
      <template #actions="{ row }">
        <BaseButton
          variant="ghost"
          size="icon"
          class="!size-7"
          :aria-label="`More options for ${row.name}`"
          @click="notifications.announce(`${row.name} details opened`)"
        >
          <Ellipsis :size="18" />
        </BaseButton>
      </template>
      <template #emptyAction>
        <BaseButton variant="secondary" size="small" @click="clearCustomerFilters">
          Clear filters
        </BaseButton>
      </template>
    </DataTable>
    <Pagination
      :page="customerStore.page"
      :page-count="customerStore.pageCount"
      :start="startItem"
      :end="endItem"
      :total="customerStore.filteredCustomers.length"
      item-label="customers"
      @update:page="customerStore.setPage"
    />
  </BaseCard>
</template>
