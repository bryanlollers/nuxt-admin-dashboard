export type User = {
  id: number
  name: string
  role: string
  initials: string
  color: string
  email: string
  department: string
  status: 'Active' | 'Away' | 'Inactive'
  phone: string
}
