"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

export default function ProductForm({
  initial,
  onDone,
}: {
  initial?: ProductFormValues;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [stock, setStock] = useState(initial?.stock?.toString() ?? "0");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initial?.id);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = { name, description, price, stock, imageUrl };
    const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "No se pudo guardar el producto.");
      return;
    }

    if (!isEdit) {
      setName("");
      setDescription("");
      setPrice("");
      setStock("0");
      setImageUrl("");
    }

    onDone?.();
    router.refresh();
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <p className="auth-error">{error}</p>}
      <div className="auth-field">
        <label htmlFor="name">NOMBRE</label>
        <input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="auth-field">
        <label htmlFor="description">DESCRIPCIÓN</label>
        <textarea
          id="description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="admin-form-row">
        <div className="auth-field">
          <label htmlFor="price">PRECIO</label>
          <input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label htmlFor="stock">STOCK</label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
      </div>
      <div className="auth-field">
        <label htmlFor="imageUrl">URL DE IMAGEN (OPCIONAL)</label>
        <input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="/assets/burning-star-emblem.svg"
        />
      </div>
      <button className="auth-submit" type="submit" disabled={loading}>
        {loading ? "GUARDANDO..." : isEdit ? "GUARDAR CAMBIOS" : "CREAR PRODUCTO"}
      </button>
    </form>
  );
}
