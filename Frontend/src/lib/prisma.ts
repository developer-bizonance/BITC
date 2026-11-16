import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let prismaInstance: PrismaClient | null = null;

function createDummyProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_target, prop) {
      if (prop === "then" || prop === "$$typeof" || prop === "toJSON") return undefined;
      return new Proxy(() => {}, {
        get(_t, subProp) {
          if (subProp === "then" || subProp === "$$typeof" || subProp === "toJSON") return undefined;
          return () => Promise.reject(new Error("DATABASE_URL is not configured in frontend. Delegate to backend API."));
        },
        apply() {
          return Promise.reject(new Error("DATABASE_URL is not configured in frontend. Delegate to backend API."));
        },
      });
    },
  });
}

function getPrismaClient(): PrismaClient {
  if (prismaInstance) return prismaInstance;

  const rawConnectionString = process.env.DATABASE_URL;
  if (!rawConnectionString) {
    return createDummyProxy();
  }

  // Prevent pg-connection-string v3/v9 security alias warning in development
  const connectionString = rawConnectionString.replace(/sslmode=(?:require|prefer|verify-ca)(?=&|$)/g, "sslmode=verify-full");

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    prismaInstance = new PrismaClient({ adapter });
    return prismaInstance;
  } catch {
    return createDummyProxy();
  }
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const val = (client as any)[prop];
    if (typeof val === "function") {
      return val.bind(client);
    }
    return val;
  },
});

export default prisma;
