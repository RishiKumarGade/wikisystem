'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch(
      '/api/auth/logout',
      {
        method: 'POST',
      }
    )

    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border px-3 py-1 text-sm"
    >
      Logout
    </button>
  )
}