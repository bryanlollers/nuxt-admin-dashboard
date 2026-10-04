export type TeamActivity = {
  initials: string
  name: string
  action: string
  time: string
  tone: string
}

export type MonthlyActivity = {
  month: string
  projects: number
  tasks: number
}

export type UpcomingDeadline = {
  title: string
  project: string
  date: string
  days: string
  tone: string
}
