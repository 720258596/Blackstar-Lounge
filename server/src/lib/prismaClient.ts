import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

console.log("DATABASE_URL present:", !!connectionString);
console.log("NODE_ENV:", process.env.NODE_ENV);

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment");
}

// Ensure an explicit SSL mode is present to avoid pg connection-string warnings
// Prefer `verify-full` for the current behavior; admins can override via DATABASE_URL
let secureConnectionString = connectionString;
if (!/sslmode=/i.test(connectionString)) {
  const sep = connectionString.includes("?") ? "&" : "?";
  secureConnectionString = `${connectionString}${sep}sslmode=verify-full`;
}

// Log a masked connection string for debugging (do not expose credentials)
const masked = secureConnectionString.replace(/(postgres(?:ql)?:\/\/)([^:@\/]+)(:[^@\/]+)?@/, "$1****:****@");
console.log("Using DATABASE_URL:", masked);

const adapter = new PrismaPg({ connectionString: secureConnectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}