"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "burning-star-cart";

function restoreCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Partial<CartItem>;

    if (
      typeof candidate.productId !== "string" ||
      typeof candidate.name !== "string" ||
      typeof candidate.price !== "number" ||
      typeof candidate.quantity !== "number"
    ) {
      return [];
    }

    const stock =
      typeof candidate.stock === "number" && candidate.stock > 0
        ? Math.floor(candidate.stock)
        : Number.MAX_SAFE_INTEGER;

    return [
      {
        productId: candidate.productId,
        name: candidate.name,
        price: candidate.price,
        imageUrl: typeof candidate.imageUrl === "string" ? candidate.imageUrl : null,
        stock,
        quantity: Math.max(1, Math.min(Math.floor(candidate.quantity), stock)),
      },
    ];
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setItems(restoreCartItems(JSON.parse(stored)));
        } catch {
          // ignore corrupted cart data
        }
      }
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? {
                ...i,
                ...item,
                quantity: Math.min(i.quantity + quantity, item.stock),
              }
            : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.stock) }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  };

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, setQuantity, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
