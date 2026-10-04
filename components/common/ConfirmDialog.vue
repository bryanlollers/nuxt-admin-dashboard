<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Are you sure?' },
  description: { type: String, default: 'This action cannot be undone.' },
  confirmLabel: { type: String, default: 'Confirm' },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

function confirmAction() {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    :description="description"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #actions>
      <BaseButton data-initial-focus @click="$emit('update:modelValue', false)">Cancel</BaseButton>
      <BaseButton variant="danger" @click="confirmAction">
        {{ confirmLabel }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
