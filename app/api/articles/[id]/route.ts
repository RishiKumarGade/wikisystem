import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  deleteDraftArticle,
  getArticleById,
  updateDraftArticle,
} from '@/modules/articles/article.service'

import {
  updateDraftSchema,
} from '@/modules/articles/article.validators'

type Params = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
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
      await getArticleById(
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
            : 'Failed to load article',
      },
      {
        status: 400,
      }
    )
  }
}


export async function PUT(
  request: Request,
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

    const body =
      await request.json()

    const validatedData =
      updateDraftSchema.parse(
        body
      )

    const { id } =
      await params

    const article =
      await updateDraftArticle(
        id,
        user,
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
            : 'Failed to update article',
      },
      {
        status: 400,
      }
    )
  }
}

export async function DELETE(
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

    await deleteDraftArticle(
      id,
      user
    )

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete article',
      },
      {
        status: 400,
      }
    )
  }
}