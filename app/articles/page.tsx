import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

export default async function ArticlesPage() {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">
        Welcome to WikiSystem
      </h1>

      <p className="mt-2 text-gray-600">
        Logged in as {user.email}
      </p>
    </main>
  )
}