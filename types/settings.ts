export type Theme = 'light' | 'dark'

export interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
}

export interface NotificationPreferences {
  email: boolean
  inApp: boolean
  weeklySummary: boolean
}

export interface UserPreferences {
  theme: Theme
  sidebarCollapsed: boolean
  notifications: NotificationPreferences
  dateFormat: string
  timeFormat: string
  currency: string
}
