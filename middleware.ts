import { NextRequest, NextResponse } from 'next/server'

import { jwtVerify } from 'jose'

import {
  AUTH_COOKIE_NAME,
} from '@/lib/auth/auth.constants'

const secretKey = process.env.JWT_SECRET

if (!secretKey) {
  throw new Error('JWT_SECRET is missing')
}

const encodedKey = new TextEncoder().encode(
  secretKey
)

async function verifyToken(token: string) {
  try {
    await jwtVerify(token, encodedKey)
    return true
  } catch {
    return false
  }
}

export async function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get(
      AUTH_COOKIE_NAME
    )?.value

  const pathname =
    request.nextUrl.pathname

  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')

  const isProtectedRoute =
    pathname.startsWith('/articles') ||
    pathname.startsWith('/api/articles')

  const isAuthenticated =
    token
      ? await verifyToken(token)
      : false

  if (
    isProtectedRoute &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  if (
    isAuthRoute &&
    isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL('/articles', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/articles/:path*',
    '/api/articles/:path*',
    '/login',
    '/register',
  ],
}