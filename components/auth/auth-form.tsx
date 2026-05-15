'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type AuthFormProps = {
  mode: 'login' | 'register'
}

export function AuthForm({
  mode,
}: AuthFormProps) {
  const router = useRouter()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault()

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/auth/${mode}`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      router.push('/articles')
      router.refresh()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold">
        {mode === 'login'
          ? 'Login'
          : 'Create account'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-red-500">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading
            ? 'Please wait...'
            : mode === 'login'
            ? 'Login'
            : 'Create account'}
        </button>
      </form>
    </div>
  )
}