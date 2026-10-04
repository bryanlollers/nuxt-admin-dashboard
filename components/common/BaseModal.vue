<script setup>
import { getFocusableElements } from '~/utils/focus'
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  labelledBy: { type: String, default: '' },
})

const dialog = ref(null)
const titleId = useId()
const descriptionId = useId()

function containFocus(event) {
  if (event.key !== 'Tab' || !dialog.value?.open) return
  const controls = getFocusableElements(dialog.value)
  const first = controls[0]
  const last = controls[controls.length - 1]
  if (!first) {
    event.preventDefault()
    dialog.value.focus()
  } else if (
    event.shiftKey &&
    (document.activeElement === first || !dialog.value.contains(document.activeElement))
  ) {
    event.preventDefault()
    last.focus()
  } else if (
    !event.shiftKey &&
    (document.activeElement === last || !dialog.value.contains(document.activeElement))
  ) {
    event.preventDefault()
    first.focus()
  }
}

function openDialog() {
  if (!props.modelValue || !dialog.value || dialog.value.open) return

  dialog.value.showModal()
  const initialFocus = dialog.value.querySelector(
    '[data-initial-focus], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)',
  )
  initialFocus?.focus({ preventScroll: true })
}

watch(
  () => props.modelValue,
  async () => {
    await nextTick()
    if (props.modelValue) openDialog()
    else if (dialog.value?.open) dialog.value.close()
  },
  { flush: 'post' },
)

onMounted(openDialog)

const emit = defineEmits(['update:modelValue', 'close'])

function closeModal() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    @keydown="containFocus"
    :aria-labelledby="labelledBy || (title ? titleId : undefined)"
    :aria-label="title ? undefined : 'Dialog'"
    :aria-describedby="description ? descriptionId : undefined"
    @cancel.prevent="closeModal"
    @close="modelValue && closeModal()"
    class="fixed inset-0 m-auto max-h-[100dvh] w-full max-w-none overflow-y-auto border-0 bg-transparent p-2 backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm open:flex open:flex-col open:justify-center sm:p-4"
    @click.self="closeModal"
  >
    <section
      class="relative mx-auto my-2 max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:my-8 sm:max-h-[calc(100dvh-6rem)] sm:p-6 dark:border-slate-700 dark:bg-slate-900"
    >
      <BaseButton
        variant="ghost"
        size="icon"
        class="absolute right-3 top-3 text-slate-600 dark:text-slate-400"
        aria-label="Close dialog"
        @click="closeModal"
      >
        <X :size="18" />
      </BaseButton>
      <div
        v-if="eyebrow"
        class="text-[10px] font-bold tracking-[0.14em] text-violet-600 dark:text-violet-300"
      >
        {{ eyebrow }}
      </div>
      <h2
        v-if="title"
        :id="labelledBy || titleId"
        class="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50"
      >
        {{ title }}
      </h2>
      <p
        :id="descriptionId"
        v-if="description"
        class="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400"
      >
        {{ description }}
      </p>
      <slot />
      <div
        v-if="$slots.actions"
        class="mt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700 pt-4"
      >
        <slot name="actions" />
      </div>
    </section>
  </dialog>
</template>
