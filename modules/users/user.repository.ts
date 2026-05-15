import { prisma } from '@/lib/db/prisma'

export async function findUserByEmail(
  email: string
) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  })
}

export async function findUserById(
  id: string
) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  })
}

export async function createUser(data: {
  email: string
  passwordHash: string
}) {
  return prisma.user.create({
    data,
  })
}


import {
  UserRole,
} from '@prisma/client'

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },

    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })
}
export async function updateUserRole(
  userId: string,
  role: UserRole
) {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      role,
    },

    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
    },
  })
}