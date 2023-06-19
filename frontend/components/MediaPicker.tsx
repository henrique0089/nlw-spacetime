'use client'

import { ChangeEvent, useState } from 'react'

interface MediaPickerProps {
  defaultPreviewUrl?: string | null
}

export function MediaPicker({ defaultPreviewUrl = null }: MediaPickerProps) {
  const [preview, setPreview] = useState<string | null>(defaultPreviewUrl)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewUrl = URL.createObjectURL(files[0])

    setPreview(previewUrl)
  }

  return (
    <div>
      <input
        name="coverUrl"
        type="file"
        hidden
        id="media"
        onChange={onFileSelected}
      />

      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </div>
  )
}
