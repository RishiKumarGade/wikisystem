'use client'

import { useRouter } from 'next/navigation'

type PromoteButtonProps = {
  userId: string
}

export function PromoteButton({
  userId,
}: PromoteButtonProps) {
  const router = useRouter()

  async function handlePromote() {
    const confirmed =
      window.confirm(
        'Promote user to editor?'
      )

    if (!confirmed) {
      return
    }

    const response = await fetch(
      `/api/users/${userId}/promote`,
      {
        method: 'POST',
      }
    )

    if (!response.ok) {
      alert(
        'Failed to promote user'
      )

      return
    }

    router.refresh()
  }

  return (
    <button
      onClick={handlePromote}
      className="rounded-lg border px-3 py-1 text-sm"
    >
      Promote To Editor
    </button>
  )
}