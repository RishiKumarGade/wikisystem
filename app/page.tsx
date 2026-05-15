import Link from 'next/link'

import { getCurrentUser } from '@/lib/auth/current-user'

export default async function HomePage() {
  const user =
    await getCurrentUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          WikiSystem
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Collaborative knowledge management with immutable version history,
          publishing workflows, and full article tracking.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          {user ? (
            <Link
              href="/articles"
              className="rounded-lg bg-black px-5 py-3 text-white"
            >
              Open Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-black px-5 py-3 text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg border px-5 py-3"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  )
}