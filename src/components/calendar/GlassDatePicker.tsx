import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import 'react-day-picker/style.css'
import {
  type DropdownProps,
  DayFlag,
  DayPicker,
  SelectionState,
  UI,
} from 'react-day-picker'

type GlassDatePickerProps = {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  disableFutureDates?: boolean
}

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

const calendarClassNames = {
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
} satisfies Parameters<typeof DayPicker>[0]['classNames']

const dayPickerComponents = {
  Dropdown: CalendarGlassDropdown,
}

export default function GlassDatePicker({
  selected,
  onSelect,
  disableFutureDates = true,
}: GlassDatePickerProps) {
  const today = useMemo(() => new Date(), [])
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      classNames={calendarClassNames}
      components={dayPickerComponents}
      disabled={disableFutureDates ? { after: today } : undefined}
      captionLayout="dropdown"
      startMonth={new Date(2025, 0, 1)}
      endMonth={new Date(2030, 11, 31)}
      hideNavigation
      className="text-[12px]"
    />
  )
}