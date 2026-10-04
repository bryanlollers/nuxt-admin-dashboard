<script setup>
defineProps({
  title: { type: String, default: 'Something went wrong' },
  description: { type: String, default: 'Please try again in a moment.' },
})

defineEmits(['retry'])
</script>

<template>
  <div class="flex min-h-40 flex-col items-center justify-center gap-2 text-center" role="alert">
    <strong class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ title }}</strong>
    <span class="text-xs text-slate-500 dark:text-slate-400">{{ description }}</span>
    <BaseButton variant="primary" @click="$emit('retry')">Try again</BaseButton>
  </div>
</template>
