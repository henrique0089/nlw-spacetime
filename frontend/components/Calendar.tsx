'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

dayjs.locale(ptBr)

interface Day {
  date: dayjs.Dayjs
  disabled: boolean
}

interface CalendarWeek {
  week: number
  days: Day[]
}

type CalendarWeeks = CalendarWeek[]

export function Calendar() {
  const [now, setNow] = useState(() => {
    return dayjs().set('date', 1)
  })

  function handlePreviousMonth() {
    const previousMonthDate = now.subtract(1, 'month')

    setNow(previousMonthDate)
  }

  function handleNextMonth() {
    const nextMonthDate = now.add(1, 'month')

    setNow(nextMonthDate)
  }

  const currentMonth = now.format('MMMM')
  const currentYear = now.format('YYYY')

  const calendarWeeks = useMemo(() => {
    const daysInCurrentMonth = Array.from({ length: now.daysInMonth() }).map(
      (_, i) => {
        return now.set('date', i + 1)
      },
    )

    const firstWeekDay = now.get('day')

    const previousRemainingMonthDays = Array.from({ length: firstWeekDay })
      .map((_, i) => {
        return now.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = now.set('date', now.daysInMonth())
    const lastWeekDay = lastDayInCurrentMonth.get('day')

    const nextMothDays = Array.from({ length: 7 - (lastWeekDay + 1) }).map(
      (_, i) => {
        return lastDayInCurrentMonth.add(i + 1, 'day')
      },
    )

    const calendarDays = [
      ...previousRemainingMonthDays.map((date) => {
        return {
          date,
          disabled: true,
        }
      }),
      ...daysInCurrentMonth.map((date) => {
        return {
          date,
          disabled: false,
        }
      }),
      ...nextMothDays.map((date) => {
        return {
          date,
          disabled: true,
        }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }, [now])

  return (
    <div className="absolute top-8 flex w-72 flex-col gap-2 rounded-md border-2 border-gray-800 bg-gray-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium capitalize text-gray-200">
          {currentMonth}, {currentYear}
        </h3>

        <div className="flex items-center gap-2">
          <button
            className="text-gray-200 transition-colors hover:text-gray-100"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft />
          </button>

          <button
            className="text-gray-200 transition-colors hover:text-gray-100"
            onClick={handleNextMonth}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <table className="w-full table-fixed border-spacing-1	">
        <thead>
          <tr>
            <th className="text-base font-medium text-gray-200">D</th>
            <th className="text-base font-medium text-gray-200">S</th>
            <th className="text-base font-medium text-gray-200">T</th>
            <th className="text-base font-medium text-gray-200">Q</th>
            <th className="text-base font-medium text-gray-200">Q</th>
            <th className="text-base font-medium text-gray-200">S</th>
            <th className="text-base font-medium text-gray-200">S</th>
          </tr>
        </thead>
        <tbody className="before-tbody">
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td className="box-border" key={date.toString()}>
                  <button
                    disabled={disabled}
                    className={`aspect-square w-full text-center font-bold text-gray-100 hover:text-gray-200 disabled:text-gray-300 ${
                      date.get('date') === new Date().getDate() &&
                      'rounded-full bg-gray-700'
                    }`}
                  >
                    {date.get('date')}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
