import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product || !product.active) {
    notFound();
  }

  return (
    <main className="product-page">
      <div className="product-visual">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <span className="shop-card-placeholder">BS®</span>
        )}
      </div>
      <div className="product-info">
        <span className="section-number">BS® / FILE</span>
        <h1>{product.name}</h1>
        <p className="product-price">
          ${Number(product.price).toLocaleString("es-AR")}
        </p>
        <p className="product-description">{product.description}</p>
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
          }}
          inStock={product.stock > 0}
        />
      </div>
    </main>
  );
}
