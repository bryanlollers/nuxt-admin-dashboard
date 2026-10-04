<script setup>
const props = defineProps({
  variant: { type: String, default: 'default' },
  size: { type: String, default: 'medium' },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})

const variants = {
  default:
    'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
  primary: 'border border-violet-600 bg-violet-600 text-white shadow-sm hover:bg-violet-700',
  secondary:
    'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
  danger: 'border border-rose-600 bg-rose-600 text-white hover:bg-rose-700',
  ghost:
    'border border-transparent bg-transparent text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
}

const sizes = {
  small: 'min-h-8 px-2.5 text-xs',
  medium: 'min-h-9 px-3 text-sm',
  large: 'min-h-10 px-4 text-sm',
  icon: 'size-9 p-0',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex min-w-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium outline-none transition-colors hover:ring-2 hover:ring-violet-200 hover:ring-offset-1 focus-visible:ring-2 focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[variants[props.variant] || variants.default, sizes[props.size] || sizes.medium]"
  >
    <slot />
  </button>
</template>
