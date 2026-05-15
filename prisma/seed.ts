import bcrypt from 'bcryptjs'
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const existingEditor = await prisma.user.findUnique({
    where: {
      email: 'admin@kb.local',
    },
  })

  if (existingEditor) {
    console.log('Editor account already exists.')
    return
  }

  const passwordHash = await bcrypt.hash('admin123', 10)

  await prisma.user.create({
    data: {
      email: 'admin@kb.local',
      passwordHash,
      role: UserRole.EDITOR,
    },
  })

  console.log('Editor account seeded successfully.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })