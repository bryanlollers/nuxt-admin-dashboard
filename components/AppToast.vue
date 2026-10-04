<script setup>
import { useNotificationStore } from '~/stores/notifications'

const notifications = useNotificationStore()

const message = computed(() => notifications.notice)
</script>

<template>
  <div role="status" aria-live="polite" aria-atomic="true">
    <Transition>
      <div
        class="max-w-[calc(100vw-2rem)] fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-xs text-white shadow-xl md:left-[calc(50%+8rem)]"
        v-if="message"
      >
        <span
          aria-hidden="true"
          class="grid size-5 place-items-center rounded-full bg-emerald-500 text-[10px]"
        >
          ✓
        </span>
        {{ message }}
      </div>
    </Transition>
  </div>
</template>
