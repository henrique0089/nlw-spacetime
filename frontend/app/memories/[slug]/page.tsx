import { BackToUrlButton } from '@/components/BackToUrlButton'
import { CopyToClipboardButton } from '@/components/CopyToClipboardButton'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import { cookies } from 'next/headers'
import Image from 'next/image'

interface MemoryProps {
  params: {
    slug: string
  }
}

interface MemoryData {
  coverUrl: string
  content: string
  createdAt: string
}

export default async function Memory({ params }: MemoryProps) {
  const token = cookies().get('token')?.value

  const response = await api.get<MemoryData>(`/memories/${params.slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory = response.data

  return (
    <div className="flex flex-col gap-10 p-8">
      <BackToUrlButton />

      <div className="flex items-center justify-between">
        <time className="flex items-center gap-2 text-sm text-gray-100">
          {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
        </time>

        <CopyToClipboardButton memoryId={params.slug} />
      </div>

      <Image
        src={memory.coverUrl}
        width={592}
        height={280}
        className="aspect-video w-full rounded-lg object-cover"
        alt=""
      />

      <p className="text-lg leading-relaxed text-gray-100">{memory.content}</p>
    </div>
  )
}
