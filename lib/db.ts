// import { PrismaClient } from '@prisma/client' // Not used in production
type PrismaClient = any

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? ({} as any) // PrismaClient not available

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
