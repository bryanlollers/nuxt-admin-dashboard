<script setup>
import CustomersPage from '~/components/customers/CustomersPage.vue'
import DashboardPage from '~/components/dashboard/DashboardPage.vue'
import ProjectsPage from '~/components/projects/ProjectsPage.vue'
import ReportsPage from '~/components/reports/ReportsPage.vue'
import SettingsPage from '~/components/settings/SettingsPage.vue'
import TasksPage from '~/components/tasks/TasksPage.vue'
import TeamPage from '~/components/team/TeamPage.vue'
import { useNavigationStore } from '~/stores/navigation'
import { sectionPaths } from '~/data/navigation'

const navigation = useNavigationStore()
const route = useRoute()
const pages = {
  Overview: DashboardPage,
  Customers: CustomersPage,
  Projects: ProjectsPage,
  Tasks: TasksPage,
  Team: TeamPage,
  Reports: ReportsPage,
  Settings: SettingsPage,
}
const currentPage = computed(() => pages[navigation.activeSection] || DashboardPage)
watch(
  () => route.path,
  (path) => {
    if (!Object.values(sectionPaths).includes(path)) navigation.navigateToSection('Overview')
  },
  { immediate: true },
)
</script>

<template>
  <div class="min-w-0 flex-1">
    <component :is="currentPage" />
  </div>
</template>
