<script setup>
import { useSettingStore } from '~/stores/settings'

let overlayObserver
function syncScrollLock() {
  document.body.classList.toggle(
    'overflow-hidden',
    mobileOpen.value || Boolean(document.querySelector('dialog[open]')),
  )
}
const route = useRoute()
const mobileOpen = ref(false)
function closeDesktopDrawer() {
  if (window.matchMedia('(min-width: 768px)').matches) mobileOpen.value = false
}
onBeforeUnmount(() => {
  window.removeEventListener('resize', closeDesktopDrawer)
  overlayObserver?.disconnect()
  document.body.classList.remove('overflow-hidden')
})
watch(mobileOpen, () => {
  if (import.meta.client) syncScrollLock()
})
const settingsStore = useSettingStore()

watch(
  () => route.path,
  async () => {
    mobileOpen.value = false
    await nextTick()
    const heading = document.querySelector('main h1')
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1
      heading.focus({ preventScroll: true })
    }
  },
)

onMounted(() => {
  overlayObserver = new MutationObserver(syncScrollLock)
  overlayObserver.observe(document.querySelector('#__nuxt'), {
    subtree: true,
    attributes: true,
    attributeFilter: ['open'],
    childList: true,
  })
  window.addEventListener('resize', closeDesktopDrawer)
  settingsStore.hydrateSettings()
  document.documentElement.dataset.theme = settingsStore.preferences.theme
})

watch(
  () => settingsStore.preferences.theme,
  (theme) => {
    if (import.meta.client) document.documentElement.dataset.theme = theme
  },
)
</script>

<template>
  <div
    class="motion-reduce:[&_*]:transition-none min-h-screen bg-slate-50 text-slate-800 antialiased dark:bg-slate-950 dark:text-slate-100 dark:[color-scheme:dark]"
  >
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-violet-700 focus:px-4 focus:py-3 focus:text-white"
    >
      Skip to main content
    </a>
    <AppSidebar
      :mobile-open="mobileOpen"
      :collapsed="settingsStore.preferences.sidebarCollapsed"
      @close="mobileOpen = false"
    />
    <main
      id="main-content"
      tabindex="-1"
      :inert="mobileOpen || undefined"
      class="flex min-h-screen min-w-0 flex-col transition-[margin] print:ml-0"
      :class="settingsStore.preferences.sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'"
    >
      <AppHeader :navigation-open="mobileOpen" @open-navigation="mobileOpen = true" />
      <slot />
    </main>
    <AppToast />
  </div>
</template>
