import {
  UserRole,
} from '@prisma/client'

export function isEditor(
  user: {
    role: string
  }
) {
  return (
    user.role ===
    UserRole.EDITOR
  )
}