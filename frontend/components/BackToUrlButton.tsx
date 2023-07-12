import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

interface BackToUrlButtonProps {
  url?: string
}

export function BackToUrlButton({ url = '/' }: BackToUrlButtonProps) {
  return (
    <Link
      href={url}
      className="flex w-max items-center gap-1 text-sm text-gray-200 transition-colors hover:text-gray-100"
    >
      <ChevronLeft className="h-4 w-4" />
      voltar à timeline
    </Link>
  )
}
