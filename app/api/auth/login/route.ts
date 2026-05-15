import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import {
  AUTH_COOKIE_NAME,
} from '@/lib/auth/auth.constants'

import {
  loginUser,
} from '@/modules/users/user.service'

import {
  loginUserSchema,
} from '@/modules/users/user.validators'

export async function POST(
  request: Request
) {
  try {
    const body = await request.json()

    const validatedData =
      loginUserSchema.parse(body)

    const { token } =
      await loginUser(validatedData)

    const cookieStore =
      await cookies()

    cookieStore.set(
      AUTH_COOKIE_NAME,
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          'production',
        sameSite: 'lax',
        path: '/',
      }
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
            : 'Login failed',
      },
      {
        status: 400,
      }
    )
  }
}