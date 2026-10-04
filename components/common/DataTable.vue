<script setup>
defineProps({
  label: { type: String, default: 'Records' },
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
  emptyTitle: { type: String, default: 'No results found' },
  emptyDescription: { type: String, default: 'Try changing your search or filters.' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

defineEmits(['retry'])
</script>

<template>
  <LoadingState v-if="loading" label="Loading records..." />
  <ErrorState v-else-if="error" :description="error" @retry="$emit('retry')" />
  <div
    v-else
    tabindex="0"
    role="region"
    :aria-label="label"
    class="focus-visible:ring-2 focus-visible:ring-violet-600 min-w-0 overflow-x-auto"
  >
    <table class="relative w-full border-collapse whitespace-nowrap text-left text-xs">
      <caption class="sr-only">{{ label }}</caption>
      <thead
        class="bg-slate-50 text-[10px] font-semibold tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400"
      >
        <tr>
          <th
            scope="col"
            v-for="column in columns"
            :key="column.key || column.label"
            class="relative h-9 px-3 first:pl-4"
          >
            <slot :name="`header-${column.key}`" :column="column">{{ column.label }}</slot>
          </th>
          <th v-if="$slots.actions" scope="col" class="relative w-10 pr-4">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in rows"
          :key="row[rowKey] ?? index"
          class="border-b border-slate-100 last:border-0 dark:border-slate-800"
        >
          <td v-for="column in columns" :key="column.key" class="h-[52px] px-3 first:pl-4">
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="relative w-10 pr-4">
            <slot name="actions" :row="row" />
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="whitespace-normal">
            <EmptyState :title="emptyTitle" :description="emptyDescription">
              <template #icon><slot name="emptyIcon" /></template>
              <template v-if="$slots.emptyAction" #action><slot name="emptyAction" /></template>
            </EmptyState>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
