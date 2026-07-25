"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({
  product,
  inStock,
}: {
  product: { id: string; name: string; price: number; imageUrl: string | null };
  inStock: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <button className="primary-button" type="button" disabled>
        SIN STOCK
      </button>
    );
  }

  const handleClick = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button className="primary-button" type="button" onClick={handleClick}>
      {added ? "AGREGADO ✓" : "AGREGAR AL CARRITO"} <span>↘</span>
    </button>
  );
}
