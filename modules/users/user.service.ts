import {
  createUser,
  findUserByEmail,
} from './user.repository'

import {
  hashPassword,
  verifyPassword,
} from '@/lib/auth/password'

import {
  signAuthToken,
} from '@/lib/auth/jwt'

import type {
  LoginUserInput,
  RegisterUserInput,
} from './user.types'

export async function registerUser(
  input: RegisterUserInput
) {
  const existingUser =
    await findUserByEmail(input.email)

  if (existingUser) {
    throw new Error(
      'An account with this email already exists'
    )
  }

  const passwordHash =
    await hashPassword(input.password)

  const user = await createUser({
    email: input.email,
    passwordHash,
  })

  const token = await signAuthToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  })

  return {
    user,
    token,
  }
}

export async function loginUser(
  input: LoginUserInput
) {
  const user = await findUserByEmail(
    input.email
  )

  if (!user) {
    throw new Error(
      'Invalid email or password'
    )
  }

  const isPasswordValid =
    await verifyPassword(
      input.password,
      user.passwordHash
    )

  if (!isPasswordValid) {
    throw new Error(
      'Invalid email or password'
    )
  }

  const token = await signAuthToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  })

  return {
    user,
    token,
  }
}


import {
  UserRole,
} from '@prisma/client'

import {
  isEditor,
} from '@/modules/auth/auth.permissions'

import {
  listUsers,
  updateUserRole,
} from './user.repository'

export async function getAllUsers(
  user: {
    id: string
    role: string
  }
) {
  if (!isEditor(user)) {
    throw new Error(
      'Only editors can manage users'
    )
  }

  return listUsers()
}

export async function promoteUserToEditor(
  currentUser: {
    id: string
    role: string
  },

  targetUserId: string
) {
}