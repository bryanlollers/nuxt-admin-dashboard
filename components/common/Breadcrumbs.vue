<script setup>
import { useNavigationStore } from '~/stores/navigation'

const navigation = useNavigationStore()
</script>

<template>
  <nav
    class="flex min-w-0 items-center gap-2 text-xs text-slate-600 dark:text-slate-400"
    aria-label="Breadcrumb"
  >
    <span class="hidden sm:inline">Workspace</span>
    <span class="hidden text-slate-300 sm:inline dark:text-slate-500" aria-hidden="true">/</span>
    <strong class="truncate font-semibold text-slate-700 dark:text-slate-200" aria-current="page">
      {{ navigation.activeSection }}
    </strong>
  </nav>
</template>
