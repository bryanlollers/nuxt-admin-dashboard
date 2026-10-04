/** Converts a date or Today/Tomorrow label to YYYY-MM-DD for native date inputs; returns an empty string for unparseable values. */
export function toDateInput(value: string | Date, referenceDate = new Date()): string {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = value === 'Today' || value === 'Tomorrow' ? new Date(referenceDate) : new Date(value)
  if (value === 'Tomorrow') date.setDate(date.getDate() + 1)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Formats a calendar date in English with optional display settings and consistent time zone handling. */
export function formatDate(
  value: string | Date,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' },
): string {
  const calendarDate = toDateInput(value)
  if (!calendarDate) return ''
  // Calendar dates do not shift when the server and browser use different time zones.
  return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(
    new Date(`${calendarDate}T12:00:00Z`),
  )
}
