import type { Theme, UserProfile, UserPreferences } from '../types/settings'
import { useNotificationStore } from './notifications'
export const useSettingStore = defineStore('settings', () => {
  const profile = ref<UserProfile>({
    name: 'Jordan Davis',
    email: 'jordan@sample.co',
    phone: '+1 (415) 555-0100',
    avatar: '',
  })
  const preferences = ref<UserPreferences>({
    theme: 'light',
    sidebarCollapsed: false,
    notifications: { email: true, inApp: true, weeklySummary: false },
    dateFormat: 'MMM D, YYYY',
    timeFormat: '12-hour',
    currency: 'USD',
  })
  const notifications = useNotificationStore()

  function hydrateSettings() {
    if (!import.meta.client) return
    try {
      const savedProfile =
        localStorage.getItem('nuxtapp-profile') || localStorage.getItem('daymark-profile')
      const savedPreferences =
        localStorage.getItem('nuxtapp-preferences') || localStorage.getItem('daymark-preferences')
      if (savedProfile) profile.value = { ...profile.value, ...JSON.parse(savedProfile) }
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences)
        preferences.value = {
          ...preferences.value,
          ...parsed,
          notifications: { ...preferences.value.notifications, ...parsed.notifications },
        }
      }
    } catch {
      localStorage.removeItem('nuxtapp-profile')
      localStorage.removeItem('nuxtapp-preferences')
    }
  }
  function saveProfile(value: UserProfile) {
    const nextProfile = { ...value }
    if (import.meta.client) localStorage.setItem('nuxtapp-profile', JSON.stringify(nextProfile))
    profile.value = nextProfile
    notifications.announce('Profile updated successfully')
  }
  function savePreferences(value: UserPreferences) {
    const nextPreferences = { ...value, notifications: { ...value.notifications } }
    if (import.meta.client)
      localStorage.setItem('nuxtapp-preferences', JSON.stringify(nextPreferences))
    preferences.value = nextPreferences
    notifications.announce('Preferences saved successfully')
  }

  function setTheme(theme: Theme) {
    const nextPreferences = { ...preferences.value, theme }
    if (import.meta.client)
      localStorage.setItem('nuxtapp-preferences', JSON.stringify(nextPreferences))
    preferences.value = nextPreferences
  }

  return { profile, preferences, hydrateSettings, saveProfile, savePreferences, setTheme }
})
