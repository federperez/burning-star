import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

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
        <ProductGallery
          images={product.imageUrl ? [product.imageUrl] : []}
          productName={product.name}
        />
      </div>
      <div className="product-info">
        <Link className="product-back" href="/tienda">
          ← VOLVER AL ARCHIVE
        </Link>
        <div className="product-file-meta">
          <span className="section-number">BS® / PRODUCT FILE</span>
          <span className={`product-stock${product.stock === 0 ? " is-empty" : ""}`}>
            <i />
            {product.stock > 0 ? `${product.stock} EN STOCK` : "SIN STOCK"}
          </span>
        </div>
        <h1>{product.name}</h1>
        <span className="product-price-label">PRECIO / ARS</span>
        <p className="product-price">
          ${Number(product.price).toLocaleString("es-AR")}
        </p>
        <div className="product-description">
          <span>CARACTERÍSTICAS / DESCRIPTION</span>
          <p>{product.description}</p>
        </div>
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
          }}
          stock={product.stock}
        />
        <div className="product-service-data" aria-label="Información de compra">
          <span>
            <b>01</b>
            CARRITO PERSISTENTE
          </span>
          <span>
            <b>02</b>
            STOCK VERIFICADO
          </span>
          <span>
            <b>03</b>
            COMPRA SEGURA
          </span>
        </div>
      </div>
    </main>
  );
}
