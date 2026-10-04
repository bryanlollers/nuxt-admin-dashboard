<script setup>
import { useTeamStore } from '~/stores/team'

defineProps({ reportProjects: Array })
const teamStore = useTeamStore()
</script>

<template>
  <BaseCard class="p-4 sm:p-5">
    <h2 class="text-sm font-bold text-slate-800 dark:text-slate-100">Team statistics</h2>
    <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
      Team assignments in the selected date range
    </p>
    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="department in [...new Set(teamStore.users.map((user) => user.department))]"
        :key="department"
        class="rounded-xl border border-slate-100 dark:border-slate-700 p-3"
      >
        <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">{{ department }}</p>
        <p class="mt-1 text-xl font-bold text-slate-900 dark:text-slate-50">
          {{
            teamStore.users.filter(
              (user) =>
                user.department === department &&
                reportProjects.some((project) => project.team.includes(user.initials)),
            ).length
          }}
        </p>
        <p class="text-[10px] text-slate-600 dark:text-slate-400">assigned teammates</p>
      </div>
    </div>
  </BaseCard>
</template>
