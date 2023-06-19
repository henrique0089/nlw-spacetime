'use client'

import { api } from '@/lib/api'
import { XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DeleteMemoryButtonProps {
  memoryId: string
  token: string | undefined
}

export function DeleteMemoryButton({
  memoryId,
  token,
}: DeleteMemoryButtonProps) {
  const router = useRouter()

  async function handleDeleteMemory() {
    await api.delete(`/memories/${memoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    router.refresh()
  }

  return (
    <button
      className="flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-gray-100"
      onClick={handleDeleteMemory}
    >
      <XCircle className="h-4 w-4" />
      Apagar
    </button>
  )
}
