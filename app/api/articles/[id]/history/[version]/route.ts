import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/auth/current-user'

import {
  getVersionDiff,
} from '@/modules/versions/version.service'

type Params = {
  params: Promise<{
    id: string
    version: string
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

    const {
      id,
      version,
    } = await params

    const data =
      await getVersionDiff(
        id,
        Number(version),
        user
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
            : 'Failed to load version',
      },
      {
        status: 400,
      }
    )
  }
}