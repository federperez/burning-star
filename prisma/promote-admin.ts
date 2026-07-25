import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const email = process.argv[2];
if (!email) {
  console.error("Uso: npx tsx prisma/promote-admin.ts <email>");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
  console.log(`OK: ${user.email} ahora es ADMIN`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
