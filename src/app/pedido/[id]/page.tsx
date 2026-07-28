import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) notFound();

  const order = await prisma.order.findUnique({
    where: { accessToken: id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <main className="cart-page">
      <span className="section-number">ORDER RECEIVED</span>
      <h1>PEDIDO #{order.id.slice(-8).toUpperCase()}</h1>
      <p className="section-summary">
        Recibimos tu pedido. La confirmación y los próximos pasos se enviarán a{" "}
        <strong>{order.customerEmail}</strong>.
      </p>

      <div className="cart-list">
        {order.items.map((item) => (
          <div key={item.id} className="cart-row">
            <div className="cart-row-info">
              <h3>{item.productName ?? item.product?.name ?? "PRODUCTO BURNING STAR"}</h3>
              <span>${Number(item.unitPrice).toLocaleString("es-AR")}</span>
            </div>
            <span>× {item.quantity}</span>
            <span className="cart-row-subtotal">
              ${(Number(item.unitPrice) * item.quantity).toLocaleString("es-AR")}
            </span>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>TOTAL</span>
        <span className="cart-total">${Number(order.total).toLocaleString("es-AR")}</span>
      </div>

      <section className="order-delivery">
        <span className="section-number">DELIVERY FILE</span>
        <h2>ENTREGA</h2>
        <dl>
          <div>
            <dt>RECIBE</dt>
            <dd>{order.customerName}</dd>
          </div>
          <div>
            <dt>TELÉFONO</dt>
            <dd>{order.customerPhone}</dd>
          </div>
          <div>
            <dt>DIRECCIÓN</dt>
            <dd>
              {order.shippingAddress}
              {order.apartment ? `, ${order.apartment}` : ""}
            </dd>
          </div>
          <div>
            <dt>LOCALIDAD</dt>
            <dd>
              {order.city}, {order.province} ({order.postalCode})
            </dd>
          </div>
        </dl>
      </section>

      <Link className="primary-button" href="/tienda">
        SEGUIR EXPLORANDO <span>↘</span>
      </Link>
    </main>
  );
}
