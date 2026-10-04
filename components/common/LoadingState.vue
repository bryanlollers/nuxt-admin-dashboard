<script setup>
defineProps({
  label: { type: String, default: 'Loading…' },
})
</script>

<template>
  <div
    class="flex min-h-40 flex-col items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400"
    role="status"
    aria-live="polite"
  >
    <span
      class="size-6 animate-spin motion-reduce:animate-none rounded-full border-2 border-violet-100 border-t-violet-600"
      aria-hidden="true"
    />
    <span>{{ label }}</span>
  </div>
</template>
