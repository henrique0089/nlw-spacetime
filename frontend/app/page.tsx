import { CopyToClipboardButton } from '@/components/CopyToClipboardButton'
import { DeleteMemoryButton } from '@/components/DeleteMemoryButton'
import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import dayjs from 'dayjs'
import { ArrowRight, Pencil } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value

  const response = await api.get<Memory[]>('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => (
        <div key={memory.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
            </time>

            <CopyToClipboardButton memoryId={memory.id} />
          </div>

          <Image
            src={memory.coverUrl}
            width={592}
            height={280}
            className="aspect-video w-full rounded-lg object-cover"
            alt=""
          />

          <p className="text-lg leading-relaxed text-gray-100">
            {memory.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <Link
              href={`/memories/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-gray-100"
            >
              Ler mais
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center justify-between gap-4">
              <Link
                href={`/memories/update/${memory.id}`}
                className="flex items-center gap-2 text-sm text-gray-200 transition-colors hover:text-gray-100"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>

              <DeleteMemoryButton memoryId={memory.id} token={token} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
