import { useNotificationStore } from './notifications'
import { tasks } from '../data/tasks'
import type { Task } from '../types/task'

export const useTaskStore = defineStore('tasks', () => {
  const notifications = useNotificationStore()
  const taskList = ref<Task[]>(tasks.map((item) => ({ ...item })))
  const completedTasks = computed(() => taskList.value.filter((task) => task.done).length)

  function toggleTask(id: number) {
    const task = taskList.value.find((item) => item.id === id)
    if (task) {
      task.done = !task.done
      task.status = task.done ? 'Completed' : 'To do'
    }
  }
  function setTaskStatus(id: number, status: Task['status']) {
    const task = taskList.value.find((item) => item.id === id)
    if (!task) return
    task.status = status
    task.done = status === 'Completed'
  }
  function saveTask(task: Task) {
    const index = taskList.value.findIndex((item) => item.id === task.id)
    task.done = task.status === 'Completed'
    if (index < 0) taskList.value.unshift(task)
    else taskList.value.splice(index, 1, task)
    notifications.announce(index < 0 ? 'Task created successfully' : 'Task updated successfully')
  }
  function deleteTask(id: number) {
    taskList.value = taskList.value.filter((item) => item.id !== id)
    notifications.announce('Task deleted successfully')
  }

  return { tasks: taskList, completedTasks, toggleTask, setTaskStatus, saveTask, deleteTask }
})
