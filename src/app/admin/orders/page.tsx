import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: { include: { product: true } } },
  });

  return (
    <div className="admin-page">
      <h1>PEDIDOS</h1>

      {orders.length === 0 ? (
        <p className="shop-empty">TODAVÍA NO HAY PEDIDOS.</p>
      ) : (
        <div className="admin-order-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-order-row">
              <div className="admin-order-head">
                <span>{order.user.email}</span>
                <span className={`admin-order-status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
                <span>${Number(order.total).toLocaleString("es-AR")}</span>
                <span>{order.createdAt.toLocaleString("es-AR")}</span>
              </div>
              <ul className="admin-order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.quantity}× {item.product.name} — $
                    {Number(item.unitPrice).toLocaleString("es-AR")}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
