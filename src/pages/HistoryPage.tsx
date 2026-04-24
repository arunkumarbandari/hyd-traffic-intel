import { useQuery } from '@tanstack/react-query'
import {
  type DropdownProps,
  DayFlag,
  DayPicker,
  SelectionState,
  UI,
} from 'react-day-picker'
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import 'react-day-picker/style.css'
import { fetchIncidents, type IncidentRow, type IncidentStatus, type IncidentType } from '../api/incidents'

function formatStatusLabel(status: IncidentStatus) {
  if (status === 'active') return 'Active'
  if (status === 'expiring') return 'Expiring'
  return 'Cleared'
}

function getStatusClasses(status: IncidentStatus) {
  if (status === 'cleared') {
    return 'bg-color-green/10 text-color-green-dark border-color-green/20'
  }

  if (status === 'expiring') {
    return 'bg-color-orange/12 text-color-orange border-color-orange/25'
  }

  return 'bg-color-red/10 text-color-red border-color-red/20'
}

function getTypeLabel(type: IncidentType) {
  if (type === 'accident') return 'Accident'
  if (type === 'congestion') return 'Congestion'
  if (type === 'roadwork') return 'Roadwork'
  if (type === 'other') return 'Other'
  return 'Breakdown'
}

function getTypeIcon(type: IncidentType) {
  if (type === 'accident') return 'car_crash'
  if (type === 'congestion') return 'traffic'
  if (type === 'roadwork') return 'construction'
  if (type === 'other') return 'report'
  return 'build'
}

function getTypeIconColor(type: IncidentType) {
  if (type === 'accident') return 'text-color-orange'
  if (type === 'congestion') return 'text-color-red'
  if (type === 'roadwork') return 'text-primary'
  if (type === 'other') return 'text-color-purple'
  return 'text-color-teal'
}

function getDurationText(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return '—'
  }

  const totalMinutes = Math.max(Math.round((end - start) / 60000), 1)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

function toDateInputValue(value: string) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

function toStartIso(day: string) {
  if (!day) return ''
  return new Date(`${day}T00:00:00`).toISOString()
}

function toEndIso(day: string) {
  if (!day) return ''
  return new Date(`${day}T23:59:59`).toISOString()
}

function parseDateValue(value: string) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatDateValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateLabel(isoValue: string) {
  const value = toDateInputValue(isoValue)
  if (!value) return 'Select date'
  const parsed = parseDateValue(value)
  return parsed
    ? parsed.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
    : value
}

const EMPTY_INCIDENTS: IncidentRow[] = []
const NO_SELECTION = '__none__'

const typeOptions = [
  { value: 'all', label: 'All Types', icon: 'emergency' },
  { value: 'breakdown', label: 'Breakdown', icon: 'build' },
  { value: 'accident', label: 'Accident', icon: 'car_crash' },
  { value: 'congestion', label: 'Congestion', icon: 'traffic' },
  { value: 'roadwork', label: 'Road Work', icon: 'construction' },
  { value: 'other', label: 'Other', icon: 'info' },
] as const

function CalendarGlassDropdown({
  classNames,
  components,
  options,
  onChange,
  disabled,
  value,
  ...selectProps
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (rootRef.current && !rootRef.current.contains(target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const selectedValue = Number(value)
  const selectedOption = options?.find((option) => option.value === selectedValue)

  const handleSelect = (nextValue: number) => {
    if (!onChange) return

    onChange({
      target: { value: String(nextValue) },
    } as ChangeEvent<HTMLSelectElement>)

    setOpen(false)
  }

  return (
    <div ref={rootRef} data-disabled={disabled} className={`${classNames[UI.DropdownRoot]} calendar-glass-dropdown-root`}>
      <button
        type="button"
        className={classNames[UI.Dropdown]}
        disabled={disabled}
        aria-label={selectProps['aria-label']}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="truncate leading-none">{selectedOption?.label ?? ''}</span>
        <span className="inline-flex h-4 w-4 items-center justify-center">
          <components.Chevron
            orientation="down"
            size={14}
            className={`${classNames[UI.Chevron]} transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </span>
      </button>

      {open ? (
        <div className="calendar-glass-options" role="listbox" aria-label={selectProps['aria-label']}>
          {options?.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              disabled={option.disabled}
              aria-selected={selectedValue === option.value}
              className={`calendar-glass-option ${selectedValue === option.value ? 'calendar-glass-option-active' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function HistoryPage() {
  const calendarClassNames = useMemo(
    () => ({
      [UI.MonthCaption]: 'flex items-center justify-between px-1',
      [UI.Dropdowns]: 'flex items-center gap-2',
      [UI.DropdownRoot]: 'relative inline-flex min-w-0 items-center',
      [UI.Dropdown]:
        'inline-flex h-8 min-w-[6.5rem] items-center justify-between gap-1 rounded-[12px] border border-white/30 bg-white px-2.5 text-[12px] font-medium text-label-primary outline-none appearance-none',
      [UI.MonthsDropdown]: 'min-w-[6.5rem]',
      [UI.YearsDropdown]: 'min-w-[5.25rem]',
      [UI.Chevron]: 'shrink-0 text-label-primary/90',
      [UI.PreviousMonthButton]: 'h-8 w-8 rounded-full text-label-secondary hover:bg-primary/10',
      [UI.NextMonthButton]: 'h-8 w-8 rounded-full text-label-secondary hover:bg-primary/10',
      [UI.Month]: 'w-full',
      [UI.MonthGrid]: 'w-full border-collapse table-fixed',
      [UI.Weekdays]: 'grid grid-cols-7 gap-0.5',
      [UI.Weekday]: 'text-center text-[10px] font-medium text-label-secondary',
      [UI.Week]: 'grid grid-cols-7 gap-0.5',
      [UI.Day]: 'flex justify-center',
      [UI.DayButton]: 'h-7 w-7 rounded-lg text-[11px] text-label-primary hover:bg-primary/8 sm:h-8 sm:w-8 sm:text-[12px]',
      [DayFlag.outside]: 'text-label-secondary/60',
      [SelectionState.selected]: 'bg-primary text-white hover:bg-primary',
      [DayFlag.today]: 'font-semibold',
      [UI.CaptionLabel]: 'hidden',
    }),
    [],
  ) satisfies Parameters<typeof DayPicker>[0]['classNames']

  const dayPickerComponents = useMemo(
    () => ({
      Dropdown: CalendarGlassDropdown,
    }),
    [],
  )

  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const [fromCalendarOpen, setFromCalendarOpen] = useState(false)
  const [toCalendarOpen, setToCalendarOpen] = useState(false)
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null)
  const typeDropdownRef = useRef<HTMLDivElement | null>(null)
  const fromDateRef = useRef<HTMLDivElement | null>(null)
  const toDateRef = useRef<HTMLDivElement | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['incidents', 'history', page, typeFilter, dateFrom, dateTo],
    queryFn: () =>
      fetchIncidents({
        page: String(page),
        limit: '50',
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(dateFrom && { from: dateFrom }),
        ...(dateTo && { to: dateTo }),
      }),
    staleTime: 30_000,
  })

  const incidentRows = data?.data ?? EMPTY_INCIDENTS
  const pagination = data?.pagination

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return incidentRows
    const q = searchQuery.toLowerCase()
    return incidentRows.filter(
      (inc) =>
        inc.location_name.toLowerCase().includes(q) ||
        inc.incident_type.toLowerCase().includes(q) ||
        inc.raw_message.toLowerCase().includes(q),
    )
  }, [incidentRows, searchQuery])

  const selectedIncident = useMemo(() => {
    if (!filteredData.length) return null

    if (selectedIncidentId === NO_SELECTION) return null

    if (selectedIncidentId) {
      const matched = filteredData.find((row) => row.id === selectedIncidentId)
      if (matched) return matched
    }

    return filteredData[0] ?? null
  }, [filteredData, selectedIncidentId])

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value)
    setPage(1)
  }

  const handleFromChange = (value: string) => {
    setDateFrom(toStartIso(value))
    setPage(1)
  }

  const handleToChange = (value: string) => {
    setDateTo(toEndIso(value))
    setPage(1)
  }

  const handleDateSelect = (target: 'from' | 'to', value?: Date) => {
    if (!value) return

    const normalized = formatDateValue(value)

    if (target === 'from') {
      handleFromChange(normalized)
      setFromCalendarOpen(false)
      return
    }

    handleToChange(normalized)
    setToCalendarOpen(false)
  }

  const handleDateClear = (target: 'from' | 'to') => {
    if (target === 'from') {
      setDateFrom('')
      setPage(1)
      setFromCalendarOpen(false)
      return
    }

    setDateTo('')
    setPage(1)
    setToCalendarOpen(false)
  }

  const openFromCalendar = () => {
    setToCalendarOpen(false)
    setFromCalendarOpen((prev) => !prev)
  }

  const openToCalendar = () => {
    setFromCalendarOpen(false)
    setToCalendarOpen((prev) => !prev)
  }

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node

      if (typeDropdownOpen && typeDropdownRef.current && !typeDropdownRef.current.contains(target)) {
        setTypeDropdownOpen(false)
      }

      if (fromCalendarOpen && fromDateRef.current && !fromDateRef.current.contains(target)) {
        setFromCalendarOpen(false)
      }

      if (toCalendarOpen && toDateRef.current && !toDateRef.current.contains(target)) {
        setToCalendarOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [fromCalendarOpen, toCalendarOpen, typeDropdownOpen])

  const currentPage = pagination?.page ?? page
  const totalPages = pagination?.total_pages ?? 1

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-bg-primary font-body text-body text-label-primary antialiased">
      <div className="pointer-events-none absolute inset-0 z-0 bg-white" />
      <div className="pointer-events-none fixed inset-0 z-0">
        <img
          src="/intelligence-orange-abstract.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.62]"
        />
      </div>
      <div className="pointer-events-none fixed left-[4%] top-[2%] z-[1] h-[54vw] w-[54vw] rounded-full bg-color-orange/20 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-[14%] right-[4%] z-[1] h-[48vw] w-[48vw] rounded-full bg-[#ffd8b1]/58 blur-[130px]" />

      <main className="relative z-10 mx-auto mt-16 flex w-full max-w-[1600px] flex-1 overflow-hidden">
        <section className="z-10 flex min-w-0 flex-1 flex-col border-r border-outline-variant/30 bg-glass-fill-light shadow-[4px_0_24px_rgba(0,0,0,0.02)] backdrop-blur-[30px]">
          <div className="relative z-40 shrink-0 p-space-6 pb-space-4">
            <h1 className="mb-space-5 font-large-title text-large-title tracking-tight text-label-primary">
              Incident Archive
            </h1>

            <div className="flex flex-col items-stretch gap-space-2 rounded-[16px] border border-glass-border bg-glass-fill-light p-space-2 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-[30px] md:flex-row md:items-center">
              <div className="relative w-full min-w-0 flex-1">
                <span className="material-symbols-outlined absolute left-space-3 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search junction, ID, or officer..."
                  className="h-10 w-full appearance-none rounded-xl border-none bg-white/60 pl-10 pr-space-3 text-[16px] text-label-primary shadow-sm outline-none ring-1 ring-black/5 transition-all placeholder:text-label-secondary focus:bg-white focus:ring-2 focus:ring-primary md:h-auto md:py-2.5 md:font-subheadline md:text-subheadline"
                />
              </div>

              <div className="relative flex w-full min-w-0 gap-space-2 md:w-auto">
                <div ref={fromDateRef} className="flex flex-1 items-center md:flex-none">
                  <button
                    type="button"
                    onClick={openFromCalendar}
                    className="flex h-10 w-full items-center rounded-xl border border-white/40 bg-white/60 pl-9 pr-3 text-left text-[13px] font-medium text-label-primary shadow-[0_2px_8px_rgba(0,0,0,0.08)] outline-none backdrop-blur-xl focus:border-primary/60 focus:ring-2 focus:ring-primary/20 md:w-[150px]"
                  >
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[16px] text-label-secondary">
                      calendar_today
                    </span>
                    {formatDateLabel(dateFrom)}
                  </button>

                  {fromCalendarOpen ? (
                    <div className="absolute left-0 top-full z-[80] mt-2 w-max max-w-full rounded-2xl border border-white/50 bg-white/80 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:p-3">
                      <DayPicker
                        mode="single"
                        captionLayout="dropdown"
                        startMonth={new Date(2025, 0, 1)}
                        endMonth={new Date(2030, 11, 31)}
                        hideNavigation
                        selected={parseDateValue(toDateInputValue(dateFrom)) ?? undefined}
                        onSelect={(value) => handleDateSelect('from', value)}
                        className="text-[12px]"
                        classNames={calendarClassNames}
                        components={dayPickerComponents}
                      />

                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDateClear('from')}
                          className="rounded-lg px-2 py-1 text-[12px] font-medium text-label-secondary hover:bg-primary/8 hover:text-label-primary"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div ref={toDateRef} className="flex flex-1 items-center md:flex-none">
                  <button
                    type="button"
                    onClick={openToCalendar}
                    className="flex h-10 w-full items-center rounded-xl border border-white/40 bg-white/60 pl-9 pr-3 text-left text-[13px] font-medium text-label-primary shadow-[0_2px_8px_rgba(0,0,0,0.08)] outline-none backdrop-blur-xl focus:border-primary/60 focus:ring-2 focus:ring-primary/20 md:w-[150px]"
                  >
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[16px] text-label-secondary">
                      calendar_today
                    </span>
                    {formatDateLabel(dateTo)}
                  </button>

                  {toCalendarOpen ? (
                    <div className="absolute left-0 top-full z-[80] mt-2 w-max max-w-full rounded-2xl border border-white/50 bg-white/80 p-2 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl sm:p-3">
                      <DayPicker
                        mode="single"
                        captionLayout="dropdown"
                        startMonth={new Date(2025, 0, 1)}
                        endMonth={new Date(2030, 11, 31)}
                        hideNavigation
                        selected={parseDateValue(toDateInputValue(dateTo)) ?? undefined}
                        onSelect={(value) => handleDateSelect('to', value)}
                        className="text-[12px]"
                        classNames={calendarClassNames}
                        components={dayPickerComponents}
                      />

                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDateClear('to')}
                          className="rounded-lg px-2 py-1 text-[12px] font-medium text-label-secondary hover:bg-primary/8 hover:text-label-primary"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div ref={typeDropdownRef} className="relative flex-1 md:flex-none">
                  <button
                    type="button"
                    onClick={() => setTypeDropdownOpen((prev) => !prev)}
                    className="flex h-10 min-w-[130px] w-full items-center justify-between gap-2 rounded-xl border border-white/40 bg-white/60 px-4 text-[13px] font-medium text-label-primary shadow-[0_2px_8px_rgba(0,0,0,0.08)] outline-none backdrop-blur-xl focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  >
                    <span>{typeOptions.find((option) => option.value === typeFilter)?.label ?? 'All Types'}</span>
                    <span className="material-symbols-outlined text-[16px] text-label-secondary">
                      {typeDropdownOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {typeDropdownOpen ? (
                    <div className="absolute right-0 top-full z-[90] mt-2 w-44 overflow-hidden rounded-xl border border-white/50 bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
                      {typeOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            handleTypeFilterChange(option.value)
                            setTypeDropdownOpen(false)
                          }}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] text-label-primary transition-colors hover:bg-primary/8 ${
                            typeFilter === option.value ? 'bg-primary/10 font-semibold text-primary' : ''
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px] text-label-secondary">
                            {option.icon}
                          </span>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-12 gap-space-4 border-b border-outline-variant/40 px-space-6 py-space-2 font-footnote text-footnote text-label-secondary">
            <div className="col-span-4">Junction & Type</div>
            <div className="col-span-3">Date & Time</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-3 text-right">Status</div>
          </div>

          <div className="flex flex-1 flex-col gap-space-2 overflow-y-auto p-space-4">
            {isLoading ? (
              <div className="rounded-xl border border-transparent bg-glass-fill-light p-space-3 backdrop-blur-[30px]">
                Loading incidents...
              </div>
            ) : null}

            {!isLoading && !filteredData.length ? (
              <div className="rounded-xl border border-transparent bg-glass-fill-light p-space-3 backdrop-blur-[30px]">
                No incidents found for current filters.
              </div>
            ) : null}

            {!isLoading &&
              filteredData.map((row: IncidentRow) => {
                const selected = selectedIncident?.id === row.id

                return (
                  <div
                    key={row.id}
                    className={`grid cursor-pointer grid-cols-12 items-center gap-space-4 rounded-xl p-space-3 transition-all ${
                      selected
                        ? 'border border-primary/20 bg-glass-fill-light shadow-sm backdrop-blur-[30px]'
                        : 'border border-transparent bg-glass-fill-light backdrop-blur-[30px] hover:border-outline-variant/30 hover:bg-surface-container-low'
                    }`}
                    onClick={() => setSelectedIncidentId(row.id)}
                  >
                    <div className="col-span-4 flex flex-col gap-1">
                      <span className="truncate font-headline text-headline text-label-primary">
                        {row.location_name}
                      </span>
                      <div className="flex items-center gap-1 font-caption-1 text-caption-1 text-label-secondary">
                        <span className={`material-symbols-outlined text-[14px] ${getTypeIconColor(row.incident_type)}`}>
                          {getTypeIcon(row.incident_type)}
                        </span>
                        <span>{getTypeLabel(row.incident_type)}</span>
                      </div>
                    </div>

                    <div className="col-span-3 flex flex-col font-subheadline text-subheadline text-label-secondary">
                      <span>{new Date(row.reported_at).toLocaleString()}</span>
                      <span className="font-caption-1 text-caption-1 text-label-secondary">
                        Expires: {new Date(row.expires_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="col-span-2 font-subheadline text-subheadline text-label-secondary">
                      {getDurationText(row.reported_at, row.expires_at)}
                    </div>

                    <div className="col-span-3 flex justify-end">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 font-caption-1 text-caption-1 font-medium ${getStatusClasses(row.status)}`}
                      >
                        {formatStatusLabel(row.status)}
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-outline-variant/40 px-space-6 py-space-3">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="rounded-xl bg-white/60 px-space-4 py-2 font-subheadline text-subheadline text-label-primary ring-1 ring-black/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Prev
            </button>
            <span className="font-subheadline text-subheadline text-label-secondary">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="rounded-xl bg-white/60 px-space-4 py-2 font-subheadline text-subheadline text-label-primary ring-1 ring-black/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>

        <section className="hidden w-[450px] bg-transparent p-space-6 lg:flex xl:w-[500px]">
          <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-white/60 bg-glass-fill-light shadow-[0_24px_60px_-12px_rgba(0,0,0,0.15)] backdrop-blur-[30px]">
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[28px] border-t border-white/80" />

            <div className="z-10 flex items-start justify-between bg-gradient-to-b from-white/50 to-transparent px-space-6 pb-space-4 pt-space-6">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    ID: {selectedIncident?.id ?? '—'}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 font-caption-2 text-caption-2 font-medium ${
                      selectedIncident ? getStatusClasses(selectedIncident.status) : 'border-outline-variant/50 text-label-secondary'
                    }`}
                  >
                    {selectedIncident ? formatStatusLabel(selectedIncident.status) : '—'}
                  </span>
                </div>
                <h2 className="mt-1 font-title-2 text-title-2 leading-tight text-label-primary">
                  {selectedIncident?.location_name ?? 'Select an incident'}
                </h2>
                <p className="mt-1 font-subheadline text-subheadline text-label-secondary">
                  {selectedIncident ? new Date(selectedIncident.reported_at).toLocaleString() : '—'}
                </p>
              </div>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-label-secondary transition-colors hover:bg-surface-variant"
                onClick={() => setSelectedIncidentId(NO_SELECTION)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="z-10 flex flex-1 flex-col gap-space-6 overflow-y-auto px-space-6 pb-space-6">
              <div className="space-y-space-3">
                <h3 className="flex items-center gap-2 font-headline text-headline text-label-primary">
                  <span className="material-symbols-outlined text-[18px] text-color-green">
                    forum
                  </span>
                  Source Intelligence
                </h3>

                <div className="relative inline-block max-w-[90%] rounded-[16px] rounded-tl-none border border-black/5 bg-[#e1ffd4] p-space-4 text-label-primary shadow-sm">
                  <p className="font-body text-body leading-relaxed">
                    {selectedIncident?.raw_message ?? '—'}
                  </p>
                  <div className="mt-2 flex items-center justify-between font-caption-2 text-caption-2 text-label-secondary">
                    <span>~ {selectedIncident?.source ?? '—'}</span>
                    <span>
                      {selectedIncident ? new Date(selectedIncident.reported_at).toLocaleString() : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-space-3">
                <h3 className="flex items-center gap-2 font-headline text-headline text-label-primary">
                  <span className="material-symbols-outlined text-[18px] text-color-blue-dark">
                    photo_camera
                  </span>
                  Visual Evidence
                </h3>

                {selectedIncident?.photo_url ? (
                  <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-outline-variant/30 shadow-sm">
                    <img
                      alt="Traffic incident evidence"
                      className="h-[180px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={selectedIncident.photo_url}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
                      <span className="material-symbols-outlined text-[32px] text-white opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100">
                        zoom_in
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="space-y-space-2 rounded-xl border border-outline-variant/30 bg-white/40 p-space-4">
                <p className="font-subheadline text-subheadline text-label-primary">
                  <span className="font-semibold">Clean message:</span> {selectedIncident?.clean_message ?? '—'}
                </p>
                <p className="font-subheadline text-subheadline text-label-primary">
                  <span className="font-semibold">Type:</span>{' '}
                  {selectedIncident ? getTypeLabel(selectedIncident.incident_type) : '—'}
                </p>
                <p className="font-subheadline text-subheadline text-label-primary">
                  <span className="font-semibold">Status:</span>{' '}
                  {selectedIncident ? formatStatusLabel(selectedIncident.status) : '—'}
                </p>
                <p className="font-subheadline text-subheadline text-label-primary">
                  <span className="font-semibold">Reported at:</span>{' '}
                  {selectedIncident ? new Date(selectedIncident.reported_at).toLocaleString() : '—'}
                </p>
                <p className="font-subheadline text-subheadline text-label-primary">
                  <span className="font-semibold">Expires at:</span>{' '}
                  {selectedIncident ? new Date(selectedIncident.expires_at).toLocaleString() : '—'}
                </p>
                <p className="font-subheadline text-subheadline text-label-primary">
                  <span className="font-semibold">Estimated delay:</span>{' '}
                  {selectedIncident ? `${selectedIncident.estimated_minutes} min` : '—'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-subheadline text-subheadline font-semibold text-label-primary">
                    Parsed by:
                  </span>
                  <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-caption-2 text-caption-2 font-medium text-primary">
                    {selectedIncident?.parsed_by ?? '—'}
                  </span>
                </div>
                <p className="font-subheadline text-subheadline text-label-primary">
                  <span className="font-semibold">Source:</span> {selectedIncident?.source ?? '—'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
