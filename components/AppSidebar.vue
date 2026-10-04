<script setup>
import { getFocusableElements } from '~/utils/focus'
import { useNavigationStore } from '~/stores/navigation'
import { useNotificationStore } from '~/stores/notifications'
import {
  BarChart3,
  CheckSquare2,
  ChartNoAxesCombined,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  Settings2,
  Users,
  X,
} from 'lucide-vue-next'
import { useSettingStore } from '~/stores/settings'

const navigation = useNavigationStore()
const notifications = useNotificationStore()

const props = defineProps({ mobileOpen: Boolean, collapsed: Boolean })
const emit = defineEmits(['close'])
const settingsStore = useSettingStore()
const sidebar = ref(null)
let previousFocus
watch(
  () => props.mobileOpen,
  async (open) => {
    if (open) {
      previousFocus = document.activeElement
      await nextTick()
      sidebar.value?.querySelector('button, a[href]')?.focus()
    } else {
      await nextTick()
      previousFocus?.focus()
    }
  },
)
function trapFocus(event) {
  if (!props.mobileOpen || event.key !== 'Tab') return
  const items = getFocusableElements(sidebar.value)
  const first = items[0]
  const last = items[items.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}
const isCollapsed = computed(() => props.collapsed && !props.mobileOpen)

const groups = [
  {
    label: 'WORKSPACE',
    items: [
      { name: 'Overview', icon: LayoutDashboard },
      { name: 'Customers', icon: Users, badge: '24' },
      { name: 'Projects', icon: FolderKanban },
      { name: 'Tasks', icon: CheckSquare2, badge: '8' },
      { name: 'Team', icon: Users },
    ],
  },
  { label: 'INSIGHTS', items: [{ name: 'Reports', icon: ChartNoAxesCombined }] },
]
</script>

<template>
  <div
    v-if="mobileOpen"
    class="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
    @click="emit('close')"
  />
  <aside
    id="app-navigation"
    ref="sidebar"
    :role="mobileOpen ? 'dialog' : undefined"
    :aria-modal="mobileOpen || undefined"
    aria-label="Application navigation"
    @keydown="trapFocus"
    @keydown.esc="emit('close')"
    class="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white px-4 py-5 transition-all md:translate-x-0 print:hidden dark:border-slate-800 dark:bg-slate-900"
    :class="[
      mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full invisible md:visible',
      isCollapsed ? 'md:w-20' : 'w-64',
    ]"
  >
    <div class="mb-7 flex h-9 items-center gap-2.5 px-2">
      <div class="grid size-8 place-items-center rounded-lg bg-violet-500 text-white shadow-sm">
        <BarChart3 :size="19" :stroke-width="2.6" />
      </div>
      <span
        v-if="!isCollapsed"
        class="font-[Manrope,sans-serif] text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50"
      >
        Sample
        <span class="text-violet-500">.</span>
      </span>
      <BaseButton
        v-if="mobileOpen"
        variant="ghost"
        size="icon"
        class="ml-auto text-slate-500 md:hidden dark:text-slate-300"
        aria-label="Close menu"
        @click="emit('close')"
      >
        <X :size="18" />
      </BaseButton>
    </div>

    <div
      class="flex items-center border border-slate-200 dark:border-slate-700 px-2.5 mb-4 h-14 !gap-2.5 rounded-xl text-left"
      :class="isCollapsed ? '!justify-center !px-0' : '!justify-start !px-2.5'"
      :aria-label="isCollapsed ? 'Jordan Davis' : undefined"
    >
      <span
        class="grid size-9 place-items-center rounded-lg bg-slate-800 font-[Manrope,sans-serif] font-bold text-white dark:bg-slate-800"
      >
        JD
      </span>
      <span v-if="!isCollapsed" class="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <strong class="text-xs font-semibold text-slate-800 dark:text-slate-100">
          Jordan Davis
        </strong>
        <small class="max-w-full truncate text-[10px] text-slate-600 dark:text-slate-400">
          {{ settingsStore.profile.email }}
        </small>
      </span>
    </div>

    <nav class="mt-2 min-h-0 flex-1 overflow-y-auto" aria-label="Main navigation">
      <div v-for="group in groups" :key="group.label" class="mb-6">
        <p
          v-if="!isCollapsed"
          class="mb-2 pl-2 text-[9px] font-bold tracking-[0.14em] text-slate-600 dark:text-slate-400"
        >
          {{ group.label }}
        </p>
        <NuxtLink
          v-for="item in group.items"
          :key="item.name"
          :to="item.name === 'Overview' ? '/' : `/${item.name.toLowerCase()}`"
          :aria-current="navigation.activeSection === item.name ? 'page' : undefined"
          class="outline-none mb-0.5 flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg text-left text-xs font-medium text-slate-500 transition dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
          :class="[
            isCollapsed ? 'justify-center px-0' : 'px-2.5',
            navigation.activeSection === item.name
              ? 'bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
              : 'hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100',
          ]"
          :aria-label="isCollapsed ? item.name : undefined"
          :title="isCollapsed ? item.name : undefined"
          @click="emit('close')"
        >
          <span class="grid size-5 shrink-0 place-items-center">
            <component :is="item.icon" :size="18" :stroke-width="1.8" />
          </span>
          <span v-if="!isCollapsed" class="flex-1">{{ item.name }}</span>
          <span
            v-if="item.badge && !isCollapsed"
            class="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-700 dark:text-slate-300"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </div>
    </nav>

    <div class="mt-auto">
      <div
        v-if="!isCollapsed"
        class="mb-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700"
      >
        <div
          class="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-200"
        >
          <span>Storage</span>
          <span class="text-violet-600 dark:text-violet-400">76%</span>
        </div>
        <div class="my-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
          <div class="h-full w-[76%] rounded-full bg-violet-500" />
        </div>
        <small class="text-[10px] text-slate-600 dark:text-slate-400">7.6 GB of 10 GB used</small>
      </div>

      <NuxtLink
        to="/settings"
        :aria-current="navigation.activeSection === 'Settings' ? 'page' : undefined"
        class="outline-none mb-0.5 flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg text-left text-xs font-medium text-slate-500 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
        :class="[
          isCollapsed ? 'justify-center px-0' : 'px-2.5',
          navigation.activeSection === 'Settings'
            ? 'bg-violet-50 font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
            : 'hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        ]"
        :aria-label="isCollapsed ? 'Settings' : undefined"
        :title="isCollapsed ? 'Settings' : undefined"
        @click="emit('close')"
      >
        <span class="grid size-5 shrink-0 place-items-center">
          <Settings2 :size="18" />
        </span>
        <span v-if="!isCollapsed">Settings</span>
      </NuxtLink>
      <button
        type="button"
        class="outline-none flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg text-left text-xs font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 dark:focus-visible:ring-violet-400 dark:focus-visible:ring-offset-slate-900"
        :class="isCollapsed ? 'justify-center px-0' : 'px-2.5'"
        :aria-label="isCollapsed ? 'Help and support' : undefined"
        :title="isCollapsed ? 'Help and support' : undefined"
        @click="notifications.announce('Help center opened')"
      >
        <span class="grid size-5 shrink-0 place-items-center">
          <CircleHelp :size="18" />
        </span>
        <span v-if="!isCollapsed">Help &amp; support</span>
      </button>
    </div>
  </aside>
</template>
