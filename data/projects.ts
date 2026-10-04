import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    id: 1,
    name: 'Website Redesign',
    client: 'Orbit Labs',
    initials: 'OL',
    color: 'lavender',
    progress: 72,
    due: 'Mar 28, 2024',
    team: ['OR', 'PB', 'LS'],
    status: 'On track',
  },
  {
    id: 2,
    name: 'Mobile App',
    client: 'Layers',
    initials: 'LY',
    color: 'peach',
    progress: 48,
    due: 'Apr 04, 2024',
    team: ['DW', 'NC', 'DC'],
    status: 'In progress',
  },
  {
    id: 3,
    name: 'Brand Strategy',
    client: 'Circooles',
    initials: 'CI',
    color: 'mint',
    progress: 91,
    due: 'Mar 22, 2024',
    team: ['CW', 'OR', 'OD'],
    status: 'On track',
  },
]
