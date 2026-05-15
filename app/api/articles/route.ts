import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  createDraftArticle,
} from '@/modules/articles/article.service'

import {
  createDraftSchema,
} from '@/modules/articles/article.validators'

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