import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  archivePublishedArticle,
} from '@/modules/articles/article.service'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function POST(
  _request: Request,
  { params }: Params
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

    const { id } =
      await params

    const article =
      await archivePublishedArticle(
        id,
        user
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
            : 'Failed to archive article',
      },
      {
        status: 400,
      }
    )
  }
}