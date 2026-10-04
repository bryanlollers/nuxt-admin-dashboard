<script setup>
import { getInitials } from '~/utils/string'
import { isValidEmail } from '~/utils/validation'
import { Save } from 'lucide-vue-next'
import { useSettingStore } from '~/stores/settings'

const focusValidationError = useValidationFocus()

const settingsStore = useSettingStore()
const profile = reactive({ ...settingsStore.profile })
const errors = ref({})
const operationError = ref('')

watch(
  () => settingsStore.profile,
  (value) => Object.assign(profile, value),
  { deep: true },
)

function saveProfile() {
  operationError.value = ''
  errors.value = {}
  if (profile.name.trim().length < 2) errors.value.name = 'Enter a name with at least 2 characters.'
  if (!isValidEmail(profile.email)) errors.value.email = 'Enter a valid email address.'
  if (Object.keys(errors.value).length) {
    focusValidationError()
    return
  }

  try {
    settingsStore.saveProfile({
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim(),
    })
  } catch {
    operationError.value = 'Your profile could not be saved. Check browser storage and try again.'
  }
}
</script>

<template>
  <ErrorState
    v-if="operationError"
    class="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 dark:border-rose-900 dark:bg-rose-950/30"
    title="Profile was not saved"
    :description="operationError"
    @retry="saveProfile"
  />
  <BaseCard class="p-4 sm:p-6">
    <div class="mb-5">
      <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Profile</h2>
      <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Your profile details are shown to your team.
      </p>
    </div>
    <form class="space-y-4" @submit.prevent="saveProfile" novalidate>
      <div class="flex items-center gap-4 rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
        <div
          class="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
        >
          <img
            v-if="profile.avatar"
            :src="profile.avatar"
            alt="Profile avatar"
            class="size-full object-cover"
          />
          <span v-else>
            {{ getInitials(profile.name) }}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Profile photo</p>
          <p class="mt-1 text-[10px] text-slate-600 dark:text-slate-400">
            Add an image URL or use your initials.
          </p>
          <div class="mt-2">
            <BaseInput
              v-model="profile.avatar"
              label="Avatar URL"
              placeholder="https://example.com/avatar.png"
            />
          </div>
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseInput
          v-model="profile.name"
          label="Full name"
          placeholder="Jordan Davis"
          :error="errors.name"
          required
        />
        <BaseInput
          v-model="profile.email"
          label="Email address"
          type="email"
          placeholder="jordan@sample.co"
          :error="errors.email"
          required
        />
        <BaseInput
          v-model="profile.phone"
          label="Phone number"
          type="tel"
          placeholder="+1 (555) 000-0000"
        />
      </div>
      <div class="flex justify-end border-t border-slate-100 dark:border-slate-700 pt-4">
        <BaseButton variant="primary" type="submit">
          <Save :size="15" />
          Save profile
        </BaseButton>
      </div>
    </form>
  </BaseCard>
</template>
