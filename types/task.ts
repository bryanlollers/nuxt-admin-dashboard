export type Task = {
  id: number
  title: string
  project: string
  priority: 'High' | 'Medium' | 'Low'
  due: string
  done: boolean
  status: 'To do' | 'In progress' | 'Completed'
  assignee: string
}
