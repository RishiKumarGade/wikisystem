'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  ArticleCategory,
} from '@prisma/client'

type ArticleFormProps = {
  mode: 'create' | 'edit'

  articleId?: string

  initialValues?: {
    currentVersion: number
    title: string
    body: string
    category: ArticleCategory
  }
}

export function ArticleForm({
  mode,
  articleId,
  initialValues,
}: ArticleFormProps) {
  const router = useRouter()

  const [title, setTitle] =
    useState(
      initialValues?.title ?? ''
    )

  const [body, setBody] =
    useState(
      initialValues?.body ?? ''
    )

    const [currentVersion] =
  useState(
    initialValues?.currentVersion ??
      0
  )
  const [category, setCategory] =
    useState<ArticleCategory>(
      initialValues?.category ??
        ArticleCategory.GENERAL
    )

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
        mode === 'create'
          ? '/api/articles'
          : `/api/articles/${articleId}`,
        {
          method:
            mode === 'create'
              ? 'POST'
              : 'PUT',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            title,
            body,
            category,
            currentVersion
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      router.push(
        `/articles/${data.id}`
      )

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
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Title
        </label>

        <input
          value={title}
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
          className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
          placeholder="Enter article title"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Category
        </label>

        <select
          value={category}
          onChange={(event) =>
            setCategory(
              event.target
                .value as ArticleCategory
            )
          }
          className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
        >
          {Object.values(
            ArticleCategory
          ).map((value) => (
            <option
              key={value}
              value={value}
            >
              {value}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Body
        </label>

        <textarea
          value={body}
          onChange={(event) =>
            setBody(
              event.target.value
            )
          }
          rows={14}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
          placeholder="Write article content..."
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
        className="rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {loading
          ? 'Saving...'
          : mode === 'create'
          ? 'Create Draft'
          : 'Save Changes'}
      </button>
    </form>
  )
}