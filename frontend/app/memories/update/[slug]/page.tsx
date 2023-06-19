import { BackToUrlButton } from '@/components/BackToUrlButton'
import { UpdateMemoryForm } from '@/components/UpdateMemoryForm copy'
import { api } from '@/lib/api'
import { MemoryData } from '@/types/MemoryData'
import { cookies } from 'next/headers'

interface UpdateMemoryFormProps {
  params: {
    slug: string
  }
}

export default async function UpdateMemory({ params }: UpdateMemoryFormProps) {
  const token = cookies().get('token')?.value

  const response = await api.get<MemoryData>(`/memories/${params.slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory = response.data

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <BackToUrlButton />

      <UpdateMemoryForm memory={memory} />
    </div>
  )
}
