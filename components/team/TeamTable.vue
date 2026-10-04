<script setup>
import { Eye, Pencil, Search, Trash2 } from 'lucide-vue-next'
import { useTeamStore } from '~/stores/team'

const emit = defineEmits(['view', 'edit', 'delete'])
const teamStore = useTeamStore()
const search = ref('')
const department = ref('All departments')
const status = ref('All statuses')
const page = ref(1)
const pageSize = 6
const columns = [
  { key: 'member', label: 'TEAM MEMBER' },
  { key: 'role', label: 'ROLE' },
  { key: 'department', label: 'DEPARTMENT' },
  { key: 'status', label: 'STATUS' },
]
const filteredUsers = computed(() => {
  const needle = search.value.trim().toLowerCase()
  return teamStore.users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email} ${user.role} ${user.department}`
      .toLowerCase()
      .includes(needle)
    return (
      matchesSearch &&
      (department.value === 'All departments' || user.department === department.value) &&
      (status.value === 'All statuses' || user.status === status.value)
    )
  })
})
const pageCount = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize)))
const pageUsers = computed(() =>
  filteredUsers.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)
const departments = computed(() => [...new Set(teamStore.users.map((user) => user.department))])
const rangeStart = computed(() =>
  filteredUsers.value.length ? (page.value - 1) * pageSize + 1 : 0,
)
const rangeEnd = computed(() => Math.min(page.value * pageSize, filteredUsers.value.length))

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
          placeholder="Search teammates"
          aria-label="Search team"
          @input="resetPage"
        />
      </label>
      <div class="flex flex-wrap gap-2">
        <BaseSelect
          v-model="department"
          label="Filter by department"
          :options="['All departments', ...departments]"
          @change="resetPage"
        />
        <BaseSelect
          v-model="status"
          label="Filter by availability"
          :options="['All statuses', 'Active', 'Away', 'Inactive']"
          @change="resetPage"
        />
      </div>
    </div>

    <DataTable
      label="Team members"
      :columns="columns"
      :rows="pageUsers"
      empty-title="No team members found"
      empty-description="Try another search or add a teammate."
    >
      <template #cell-member="{ row }">
        <button
          type="button"
          class="outline-none flex cursor-pointer items-center gap-3 text-left focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          @click="emit('view', row)"
        >
          <span
            class="grid size-9 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
          >
            {{ row.initials }}
          </span>
          <span class="flex flex-col gap-1">
            <strong class="text-xs font-semibold text-slate-700 dark:text-slate-200">
              {{ row.name }}
            </strong>
            <small class="text-[10px] text-slate-600 dark:text-slate-400">{{ row.email }}</small>
          </span>
        </button>
      </template>
      <template #cell-role="{ row }">
        <span class="text-xs text-slate-600 dark:text-slate-300">{{ row.role }}</span>
      </template>
      <template #cell-department="{ row }">
        <span class="text-xs text-slate-500 dark:text-slate-400">{{ row.department }}</span>
      </template>
      <template #cell-status="{ row }">
        <BaseBadge
          :variant="
            row.status === 'Active' ? 'success' : row.status === 'Away' ? 'warning' : 'neutral'
          "
        >
          {{ row.status }}
        </BaseBadge>
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
              Edit member
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="small"
              class="!justify-start text-rose-600"
              @click="emit('delete', row)"
            >
              <Trash2 :size="14" />
              Delete member
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
      :total="filteredUsers.length"
      item-label="team members"
      @update:page="page = $event"
    />
  </BaseCard>
</template>
