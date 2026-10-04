import { useNotificationStore } from './notifications'
import { users } from '../data/users'
import type { User } from '../types/user'

export const useTeamStore = defineStore('team', () => {
  const notifications = useNotificationStore()
  const userList = ref<User[]>(users.map((item) => ({ ...item })))

  function saveUser(user: User) {
    const index = userList.value.findIndex((item) => item.id === user.id)
    if (index < 0) userList.value.unshift(user)
    else userList.value.splice(index, 1, user)
    notifications.announce(
      index < 0 ? 'Team member added successfully' : 'Team member updated successfully',
    )
  }
  function deleteUser(id: number) {
    userList.value = userList.value.filter((item) => item.id !== id)
    notifications.announce('Team member deleted successfully')
  }

  return { users: userList, saveUser, deleteUser }
})
