export const useDashboardStore = defineStore('dashboard', () => {
  const range = ref('Last 30 days')

  function setRange(value: string) {
    range.value = value
  }

  return { range, setRange }
})
