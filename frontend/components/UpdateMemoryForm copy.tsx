'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import Cookie from 'js-cookie'

import { MediaPicker } from './MediaPicker'

import { api } from '@/lib/api'
import { MemoryData } from '@/types/MemoryData'

interface UpdateMemoryFormProps {
  memory: MemoryData
}

export function UpdateMemoryForm({ memory }: UpdateMemoryFormProps) {
  const router = useRouter()

  async function handleUpdateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload) {
      const uploadFormData = new FormData()

      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.fileUrl
    }

    const token = Cookie.get('token')

    await api.put(
      `/memories/${memory.id}`,
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/')
  }

  return (
    <form onSubmit={handleUpdateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            defaultChecked={memory.isPublic}
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 transition-all"
          />
          Tornar mémoria pública
        </label>
      </div>

      <MediaPicker defaultPreviewUrl={memory.coverUrl} />

      <textarea
        name="content"
        id=""
        defaultValue={memory.content}
        className="bg w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, videos e relatos sobre essa experiência que você quer lembrar para sempre"
      ></textarea>

      <button
        type="submit"
        className="self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-green-600"
      >
        Atualizar
      </button>
    </form>
  )
}
