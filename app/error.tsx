'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string
  }

  reset: () => void
}) {
  return (
    <html>
      <body>
        <main className="flex min-h-screen items-center justify-center p-6">
          <div className="max-w-md rounded-xl border bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold">
              Something went wrong
            </h1>

            <p className="mt-3 text-gray-600">
              {error.message}
            </p>

            <button
              onClick={reset}
              className="mt-6 rounded-lg bg-black px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}