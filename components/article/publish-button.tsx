'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type PublishButtonProps = {
  articleId: string
}

export function PublishButton({
  articleId,
}: PublishButtonProps) {
  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  async function handlePublish() {
    setLoading(true)

    try {
      const response = await fetch(
        `/api/articles/${articleId}/publish`,
        {
          method: 'POST',
        }
      )

      if (!response.ok) {
        throw new Error(
          'Failed to publish'
        )
      }

      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePublish}
      disabled={loading}
      className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
    >
      {loading
        ? 'Publishing...'
        : 'Publish'}
    </button>
  )
}