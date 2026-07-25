import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import ProductRow from "@/components/admin/ProductRow";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="admin-page">
      <h1>PRODUCTOS</h1>

      <section className="admin-section">
        <h2>NUEVO PRODUCTO</h2>
        <ProductForm />
      </section>

      <section className="admin-section">
        <h2>CATÁLOGO ({products.length})</h2>
        <div className="admin-product-list">
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description,
                price: Number(product.price),
                stock: product.stock,
                imageUrl: product.imageUrl,
                active: product.active,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
