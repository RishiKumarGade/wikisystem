import Link from 'next/link'

type PaginationControlsProps = {
  page: number
  totalPages: number

  searchParams: Record<
    string,
    string | undefined
  >
}

export function PaginationControls({
  page,
  totalPages,
  searchParams,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null
  }

  function buildPageUrl(
    nextPage: number
  ) {
    const params =
      new URLSearchParams()

    Object.entries(
      searchParams
    ).forEach(
      ([key, value]) => {
        if (value) {
          params.set(
            key,
            value
          )
        }
      }
    )

    params.set(
      'page',
      String(nextPage)
    )

    return `/articles?${params.toString()}`
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      {page > 1 ? (
        <Link
          href={buildPageUrl(
            page - 1
          )}
          className="rounded-lg border px-4 py-2"
        >
          Previous
        </Link>
      ) : null}

      <span className="text-sm text-gray-600">
        Page {page} of{' '}
        {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={buildPageUrl(
            page + 1
          )}
          className="rounded-lg border px-4 py-2"
        >
          Next
        </Link>
      ) : null}
    </div>
  )
}