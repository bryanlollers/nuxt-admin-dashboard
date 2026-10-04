/** Converts rows into CSV text, quoting values and escaping embedded quotation marks. */
export function createCsv(rows: readonly (readonly unknown[])[]): string {
  return rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
    .join('\r\n')
}

/** Downloads rows as a CSV file in the browser and releases the temporary object URL. */
export function downloadCsv(rows: readonly (readonly unknown[])[], filename: string): void {
  const blob = new Blob([createCsv(rows)], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
