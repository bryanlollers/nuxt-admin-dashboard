<script setup>
import { toDateInput, formatDate } from '~/utils/date'
import { Plus } from 'lucide-vue-next'
import { useProjectStore } from '~/stores/projects'

const focusValidationError = useValidationFocus()

defineProps({ modelValue: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])
const projectStore = useProjectStore()
const projectName = ref('')
const projectClient = ref('')
const projectDue = ref('')
const formErrors = ref({})

function submitProject() {
  formErrors.value = {
    name:
      projectName.value.trim().length < 3
        ? 'Enter a project name with at least 3 characters.'
        : undefined,
    client: projectClient.value.trim().length < 2 ? 'Enter a client name.' : undefined,
    due: !projectDue.value
      ? 'Choose a due date.'
      : projectDue.value < toDateInput(new Date())
        ? 'Due date must be today or later.'
        : undefined,
  }
  if (Object.values(formErrors.value).some(Boolean)) {
    focusValidationError()
    return
  }
  projectStore.addProject(
    projectName.value.trim(),
    projectClient.value.trim(),
    formatDate(projectDue.value),
  )
  emit('update:modelValue', false)
  projectName.value = ''
  projectClient.value = ''
  projectDue.value = ''
  formErrors.value = {}
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="Create a project"
    description="Give your next great idea a name and a timeline."
    eyebrow="PROJECT WORKSPACE"
    labelled-by="new-project-title"
  >
    <form
      id="new-project-form"
      class="flex flex-col gap-3"
      @submit.prevent="submitProject"
      novalidate
    >
      <BaseInput
        v-model="projectName"
        label="Project name"
        placeholder="e.g. Spring launch"
        :error="formErrors.name"
        @input="formErrors.name = undefined"
      />
      <BaseInput
        v-model="projectClient"
        label="Client"
        placeholder="e.g. Orbit Labs"
        :error="formErrors.client"
        @input="formErrors.client = undefined"
      />
      <BaseInput
        v-model="projectDue"
        label="Due date"
        type="date"
        :error="formErrors.due"
        @input="formErrors.due = undefined"
      />
    </form>
    <template #actions>
      <BaseButton variant="secondary" @click="emit('update:modelValue', false)">Cancel</BaseButton>
      <BaseButton variant="primary" type="submit" form="new-project-form">
        <Plus :size="15" />
        Create project
      </BaseButton>
    </template>
  </BaseModal>
</template>
