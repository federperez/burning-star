import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const productNameBySlug = {
  "core-identity": "CORE IDENTITY",
  broadcast: "BROADCAST",
  "burning-object": "BURNING OBJECT",
} as const;

export default async function FeaturedProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productName = productNameBySlug[slug as keyof typeof productNameBySlug];

  if (!productName) {
    notFound();
  }

  const product = await prisma.product.findFirst({
    where: {
      active: true,
      name: {
        contains: productName,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  if (!product) {
    notFound();
  }

  redirect(`/tienda/${product.id}`);
}
