import { useNotificationStore } from './notifications'
import { projects } from '../data/projects'
import type { Project } from '../types/project'

export const useProjectStore = defineStore('projects', () => {
  const notifications = useNotificationStore()
  const projectList = ref<Project[]>(projects.map((item) => ({ ...item, team: [...item.team] })))

  function saveProject(project: Project) {
    const index = projectList.value.findIndex((item) => item.id === project.id)
    if (index < 0) projectList.value.unshift(project)
    else projectList.value.splice(index, 1, project)
    notifications.announce(
      index < 0 ? 'Project created successfully' : 'Project updated successfully',
    )
  }
  function addProject(name: string, client: string, due: string) {
    saveProject({
      id: Date.now(),
      name,
      client,
      initials: client.slice(0, 2).toUpperCase(),
      color: 'lavender',
      progress: 0,
      due,
      team: ['JD', 'OR'],
      status: 'Just started',
    })
  }
  function deleteProject(id: number) {
    projectList.value = projectList.value.filter((item) => item.id !== id)
    notifications.announce('Project deleted successfully')
  }

  return { projects: projectList, addProject, saveProject, deleteProject }
})
