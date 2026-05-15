export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

        <p className="mt-4 text-gray-600">
          Loading...
        </p>
      </div>
    </main>
  )
}