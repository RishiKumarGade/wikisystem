import { getCurrentUser } from '@/lib/auth/current-user'
import { promoteUserToEditor } from '@/modules/users/user.service'
import { NextResponse } from 'next/server'

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

    const updatedUser =
      await promoteUserToEditor(
        user,
        id
      )

    return NextResponse.json(
      updatedUser
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to promote user',
      },
      {
        status: 400,
      }
    )
  }
}