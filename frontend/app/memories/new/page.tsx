import { BackToUrlButton } from '@/components/BackToUrlButton'
import { NewMemoryForm } from '@/components/NewMemoryForm'

export default function newMemories() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <BackToUrlButton />

      <NewMemoryForm />
    </div>
  )
}
