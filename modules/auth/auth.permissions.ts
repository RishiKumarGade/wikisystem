import {
  UserRole,
} from '@prisma/client'

export function isEditor(
  user: {
    role: UserRole
  }
) {
  return (
    user.role ===
    UserRole.EDITOR
  )
}