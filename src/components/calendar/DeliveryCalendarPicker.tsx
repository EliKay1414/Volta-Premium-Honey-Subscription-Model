import React, {useState, useRef, useEffect, FC} from 'react'
import {Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock} from 'lucide-react'

export interface DeliveryCalendarPickerProps {
  value: string
  onChange: (dateStr: string) => void
  label?: string
  placeholder?: string
  className?: string
  required?: boolean
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const DAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export const formatDateToSchedule = (date: Date): string => {
  const month = MONTH_SHORT[date.getMonth()]
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

export const parseScheduleDate = (str: string): Date => {
  if (!str) return new Date()

  // Handle preset strings like "Next Monday", "Immediate (Today)", etc.
  const today = new Date()
  if (str.toLowerCase().includes('today')) return today
  if (str.toLowerCase().includes('tomorrow')) {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d
  }
  if (str.toLowerCase().includes('monday')) {
    const d = new Date()
    const day = d.getDay()
    const diff = (8 - day) % 7 || 7
    d.setDate(d.getDate() + diff)
    return d
  }
  if (str.toLowerCase().includes('next month')) {
    const d = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    return d
  }

  // Try parsing "Sep 28, 2026" or ISO
  const parsed = new Date(str)
  if (!isNaN(parsed.getTime())) return parsed

  return today
}

export const DeliveryCalendarPicker: FC<DeliveryCalendarPickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select delivery schedule',
  className = '',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentDate = parseScheduleDate(value)
  const [viewYear, setViewYear] = useState(currentDate.getFullYear() || 2026)
  const [viewMonth, setViewMonth] = useState(currentDate.getMonth() || 8)

  // Update view when value changes
  useEffect(() => {
    const d = parseScheduleDate(value)
    if (!isNaN(d.getTime())) {
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [value])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Generate days in current month
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1)
  const lastDayOfMonth = new Date(viewYear, viewMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Monday-based day of week (0 = Monday, 6 = Sunday)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1
  if (startDayOfWeek === -1) startDayOfWeek = 6

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day)
    onChange(formatDateToSchedule(selected))
    setIsOpen(false)
  }

  const applyPreset = (type: 'today' | 'tomorrow' | 'nextMonday' | 'inOneWeek' | 'firstOfNextMonth') => {
    const now = new Date()
    let target = new Date()
    if (type === 'today') {
      target = now
    } else if (type === 'tomorrow') {
      target.setDate(now.getDate() + 1)
    } else if (type === 'nextMonday') {
      const day = now.getDay()
      const diff = (8 - day) % 7 || 7
      target.setDate(now.getDate() + diff)
    } else if (type === 'inOneWeek') {
      target.setDate(now.getDate() + 7)
    } else if (type === 'firstOfNextMonth') {
      target = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    }
    onChange(formatDateToSchedule(target))
    setViewYear(target.getFullYear())
    setViewMonth(target.getMonth())
    setIsOpen(false)
  }

  const isSelected = (day: number) => {
    const parsed = parseScheduleDate(value)
    return (
      parsed.getDate() === day &&
      parsed.getMonth() === viewMonth &&
      parsed.getFullYear() === viewYear
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    )
  }

  return (
    <div className={`position-relative ${className}`} ref={containerRef}>
      {label && (
        <label className={`form-label fw-bold fs-7 text-gray-700 ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type='button'
        className='form-control form-control-solid d-flex align-items-center justify-content-between text-start cursor-pointer px-3 py-2 border-0'
        onClick={() => setIsOpen(!isOpen)}
        style={{minHeight: '42px'}}
      >
        <span className='d-flex align-items-center gap-2 text-truncate'>
          <CalendarIcon size={16} className='text-primary flex-shrink-0' />
          <span className={value ? 'fw-bold text-gray-900 fs-7' : 'text-muted fs-7'}>
            {value || placeholder}
          </span>
        </span>
        <span className='badge badge-light-primary fw-bold fs-9 text-nowrap ms-2'>
          Schedule
        </span>
      </button>

      {/* Calendar Popover */}
      {isOpen && (
        <div
          className='card card-flush shadow-lg border border-gray-200 position-absolute end-0 start-0 mt-1 p-4 rounded-3'
          style={{
            zIndex: 1060,
            width: '320px',
            maxWidth: '100vw',
            backgroundColor: 'var(--bs-body-bg, #ffffff)',
          }}
        >
          {/* Quick Presets Header */}
          <div className='mb-3 pb-2 border-bottom border-gray-200'>
            <span className='fs-8 fw-bolder text-uppercase text-muted d-block mb-1.5 d-flex align-items-center gap-1'>
              <Clock size={12} /> Quick Delivery Presets
            </span>
            <div className='d-flex flex-wrap gap-1'>
              <button
                type='button'
                className='btn btn-xs btn-light-primary py-1 px-2 fw-semibold fs-8'
                onClick={() => applyPreset('today')}
              >
                Today
              </button>
              <button
                type='button'
                className='btn btn-xs btn-light-primary py-1 px-2 fw-semibold fs-8'
                onClick={() => applyPreset('tomorrow')}
              >
                Tomorrow
              </button>
              <button
                type='button'
                className='btn btn-xs btn-light-primary py-1 px-2 fw-semibold fs-8'
                onClick={() => applyPreset('nextMonday')}
              >
                Next Monday
              </button>
              <button
                type='button'
                className='btn btn-xs btn-light-primary py-1 px-2 fw-semibold fs-8'
                onClick={() => applyPreset('firstOfNextMonth')}
              >
                1st of Next Mo.
              </button>
            </div>
          </div>

          {/* Month/Year Navigation */}
          <div className='d-flex align-items-center justify-content-between mb-3 px-1'>
            <span className='fw-bolder fs-7 text-gray-900'>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <div className='d-flex gap-1'>
              <button
                type='button'
                className='btn btn-icon btn-xs btn-light'
                onClick={handlePrevMonth}
                title='Previous Month'
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type='button'
                className='btn btn-icon btn-xs btn-light'
                onClick={handleNextMonth}
                title='Next Month'
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className='d-grid' style={{gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px'}}>
            {DAYS_SHORT.map((day) => (
              <div
                key={day}
                className='text-center fs-8 fw-bold text-muted py-1'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className='d-grid' style={{gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px'}}>
            {/* Empty slots for start day padding */}
            {[...Array(startDayOfWeek)].map((_, i) => (
              <div key={`empty-${i}`} className='py-1' />
            ))}

            {/* Month Days */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1
              const selected = isSelected(day)
              const today = isToday(day)

              return (
                <button
                  key={day}
                  type='button'
                  onClick={() => handleSelectDay(day)}
                  className={`btn btn-sm p-0 d-flex align-items-center justify-content-center rounded-2 fw-bold fs-8 ${
                    selected
                      ? 'btn-primary text-white shadow-xs'
                      : today
                      ? 'btn-light-primary text-primary fw-bolder border border-primary'
                      : 'btn-active-light text-gray-800'
                  }`}
                  style={{height: '32px', width: '100%'}}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer note */}
          <div className='mt-3 pt-2 border-top border-gray-200 d-flex justify-content-between align-items-center'>
            <span className='fs-9 text-muted'>
              Selected: <strong className='text-gray-900'>{value || 'None'}</strong>
            </span>
            <button
              type='button'
              className='btn btn-xs btn-light py-0.5 px-2 fs-8'
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
