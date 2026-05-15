import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  createDraftArticle,
  listPublishedArticles,
} from '@/modules/articles/article.service'

import {
  createDraftSchema,
} from '@/modules/articles/article.validators'
import { ArticleCategory } from '@prisma/client'

export async function POST(
  request: Request
) {
  try {
    const user =
      await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        {
          error:
            'Unauthorized',
        },
        {
          status: 401,
        }
      )
    }

    const body =
      await request.json()

    const validatedData =
      createDraftSchema.parse(
        body
      )

    const article =
      await createDraftArticle(
        user.id,
        validatedData
      )

    return NextResponse.json(
      article
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create article',
      },
      {
        status: 400,
      }
    )
  }
}


export async function GET(
  request: Request
) {
  try {
    const url = new URL(
      request.url
    )

    const search =
      url.searchParams.get(
        'search'
      ) ?? undefined

    const category =
      url.searchParams.get(
        'category'
      ) as ArticleCategory | null

    const page = Number(
      url.searchParams.get(
        'page'
      ) ?? '1'
    )

    const data =
      await listPublishedArticles(
        {
          search,

          category:
            category ??
            undefined,

          page,
        }
      )

    return NextResponse.json(
      data
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load articles',
      },
      {
        status: 400,
      }
    )
  }
}