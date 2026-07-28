"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeItem, setQuantity, total, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        customer: {
          email: formData.get("email"),
          name: formData.get("name"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          apartment: formData.get("apartment"),
          city: formData.get("city"),
          province: formData.get("province"),
          postalCode: formData.get("postalCode"),
          notes: formData.get("notes"),
        },
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "No se pudo iniciar la compra.");
      return;
    }

    clear();
    router.push(`/pedido/${data.order.accessToken}`);
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

      <section className="guest-checkout" aria-labelledby="delivery-title">
        <div className="guest-checkout-heading">
          <div>
            <span className="section-number">04 / DELIVERY DATA</span>
            <h2 id="delivery-title">DATOS DE ENTREGA</h2>
          </div>
          <p>NO NECESITÁS CREAR UNA CUENTA.</p>
        </div>

        <form onSubmit={handleCheckout}>
          <div className="checkout-grid">
            <div className="auth-field">
              <label htmlFor="checkout-name">NOMBRE Y APELLIDO *</label>
              <input
                id="checkout-name"
                name="name"
                type="text"
                autoComplete="name"
                maxLength={120}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-email">EMAIL *</label>
              <input
                id="checkout-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={160}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-phone">TELÉFONO *</label>
              <input
                id="checkout-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
                required
              />
            </div>
            <div className="auth-field checkout-field-wide">
              <label htmlFor="checkout-address">DIRECCIÓN *</label>
              <input
                id="checkout-address"
                name="address"
                type="text"
                autoComplete="street-address"
                maxLength={180}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-apartment">PISO / DEPTO (OPCIONAL)</label>
              <input
                id="checkout-apartment"
                name="apartment"
                type="text"
                autoComplete="address-line2"
                maxLength={80}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-city">CIUDAD / LOCALIDAD *</label>
              <input
                id="checkout-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                maxLength={100}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-province">PROVINCIA *</label>
              <input
                id="checkout-province"
                name="province"
                type="text"
                autoComplete="address-level1"
                maxLength={100}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="checkout-postal-code">CÓDIGO POSTAL *</label>
              <input
                id="checkout-postal-code"
                name="postalCode"
                type="text"
                autoComplete="postal-code"
                maxLength={20}
                required
              />
            </div>
            <div className="auth-field checkout-field-wide">
              <label htmlFor="checkout-notes">NOTAS PARA EL ENVÍO (OPCIONAL)</label>
              <textarea id="checkout-notes" name="notes" rows={4} maxLength={600} />
            </div>
          </div>

          <p className="checkout-privacy">
            Usamos estos datos únicamente para preparar el pedido y coordinar la entrega.
          </p>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "GUARDANDO PEDIDO..." : "CONFIRMAR PEDIDO ↗"}
          </button>
        </form>
      </section>
    </main>
  );
}
