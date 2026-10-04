import type { TeamActivity, MonthlyActivity, UpcomingDeadline } from '../types/activity'

export const teamActivity: TeamActivity[] = [
  {
    initials: 'OR',
    name: 'Olivia Rhye',
    action: 'completed the homepage wireframes',
    time: '12 min ago',
    tone: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  },
  {
    initials: 'PB',
    name: 'Phoenix Baker',
    action: 'moved Mobile App to In review',
    time: '38 min ago',
    tone: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
  },
  {
    initials: 'LS',
    name: 'Lana Steiner',
    action: 'added 3 tasks to Website Redesign',
    time: '1 hr ago',
    tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  },
]

export const monthlyActivity: MonthlyActivity[] = [
  { month: 'May', projects: 24, tasks: 42 },
  { month: 'Jun', projects: 36, tasks: 55 },
  { month: 'Jul', projects: 30, tasks: 49 },
  { month: 'Aug', projects: 48, tasks: 68 },
  { month: 'Sep', projects: 42, tasks: 62 },
  { month: 'Oct', projects: 58, tasks: 82 },
]

export const upcomingDeadlines: UpcomingDeadline[] = [
  {
    title: 'Homepage design handoff',
    project: 'Website Redesign',
    date: 'Oct 06',
    days: 'In 3 days',
    tone: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300',
  },
  {
    title: 'Campaign assets review',
    project: 'Brand Strategy',
    date: 'Oct 08',
    days: 'In 5 days',
    tone: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300',
  },
  {
    title: 'Mobile app prototype',
    project: 'Mobile App',
    date: 'Oct 12',
    days: 'In 9 days',
    tone: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300',
  },
]
