import type { Task } from '../types/task'

export const tasks: Task[] = [
  {
    id: 1,
    title: 'Finalize homepage wireframes',
    project: 'Website Redesign',
    priority: 'High',
    due: 'Today',
    done: false,
    status: 'To do',
    assignee: 'Olivia Rhye',
  },
  {
    id: 2,
    title: 'Review Q1 campaign assets',
    project: 'Brand Strategy',
    priority: 'Medium',
    due: 'Today',
    done: false,
    status: 'In progress',
    assignee: 'Phoenix Baker',
  },
  {
    id: 3,
    title: 'Send project proposal',
    project: 'Mobile App',
    priority: 'High',
    due: 'Tomorrow',
    done: false,
    status: 'To do',
    assignee: 'Lana Steiner',
  },
  {
    id: 4,
    title: 'Update design system tokens',
    project: 'Website Redesign',
    priority: 'Low',
    due: 'Mar 22',
    done: true,
    status: 'Completed',
    assignee: 'Olivia Rhye',
  },
]
