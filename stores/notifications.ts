export const useNotificationStore = defineStore('notifications', () => {
  const notice = ref('')
  let dismissalTimer: ReturnType<typeof setTimeout> | undefined

  function dismiss() {
    if (dismissalTimer !== undefined) clearTimeout(dismissalTimer)
    dismissalTimer = undefined
    notice.value = ''
  }

  function announce(message: string) {
    dismiss()
    notice.value = message
    if (import.meta.client) dismissalTimer = setTimeout(dismiss, 2800)
  }

  onScopeDispose(dismiss)

  return { notice, announce, dismiss }
})
