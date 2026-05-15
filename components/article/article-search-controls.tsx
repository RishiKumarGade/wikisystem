'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  ArticleCategory,
} from '@prisma/client'

export function ArticleSearchControls() {
  const router = useRouter()

  const searchParams =
    useSearchParams()

  function updateParam(
    key: string,
    value: string
  ) {
    const params =
      new URLSearchParams(
        searchParams
      )

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    params.delete('page')

    router.push(
      `/articles?${params.toString()}`
    )
  }

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      <input
        defaultValue={
          searchParams.get(
            'search'
          ) ?? ''
        }
        placeholder="Search articles..."
        onChange={(event) =>
          updateParam(
            'search',
            event.target.value
          )
        }
        className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2"
      />

      <select
        defaultValue={
          searchParams.get(
            'category'
          ) ?? ''
        }
        onChange={(event) =>
          updateParam(
            'category',
            event.target.value
          )
        }
        className="rounded-lg border px-4 py-2 outline-none focus:ring-2"
      >
        <option value="">
          All Categories
        </option>

        {Object.values(
          ArticleCategory
        ).map((category) => (
          <option
            key={category}
            value={category}
          >
            {category}
          </option>
        ))}
      </select>
    </div>
  )
}