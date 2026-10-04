<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <section class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div class="min-w-0">
      <div
        v-if="eyebrow"
        class="flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-slate-600 dark:text-slate-400"
      >
        <span class="size-1.5 rounded-full bg-violet-400" />
        {{ eyebrow }}
      </div>
      <h1
        class="mt-2 font-[Manrope,sans-serif] text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px] dark:text-slate-50"
      >
        {{ title }}
        <span aria-hidden="true" class="text-amber-700">✦</span>
      </h1>
      <p v-if="description" class="mt-1 text-sm text-slate-500 dark:text-slate-300">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex w-full gap-2 sm:w-auto">
      <slot name="actions" />
    </div>
  </section>
</template>
