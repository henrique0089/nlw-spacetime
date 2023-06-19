import Link from 'next/link'

export function EmptyMemories() {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <p className="w-[360px] text-center leading-relaxed">
        Você ainda não registrou nenhuma lembrança, comecei a{' '}
        <Link
          href="/memories/new"
          className="hover:text-gray-50 hover:underline"
        >
          criar agora
        </Link>
        !
      </p>
    </div>
  )
}
