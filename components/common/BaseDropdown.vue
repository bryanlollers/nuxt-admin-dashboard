<script setup>
import { getFocusableElements } from '~/utils/focus'

const open = ref(false)
const trigger = ref(null)
const menu = ref(null)
const teleportTarget = ref('body')
const menuId = useId()
const position = ref({})
const triggerAttrs = computed(() => ({ 'aria-expanded': open.value, 'aria-controls': menuId }))

function close(restore = false) {
  open.value = false
  if (restore) trigger.value?.querySelector('button, a[href]')?.focus()
}

async function toggleDropdown() {
  if (open.value) return close()
  teleportTarget.value = trigger.value.closest('dialog') || 'body'
  const bounds = trigger.value.getBoundingClientRect()
  const below = window.innerHeight - bounds.bottom - 16
  const above = bounds.top - 16
  const bottom = below >= 240 || below >= above
  position.value = {
    left: `${Math.max(16, Math.min(bounds.right - 224, window.innerWidth - 240))}px`,
    ...(bottom
      ? { top: `${bounds.bottom + 8}px` }
      : { bottom: `${window.innerHeight - bounds.top + 8}px` }),
    maxHeight: `${Math.max(0, bottom ? below : above)}px`,
  }
  open.value = true
  await nextTick()
  getFocusableElements(menu.value)[0]?.focus()
}

function handleKey(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    close(true)
  } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    const controls = getFocusableElements(menu.value)
    const index = controls.indexOf(document.activeElement)
    if (!controls.length) return
    let target = index
    if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = controls.length - 1
    else {
      const direction = event.key === 'ArrowDown' ? 1 : -1
      target = (index + direction + controls.length) % controls.length
    }
    controls[target]?.focus()
  } else if (event.key === 'Tab') {
    close(true)
  }
}

function outside(event) {
  if (!trigger.value?.contains(event.target) && !menu.value?.contains(event.target)) close()
}
function reposition() {
  close()
}
onMounted(() => {
  document.addEventListener('pointerdown', outside)
  window.addEventListener('resize', reposition)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', outside)
  window.removeEventListener('resize', reposition)
})
</script>

<template>
  <div class="relative inline-flex max-w-full">
    <div
      ref="trigger"
      class="inline-flex max-w-full"
      @click="toggleDropdown"
      @keydown.esc.stop.prevent="close(true)"
      @keydown.down.prevent="!open && toggleDropdown()"
    >
      <slot name="trigger" :trigger-attrs="triggerAttrs" />
    </div>
    <Teleport :to="teleportTarget">
      <div
        v-if="open"
        :id="menuId"
        ref="menu"
        :style="position"
        class="fixed z-[70] w-56 max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        @keydown="handleKey"
        @click="close(true)"
      >
        <slot />
      </div>
    </Teleport>
  </div>
</template>
