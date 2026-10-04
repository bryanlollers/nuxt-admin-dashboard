<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

defineProps({
  page: { type: Number, default: 1 },
  pageCount: { type: Number, default: 1 },
  start: { type: Number, default: 0 },
  end: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  itemLabel: { type: String, default: 'items' },
})

defineEmits(['update:page'])
</script>

<template>
  <nav
    :aria-label="`${itemLabel} pagination`"
    class="flex min-h-12 items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700 px-4 text-[10px] text-slate-600 dark:text-slate-400"
  >
    <span class="min-w-0 truncate">
      Showing
      <b class="font-semibold text-slate-600 dark:text-slate-300">{{ start }}–{{ end }}</b>
      of
      <b class="font-semibold text-slate-600 dark:text-slate-300">{{ total }}</b>
      {{ itemLabel }}
    </span>
    <div class="flex shrink-0 items-center gap-1">
      <BaseButton
        size="icon"
        class="!size-7 rounded-md text-slate-500 dark:text-slate-400"
        aria-label="Previous page"
        :disabled="page <= 1"
        @click="$emit('update:page', page - 1)"
      >
        <ChevronLeft :size="16" />
      </BaseButton>
      <BaseButton
        v-for="number in pageCount"
        :key="number"
        variant="ghost"
        size="small"
        class="!size-7 !min-h-7 !px-0 rounded-md border-transparent text-xs"
        :class="
          number === page
            ? '!border-violet-200 !bg-violet-50 !text-violet-700 dark:!border-violet-800 dark:!bg-violet-950/60 dark:!text-violet-300'
            : 'border-transparent bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
        "
        :aria-label="`Page ${number}`"
        :aria-current="number === page ? 'page' : undefined"
        @click="$emit('update:page', number)"
      >
        {{ number }}
      </BaseButton>
      <BaseButton
        size="icon"
        class="!size-7 rounded-md text-slate-500 dark:text-slate-400"
        aria-label="Next page"
        :disabled="page >= pageCount"
        @click="$emit('update:page', page + 1)"
      >
        <ChevronRight :size="16" />
      </BaseButton>
    </div>
  </nav>
</template>
