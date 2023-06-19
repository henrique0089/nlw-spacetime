import { CalendarDays } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

interface DateSelectorProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function DateSelector({ ...rest }: DateSelectorProps) {
  return (
    <button
      className="flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-gray-100"
      {...rest}
    >
      <CalendarDays className="h-4 w-4" />
      19/06/2023
    </button>
  )
}
