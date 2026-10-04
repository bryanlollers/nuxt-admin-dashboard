import { sectionPaths } from '../data/navigation'
import type { AppSection } from '../types/navigation'

export const useNavigationStore = defineStore('navigation', () => {
  const router = useRouter()
  const route = useRoute()
  const activeSection = computed<AppSection>(
    () =>
      (Object.keys(sectionPaths) as AppSection[]).find(
        (section) => sectionPaths[section] === route.path,
      ) || 'Overview',
  )

  function navigateToSection(section: AppSection) {
    const path = sectionPaths[section]
    if (router.currentRoute.value.path !== path) return router.push(path)
  }

  return { activeSection, navigateToSection }
})
