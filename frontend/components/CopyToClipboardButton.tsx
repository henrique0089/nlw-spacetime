'use client'

import { Copy, CopyCheck } from 'lucide-react'
import { useState } from 'react'

interface ClipboardButtonProps {
  memoryId: string
}

export function CopyToClipboardButton({ memoryId }: ClipboardButtonProps) {
  const [copied, setCopied] = useState(false)

  function copyUrlToClipboard() {
    const baseUrl = window.location.protocol + '//' + window.location.host
    const finalClipboardUrl = `${baseUrl}/memories/${memoryId}`

    setCopied(true)

    navigator.clipboard.writeText(finalClipboardUrl)

    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <button
      className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
      onClick={copyUrlToClipboard}
    >
      {copied ? (
        <>
          <CopyCheck className="h-4 w-4" />
          Copiado
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copiar para área de transferência
        </>
      )}
    </button>
  )
}
