import { toDateInput } from '../utils/date'

export function useAppDate() {
  // Serialize the initial calendar date so SSR and hydration use the same day.
  return useState('app-current-date', () => toDateInput(new Date()))
}
