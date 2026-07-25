"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartLink() {
  const { count } = useCart();

  return (
    <Link href="/carrito" className="cart-fab" aria-label="Ver carrito">
      CARRITO {count > 0 && <span className="cart-fab-count">{count}</span>}
    </Link>
  );
}
