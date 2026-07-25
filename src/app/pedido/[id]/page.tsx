import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") notFound();

  return (
    <main className="cart-page">
      <span className="section-number">ORDER RECEIVED</span>
      <h1>PEDIDO #{order.id.slice(-8).toUpperCase()}</h1>
      <p className="section-summary">
        Estado: <strong>{order.status}</strong>
      </p>

      <div className="cart-list">
        {order.items.map((item) => (
          <div key={item.id} className="cart-row">
            <div className="cart-row-info">
              <h3>{item.product.name}</h3>
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

      <Link className="primary-button" href="/tienda">
        SEGUIR EXPLORANDO <span>↘</span>
      </Link>
    </main>
  );
}
