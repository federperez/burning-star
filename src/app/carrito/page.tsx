"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, setQuantity, total, clear } = useCart();
  const { status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setError(null);

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "No se pudo iniciar la compra.");
      return;
    }

    clear();
    router.push(`/pedido/${data.order.id}`);
  };

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <span className="section-number">03 / CART</span>
        <h1>TU CARRITO</h1>
        <p className="shop-empty">ESTÁ VACÍO POR AHORA.</p>
        <Link className="primary-button" href="/tienda">
          IR A LA TIENDA <span>↘</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <span className="section-number">03 / CART</span>
      <h1>TU CARRITO</h1>

      {error && <p className="auth-error">{error}</p>}

      <div className="cart-list">
        {items.map((item) => (
          <div key={item.productId} className="cart-row">
            <Link
              className={`cart-row-visual${item.imageUrl ? "" : " is-placeholder"}`}
              href={`/tienda/${item.productId}`}
              aria-label={`Ver ${item.name}`}
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" aria-hidden="true" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/assets/burning-star-emblem.svg"
                  alt=""
                  aria-hidden="true"
                />
              )}
            </Link>
            <div className="cart-row-info">
              <h3>
                <Link href={`/tienda/${item.productId}`}>{item.name}</Link>
              </h3>
              <span>${item.price.toLocaleString("es-AR")}</span>
            </div>
            <div className="cart-row-qty">
              <button
                type="button"
                aria-label={`Disminuir cantidad de ${item.name}`}
                onClick={() => setQuantity(item.productId, item.quantity - 1)}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                aria-label={`Aumentar cantidad de ${item.name}`}
                disabled={item.quantity >= item.stock}
                onClick={() => setQuantity(item.productId, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <span className="cart-row-subtotal">
              ${(item.price * item.quantity).toLocaleString("es-AR")}
            </span>
            <button
              className="admin-link-button"
              type="button"
              onClick={() => removeItem(item.productId)}
            >
              QUITAR
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <span>TOTAL</span>
        <span className="cart-total">${total.toLocaleString("es-AR")}</span>
      </div>

      <button className="auth-submit" type="button" onClick={handleCheckout} disabled={loading}>
        {loading ? "PROCESANDO..." : "INICIAR COMPRA ↗"}
      </button>
    </main>
  );
}
