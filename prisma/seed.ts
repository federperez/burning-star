import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "CORE IDENTITY TEE",
        description:
          "Remera negra con el emblema Burning Star estampado. Algodón peinado 24/1, corte oversize.",
        price: 24999,
        stock: 15,
        imageUrl: "/assets/burning-star-emblem.svg",
      },
      {
        name: "BROADCAST CAP",
        description:
          "Gorra con el wordmark oficial bordado. Ajuste trasero, visera curva.",
        price: 18999,
        stock: 8,
        imageUrl: "/assets/burning-star-banner.jpg",
      },
      {
        name: "BURNING OBJECT HOODIE",
        description:
          "Buzo canguro rojo quemado con el sistema de identidad Burning Star. Frisa pesada 380g.",
        price: 42999,
        stock: 0,
        imageUrl: null,
      },
    ],
  });

  console.log("Seed OK");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
