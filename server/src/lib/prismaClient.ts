import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

console.log("DATABASE_URL present:", !!connectionString);
console.log("NODE_ENV:", process.env.NODE_ENV);

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}