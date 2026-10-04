<template>
  <div
    class="flex flex-col items-center gap-2 px-6 py-9 text-center text-sm text-slate-600 dark:text-slate-400"
  >
    <slot name="icon" />
    <strong class="text-sm font-semibold text-slate-700 dark:text-slate-200">
      <slot name="title">{{ title }}</slot>
    </strong>
    <span class="text-xs text-slate-500 dark:text-slate-400">
      <slot name="description">{{ description }}</slot>
    </span>
    <div class="mt-1"><slot name="action" /></div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Nothing here yet' },
  description: { type: String, default: '' },
})
</script>
