<script setup>
import { getInitials } from '~/utils/string'
import { useNavigationStore } from '~/stores/navigation'
import { useNotificationStore } from '~/stores/notifications'
import { ChevronDown } from 'lucide-vue-next'
import { useSettingStore } from '~/stores/settings'

const navigation = useNavigationStore()
const notifications = useNotificationStore()
const settingsStore = useSettingStore()
const profileInitials = computed(() => getInitials(settingsStore.profile.name))
</script>

<template>
  <BaseDropdown>
    <template #trigger="{ triggerAttrs }">
      <button
        v-bind="triggerAttrs"
        type="button"
        class="outline-none flex cursor-pointer items-center gap-2 rounded-lg p-1 text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
        aria-label="Open user menu"
      >
        <span
          class="grid size-8 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
        >
          {{ profileInitials }}
        </span>
        <ChevronDown :size="14" class="hidden sm:block" />
      </button>
    </template>
    <div class="flex flex-col gap-1 p-2">
      <strong class="px-2 text-xs font-semibold text-slate-800 dark:text-slate-100">
        {{ settingsStore.profile.name }}
      </strong>
      <small
        class="border-b border-slate-100 px-2 pb-2 text-[10px] text-slate-600 dark:border-slate-800 dark:text-slate-400"
      >
        {{ settingsStore.profile.email }}
      </small>
      <BaseButton
        variant="ghost"
        class="!justify-start !px-2 text-xs"
        @click="navigation.navigateToSection('Settings')"
      >
        Account settings
      </BaseButton>
      <BaseButton
        variant="ghost"
        class="!justify-start !px-2 text-xs"
        @click="notifications.announce('Signed out')"
      >
        Sign out
      </BaseButton>
    </div>
  </BaseDropdown>
</template>
