import { SignJWT, jwtVerify } from 'jose'

import {
  AUTH_TOKEN_EXPIRATION,
} from './auth.constants'

const secretKey = process.env.JWT_SECRET

if (!secretKey) {
  throw new Error('JWT_SECRET is missing')
}

const encodedKey = new TextEncoder().encode(secretKey)

export type AuthTokenPayload = {
  userId: string
  role: string
  email: string
}

export async function signAuthToken(
  payload: AuthTokenPayload
) {
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime(AUTH_TOKEN_EXPIRATION)
    .sign(encodedKey)
}

export async function verifyAuthToken(token: string) {
  const { payload } = await jwtVerify(
    token,
    encodedKey
  )

  return payload as AuthTokenPayload
}