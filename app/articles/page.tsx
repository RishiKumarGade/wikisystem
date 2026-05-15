import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

export default async function ArticlesPage() {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            WikiSystem
          </h1>

          <p className="mt-2 text-gray-600">
            Welcome back, {user.email}
          </p>
        </div>

        <Link
          href="/articles/new"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          New Draft
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-8">
        <p className="text-gray-600">
          Article listing will be implemented next.
        </p>
      </div>
    </main>
  )
}