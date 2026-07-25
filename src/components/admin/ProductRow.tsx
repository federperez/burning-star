"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "./ProductForm";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  active: boolean;
};

export default function ProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`¿Dar de baja "${product.name}"?`)) return;
    setBusy(true);
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  };

  if (editing) {
    return (
      <div className="admin-product-row admin-product-row-editing">
        <ProductForm initial={product} onDone={() => setEditing(false)} />
        <button className="admin-link-button" type="button" onClick={() => setEditing(false)}>
          CANCELAR
        </button>
      </div>
    );
  }

  return (
    <div className={`admin-product-row${product.active ? "" : " admin-product-inactive"}`}>
      <div className="admin-product-main">
        <h3>{product.name}</h3>
        <p>
          ${product.price.toLocaleString("es-AR")} · STOCK {product.stock}
          {!product.active && " · INACTIVO"}
        </p>
      </div>
      <div className="admin-product-actions">
        <button type="button" onClick={() => setEditing(true)}>
          EDITAR
        </button>
        <button type="button" onClick={handleDelete} disabled={busy || !product.active}>
          {product.active ? "DAR DE BAJA" : "YA INACTIVO"}
        </button>
      </div>
    </div>
  );
}
