export function toDateInputValue(value: string) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export function toStartIso(day: string) {
  if (!day) return ''
  return new Date(`${day}T00:00:00`).toISOString()
}

export function toEndIso(day: string) {
  if (!day) return ''
  return new Date(`${day}T23:59:59`).toISOString()
}

export function parseDateValue(value: string) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export function formatDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateLabel(isoValue: string) {
  const value = toDateInputValue(isoValue)
  if (!value) return 'Select date'
  const parsed = parseDateValue(value)
  return parsed
    ? parsed.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
    : value
}