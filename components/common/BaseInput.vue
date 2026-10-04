<script setup>
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const inputId = useId()

defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  min: { type: String, default: undefined },
  max: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue', 'input', 'blur'])

function inputAttributes() {
  const attributes = { ...attrs }
  delete attributes.class
  return attributes
}

function handleInput(event) {
  emit('update:modelValue', event.target.value)
  emit('input', event)
}

function handleBlur(event) {
  emit('blur', event)
}
</script>

<template>
  <div
    :class="attrs.class"
    class="flex flex-col gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
  >
    <label v-if="label" :for="attrs.id || inputId">{{ label }}</label>
    <input
      v-bind="inputAttributes()"
      :id="attrs.id || inputId"
      :disabled="disabled"
      :aria-describedby="
        [attrs['aria-describedby'], error ? `${inputId}-error` : null].filter(Boolean).join(' ') ||
        undefined
      "
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      :max="max"
      :aria-invalid="Boolean(error)"
      class="disabled:cursor-not-allowed disabled:opacity-50 h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-violet-300 focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-600 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-offset-1 aria-[invalid=true]:border-rose-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
      @input="handleInput"
      @blur="handleBlur"
    />
    <small
      :id="`${inputId}-error`"
      role="alert"
      v-if="error"
      class="text-xs font-normal text-rose-600 dark:text-rose-400"
    >
      {{ error }}
    </small>
  </div>
</template>
