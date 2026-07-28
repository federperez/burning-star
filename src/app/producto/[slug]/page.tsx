import { notFound, redirect } from "next/navigation";
import { getFeaturedProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function FeaturedProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getFeaturedProduct(slug);

  if (!product) {
    notFound();
  }

  redirect(`/tienda/${slug}`);
}
