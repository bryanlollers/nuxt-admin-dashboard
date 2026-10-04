<script setup>
import { useSettingStore } from '~/stores/settings'

const settingsStore = useSettingStore()
const preferences = reactive({
  ...settingsStore.preferences,
  notifications: { ...settingsStore.preferences.notifications },
})
const operationError = ref('')
const retryAction = ref(() => savePreferences())

watch(
  () => settingsStore.preferences,
  (value) => {
    Object.assign(preferences, value, { notifications: { ...value.notifications } })
  },
  { deep: true },
)

function savePreferences() {
  operationError.value = ''
  try {
    settingsStore.savePreferences({
      ...preferences,
      notifications: { ...preferences.notifications },
    })
  } catch {
    operationError.value =
      'Your preferences could not be saved. Check browser storage and try again.'
    retryAction.value = savePreferences
  }
}

function toggleSidebar() {
  preferences.sidebarCollapsed = !preferences.sidebarCollapsed
  savePreferences()
}

function updateTheme(theme) {
  operationError.value = ''
  try {
    settingsStore.setTheme(theme)
  } catch {
    operationError.value = 'Your theme could not be saved. Check browser storage and try again.'
    retryAction.value = () => updateTheme(theme)
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-[1100px] p-4 sm:p-6 lg:px-9 lg:py-8">
    <PageHeader
      eyebrow="WORKSPACE CONFIGURATION"
      title="Settings"
      description="Manage your profile, workspace preferences, and notification settings."
    />

    <ErrorState
      v-if="operationError"
      class="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 dark:border-rose-900 dark:bg-rose-950/30"
      title="Settings were not saved"
      :description="operationError"
      @retry="retryAction()"
    />

    <div class="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
      <div class="space-y-4">
        <SettingsProfileCard />

        <SettingsPreferencesCard
          :preferences="preferences"
          @save="savePreferences"
          @theme-change="updateTheme"
          @toggle-sidebar="toggleSidebar"
        />
      </div>

      <SettingsRegionalCard :preferences="preferences" @save="savePreferences" />
    </div>
  </div>
</template>
