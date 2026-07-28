"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  product,
  stock,
}: {
  product: { id: string; name: string; price: number; imageUrl: string | null };
  stock: number;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <div className="purchase-panel is-disabled">
        <span className="purchase-label">PRODUCT STATUS</span>
        <button className="primary-button" type="button" disabled>
          SIN STOCK
        </button>
      </div>
    );
  }

  const addSelectedQuantity = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock,
      },
      quantity
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addSelectedQuantity();
    router.push("/carrito");
  };

  return (
    <div className="purchase-panel">
      <div className="quantity-control">
        <span className="purchase-label">CANTIDAD</span>
        <div>
          <button
            type="button"
            aria-label="Disminuir cantidad"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            −
          </button>
          <output aria-live="polite">{quantity}</output>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            disabled={quantity >= stock}
            onClick={() => setQuantity((current) => Math.min(stock, current + 1))}
          >
            +
          </button>
        </div>
      </div>

      <div className="purchase-actions">
        <button className="primary-button" type="button" onClick={addSelectedQuantity}>
          {added ? "AGREGADO ✓" : "AGREGAR AL CARRITO"} <span>↘</span>
        </button>
        <button className="buy-now-button" type="button" onClick={handleBuyNow}>
          COMPRAR AHORA <span>↗</span>
        </button>
      </div>
    </div>
  );
}
