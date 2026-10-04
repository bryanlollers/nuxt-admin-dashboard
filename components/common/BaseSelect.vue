<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

function handleChange(event) {
  emit('update:modelValue', event.target.value)
  emit('change', event)
}
</script>

<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    :aria-label="label || undefined"
    class="disabled:cursor-not-allowed disabled:opacity-50 h-9 min-w-0 max-w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition hover:border-violet-300 focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-offset-1 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    @change="handleChange"
  >
    <option v-if="placeholder" value="">{{ placeholder }}</option>
    <option
      v-for="option in options"
      :key="typeof option === 'string' ? option : option.value"
      :value="typeof option === 'string' ? option : option.value"
    >
      {{ typeof option === 'string' ? option : option.label }}
    </option>
  </select>
</template>
