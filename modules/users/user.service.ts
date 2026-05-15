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
    role: UserRole
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
    role: UserRole
  },

  targetUserId: string
) {
  if (!isEditor(currentUser)) {
    throw new Error(
      'Only editors can promote users'
    )
  }

  return updateUserRole(
    targetUserId,
    UserRole.EDITOR
  )
}