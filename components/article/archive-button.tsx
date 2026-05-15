'use client'

import { useRouter } from 'next/navigation'

type ArchiveButtonProps = {
  articleId: string
}

export function ArchiveButton({
  articleId,
}: ArchiveButtonProps) {
  const router = useRouter()

  async function handleArchive() {
    const confirmed =
      window.confirm(
        'Archive this article?'
      )

    if (!confirmed) {
      return
    }

    await fetch(
      `/api/articles/${articleId}/archive`,
      {
        method: 'POST',
      }
    )

    router.refresh()
  }

  return (
    <button
      onClick={handleArchive}
      className="rounded-lg border border-red-300 px-4 py-2 text-red-600"
    >
      Archive
    </button>
  )
}