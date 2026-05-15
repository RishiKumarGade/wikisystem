import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  getVersionHistory,
} from '@/modules/versions/version.service'

type Params = {
  params: Promise<{
    id: string
  }>
}

export default async function HistoryPage({
  params,
}: Params) {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const { id } =
    await params

  let versions

  try {
    versions =
      await getVersionHistory(
        id,
        user
      )
  } catch {
    notFound()
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Version History
        </h1>
      </div>

      <div className="space-y-4">
        {versions.map(
          (version) => (
            <Link
              key={version.id}
              href={`/articles/${id}/history/${version.versionNumber}`}
              className="block rounded-xl border p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    Version{' '}
                    {
                      version.versionNumber
                    }
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Edited by{' '}
                    {
                      version
                        .editedBy
                        .email
                    }
                  </p>
                </div>

                <p className="text-sm text-gray-500">
                  {new Date(
                    version.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            </Link>
          )
        )}
      </div>
    </main>
  )
}