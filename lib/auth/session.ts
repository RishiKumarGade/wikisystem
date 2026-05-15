import { cookies } from 'next/headers'

import {
  AUTH_COOKIE_NAME,
} from './auth.constants'

import {
  verifyAuthToken,
} from './jwt'

export async function getSession() {
  const cookieStore = await cookies()

  const token = cookieStore.get(
    AUTH_COOKIE_NAME
  )?.value

  if (!token) {
    return null
  }

  try {
    return await verifyAuthToken(token)
  } catch {
    return null
  }
}