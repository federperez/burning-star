import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { featuredProducts, type StorefrontProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  let products: StorefrontProduct[] = featuredProducts;

  if (process.env.DATABASE_URL) {
    try {
      const databaseProducts = await prisma.product.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
      });

      if (databaseProducts.length > 0) {
        products = databaseProducts.map((product) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          stock: product.stock,
          imageUrl: product.imageUrl,
        }));
      }
    } catch {
      products = featuredProducts;
    }
  }

  return (
    <main className="shop-page">
      <div className="shop-intro">
        <span className="section-number">ARCHIVE / SHOP</span>
        <h1>
          THE
          <br />
          <em>ARCHIVE.</em>
        </h1>
        <p className="section-summary">
          Piezas de la identidad Burning Star, disponibles para llevar.
        </p>
      </div>

      {products.length === 0 ? (
        <p className="shop-empty">NO HAY PRODUCTOS DISPONIBLES POR AHORA.</p>
      ) : (
        <div className="shop-grid">
          {products.map((product) => (
            <Link key={product.id} href={`/tienda/${product.id}`} className="shop-card">
              <div className="shop-card-visual">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.imageUrl} alt={product.name} />
                ) : (
                  <span className="shop-card-placeholder">BS®</span>
                )}
              </div>
              <div className="shop-card-info">
                <h3>{product.name}</h3>
                <span className="shop-card-price">
                  ${product.price.toLocaleString("es-AR")}
                </span>
                {product.stock === 0 && (
                  <span className="shop-card-soldout">SIN STOCK</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
