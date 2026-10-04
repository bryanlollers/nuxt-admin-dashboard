<script setup>
import { Eye, Pencil, Search, Trash2 } from 'lucide-vue-next'
import { useCustomerStore } from '~/stores/customers'
import { useProjectStore } from '~/stores/projects'

const emit = defineEmits(['view', 'edit', 'delete'])
const customerStore = useCustomerStore()
const projectStore = useProjectStore()
const search = ref('')
const status = ref('All statuses')
const customer = ref('All customers')
const sortBy = ref('name')
const descending = ref(false)
const page = ref(1)
const pageSize = 6
const columns = [
  { key: 'name', label: 'PROJECT' },
  { key: 'client', label: 'CUSTOMER' },
  { key: 'status', label: 'STATUS' },
  { key: 'progress', label: 'PROGRESS' },
  { key: 'due', label: 'DUE DATE' },
]
const customers = computed(() => [...new Set(customerStore.customers.map((item) => item.company))])
const statuses = computed(() => [
  ...new Set(projectStore.projects.map((project) => project.status)),
])
const filteredProjects = computed(() => {
  const needle = search.value.trim().toLowerCase()
  return projectStore.projects
    .filter((project) => {
      const matchesSearch = `${project.name} ${project.client}`.toLowerCase().includes(needle)
      return (
        matchesSearch &&
        (status.value === 'All statuses' || project.status === status.value) &&
        (customer.value === 'All customers' || project.client === customer.value)
      )
    })
    .sort((first, second) => {
      const comparison = String(first[sortBy.value] || '').localeCompare(
        String(second[sortBy.value] || ''),
        'en-US',
        { numeric: true },
      )
      return descending.value ? -comparison : comparison
    })
})
const pageCount = computed(() => Math.max(1, Math.ceil(filteredProjects.value.length / pageSize)))
const pageProjects = computed(() =>
  filteredProjects.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)
const rangeStart = computed(() =>
  filteredProjects.value.length ? (page.value - 1) * pageSize + 1 : 0,
)
const rangeEnd = computed(() => Math.min(page.value * pageSize, filteredProjects.value.length))

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
          class="min-w-0 flex-1 text-xs text-slate-700 dark:text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          placeholder="Search projects or customers"
          aria-label="Search projects"
          @input="page = 1"
        />
      </label>
      <div class="flex flex-wrap gap-2">
        <BaseSelect
          v-model="status"
          label="Filter projects by status"
          :options="['All statuses', ...statuses]"
          @change="page = 1"
        />
        <BaseSelect
          v-model="customer"
          label="Filter projects by customer"
          :options="['All customers', ...customers]"
          @change="page = 1"
        />
        <BaseSelect
          v-model="sortBy"
          label="Sort projects by"
          :options="[
            { label: 'Project name', value: 'name' },
            { label: 'Customer', value: 'client' },
            { label: 'Due date', value: 'due' },
            { label: 'Progress', value: 'progress' },
          ]"
        />
        <BaseButton variant="secondary" size="small" @click="descending = !descending">
          {{ descending ? 'Descending' : 'Ascending' }}
        </BaseButton>
      </div>
    </div>

    <DataTable
      label="Projects"
      :columns="columns"
      :rows="pageProjects"
      empty-title="No projects found"
      empty-description="Adjust your search or filters, or create a project."
    >
      <template #cell-name="{ row }">
        <button
          type="button"
          class="outline-none flex cursor-pointer items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          @click="emit('view', row)"
        >
          <span
            class="grid size-9 shrink-0 place-items-center rounded-lg bg-violet-50 text-xs font-bold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
          >
            {{ row.initials }}
          </span>
          <span class="flex flex-col gap-1">
            <strong class="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {{ row.name }}
            </strong>
            <small class="text-[10px] text-slate-600 dark:text-slate-400">
              {{ row.team.length }} team members
            </small>
          </span>
        </button>
      </template>
      <template #cell-client="{ row }">
        <span class="text-xs text-slate-600 dark:text-slate-300">{{ row.client }}</span>
      </template>
      <template #cell-status="{ row }">
        <BaseBadge
          :variant="
            row.status === 'On track' || row.status === 'Completed'
              ? 'success'
              : row.status === 'At risk'
                ? 'danger'
                : row.status === 'In review'
                  ? 'warning'
                  : 'violet'
          "
        >
          {{ row.status }}
        </BaseBadge>
      </template>
      <template #cell-progress="{ row }">
        <div class="flex min-w-28 items-center gap-2">
          <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
            <div class="h-full rounded-full bg-violet-500" :style="{ width: `${row.progress}%` }" />
          </div>
          <span class="w-8 text-right text-[10px] text-slate-500 dark:text-slate-400">
            {{ row.progress }}%
          </span>
        </div>
      </template>
      <template #cell-due="{ row }">
        <span class="text-xs text-slate-500 dark:text-slate-400">{{ row.due }}</span>
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
              Edit project
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="small"
              class="!justify-start text-rose-600"
              @click="emit('delete', row)"
            >
              <Trash2 :size="14" />
              Delete project
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
      :total="filteredProjects.length"
      item-label="projects"
      @update:page="page = $event"
    />
  </BaseCard>
</template>
