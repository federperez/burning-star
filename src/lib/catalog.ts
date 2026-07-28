export type StorefrontProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
};

export const featuredProducts: StorefrontProduct[] = [
  {
    id: "core-identity",
    name: "CORE IDENTITY TEE",
    description:
      "Remera negra con el emblema Burning Star estampado. Algodón peinado 24/1, corte oversize.",
    price: 24999,
    stock: 15,
    imageUrl: "/assets/burning-star-emblem.svg",
  },
  {
    id: "broadcast",
    name: "BROADCAST CAP",
    description:
      "Gorra con el wordmark oficial bordado. Ajuste trasero, visera curva.",
    price: 18999,
    stock: 8,
    imageUrl: "/assets/burning-star-banner.jpg",
  },
  {
    id: "burning-object",
    name: "BURNING OBJECT HOODIE",
    description:
      "Buzo canguro rojo quemado con el sistema de identidad Burning Star. Frisa pesada 380g.",
    price: 42999,
    stock: 0,
    imageUrl: null,
  },
];

export function getFeaturedProduct(id: string) {
  return featuredProducts.find((product) => product.id === id);
}
