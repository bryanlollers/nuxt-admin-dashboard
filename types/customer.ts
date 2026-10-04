export type Customer = {
  id: number
  name: string
  email: string
  initials: string
  color: string
  company: string
  status: 'Active' | 'Pending' | 'Inactive'
  spent: string
  joined: string
  phone?: string
}
