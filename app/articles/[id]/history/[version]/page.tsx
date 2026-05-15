import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  getVersionDiff,
} from '@/modules/versions/version.service'

type Params = {
  params: Promise<{
    id: string
    version: string
  }>
}

export default async function VersionPage({
  params,
}: Params) {
  const user =
    await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const {
    id,
    version,
  } = await params

  let data

  try {
    data =
      await getVersionDiff(
        id,
        Number(version),
        user
      )
  } catch {
    notFound()
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Version{' '}
            {
              data.version
                .versionNumber
            }
          </h1>

          <p className="mt-2 text-gray-600">
            Edited by{' '}
            {
              data.version
                .editedBy
                .email
            }
          </p>
        </div>

        <Link
          href={`/articles/${id}/history`}
          className="rounded-lg border px-4 py-2"
        >
          Back To History
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white p-6">
        <pre className="whitespace-pre-wrap text-sm">
          {data.diff.map(
            (
              part,
              index
            ) => (
              <span
                key={index}
                className={
                  part.added
                    ? 'bg-green-100'
                    : part.removed
                    ? 'bg-red-100 line-through'
                    : ''
                }
              >
                {part.value}
              </span>
            )
          )}
        </pre>
      </div>
    </main>
  )
}