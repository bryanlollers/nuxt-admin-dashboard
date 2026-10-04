<script setup>
import { useNotificationStore } from '~/stores/notifications'
import { Bell, Menu } from 'lucide-vue-next'

const notifications = useNotificationStore()

defineProps({ navigationOpen: Boolean })
defineEmits(['open-navigation'])
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-9 dark:border-slate-800 dark:bg-slate-950/95 print:hidden"
  >
    <div class="flex min-w-0 items-center gap-3">
      <BaseButton
        variant="ghost"
        size="icon"
        class="text-slate-500 md:hidden dark:text-slate-300"
        aria-label="Open navigation"
        aria-controls="app-navigation"
        :aria-expanded="navigationOpen"
        @click="$emit('open-navigation')"
      >
        <Menu :size="20" aria-hidden="true" />
      </BaseButton>
      <Breadcrumbs />
    </div>
    <div class="flex items-center gap-2 sm:gap-4">
      <BaseButton
        variant="ghost"
        size="icon"
        class="relative text-slate-500 dark:text-slate-300"
        aria-label="Notifications"
        @click="notifications.announce('You’re all caught up!')"
      >
        <Bell :size="19" />
        <i class="absolute right-2 top-2 size-1.5 rounded-full border border-white bg-rose-400" />
      </BaseButton>
      <UserMenu />
    </div>
  </header>
</template>
