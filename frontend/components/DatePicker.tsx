'use client'

import { useState } from 'react'

import { DateSelector } from './DateSelector'
import { Calendar } from './Calendar'

export function DatePicker() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  function showStartDateCalendar() {
    setIsCalendarOpen(!isCalendarOpen)
  }

  return (
    <div className="flex items-center gap-4">
      <h3 className="text-gray-200">Escolha uma data</h3>

      <div className="relative">
        <DateSelector onClick={showStartDateCalendar} />

        {isCalendarOpen && <Calendar />}
      </div>
    </div>
  )
}
