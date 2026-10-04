import { useNotificationStore } from './notifications'
import { customers } from '../data/customers'
import type { Customer } from '../types/customer'

export const useCustomerStore = defineStore('customers', () => {
  const notifications = useNotificationStore()
  const customerList = ref<Customer[]>(customers.map((item) => ({ ...item })))
  const query = ref('')
  const statusFilter = ref('All status')
  const page = ref(1)
  const pageSize = ref(5)

  const filteredCustomers = computed(() =>
    customerList.value.filter((customer) => {
      const matchesQuery = `${customer.name} ${customer.email} ${customer.company}`
        .toLowerCase()
        .includes(query.value.toLowerCase())
      return (
        matchesQuery &&
        (statusFilter.value === 'All status' || customer.status === statusFilter.value)
      )
    }),
  )
  const pageCount = computed(() =>
    Math.max(1, Math.ceil(filteredCustomers.value.length / pageSize.value)),
  )
  const pagedCustomers = computed(() =>
    filteredCustomers.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value),
  )

  function setQuery(value: string) {
    query.value = value
    page.value = 1
  }
  function setStatus(value: string) {
    statusFilter.value = value
    page.value = 1
  }
  function setPage(value: number) {
    page.value = Math.min(pageCount.value, Math.max(1, value))
  }
  function saveCustomer(customer: Customer) {
    const index = customerList.value.findIndex((item) => item.id === customer.id)
    if (index < 0) customerList.value.unshift(customer)
    else customerList.value.splice(index, 1, customer)
    notifications.announce(
      index < 0 ? 'Customer created successfully' : 'Customer updated successfully',
    )
  }
  function deleteCustomer(id: number) {
    customerList.value = customerList.value.filter((item) => item.id !== id)
    notifications.announce('Customer deleted successfully')
  }

  return {
    customers: customerList,
    query,
    statusFilter,
    page,
    pageSize,
    filteredCustomers,
    pageCount,
    pagedCustomers,
    setQuery,
    setStatus,
    setPage,
    saveCustomer,
    deleteCustomer,
  }
})
