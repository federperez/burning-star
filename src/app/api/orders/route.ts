import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getFeaturedProduct } from "@/lib/catalog";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Los datos de la compra no son válidos." }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  const customer = readCustomer(body.customer);

  if (items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  if (!customer) {
    return NextResponse.json(
      { error: "Completá tu mail y todos los datos de entrega obligatorios." },
      { status: 400 }
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "La recepción de pedidos todavía no está conectada. Probá nuevamente más tarde." },
      { status: 503 }
    );
  }

  const requestedItems = new Map<string, number>();
  for (const item of items) {
    const productId = typeof item?.productId === "string" ? item.productId : "";
    const quantity = Number(item?.quantity);

    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Cantidad inválida." }, { status: 400 });
    }

    requestedItems.set(productId, (requestedItems.get(productId) ?? 0) + quantity);
  }

  try {
    const productIds = [...requestedItems.keys()];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    });
    const databaseProducts = new Map(products.map((product) => [product.id, product]));

    let total = 0;
    const orderItemsData: Array<{
      productId: string | null;
      productName: string;
      productImageUrl: string | null;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const [productId, quantity] of requestedItems) {
      const databaseProduct = databaseProducts.get(productId);
      const fallbackProduct = getFeaturedProduct(productId);
      const product = databaseProduct ?? fallbackProduct;

      if (!product) {
        return NextResponse.json(
          { error: `Producto no disponible: ${productId}` },
          { status: 400 }
        );
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          { error: `Sin stock suficiente de "${product.name}".` },
          { status: 409 }
        );
      }

      const unitPrice = Number(product.price);
      total += unitPrice * quantity;
      orderItemsData.push({
        productId: databaseProduct?.id ?? null,
        productName: product.name,
        productImageUrl: product.imageUrl,
        quantity,
        unitPrice,
      });
    }

    const accessToken = randomUUID();
    const order = await prisma.$transaction(async (transaction) => {
      for (const [productId, quantity] of requestedItems) {
        if (!databaseProducts.has(productId)) continue;

        const updated = await transaction.product.updateMany({
          where: { id: productId, active: true, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });

        if (updated.count !== 1) {
          throw new Error("STOCK_CHANGED");
        }
      }

      return transaction.order.create({
        data: {
          accessToken,
          customerEmail: customer.email,
          customerName: customer.name,
          customerPhone: customer.phone,
          shippingAddress: customer.address,
          apartment: customer.apartment || null,
          city: customer.city,
          province: customer.province,
          postalCode: customer.postalCode,
          notes: customer.notes || null,
          status: "PENDING",
          total,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });
    });

    return NextResponse.json(
      { order: { id: order.id, accessToken: order.accessToken } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "STOCK_CHANGED") {
      return NextResponse.json(
        { error: "El stock cambió mientras comprabas. Revisá el carrito e intentá otra vez." },
        { status: 409 }
      );
    }

    console.error("Guest checkout failed", error);
    return NextResponse.json(
      { error: "No pudimos guardar el pedido. Probá nuevamente en unos minutos." },
      { status: 500 }
    );
  }
}

type CustomerData = {
  email: string;
  name: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
};

function readCustomer(value: unknown): CustomerData | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const text = (key: string, maxLength: number) =>
    typeof source[key] === "string" ? source[key].trim().slice(0, maxLength) : "";

  const customer = {
    email: text("email", 160).toLowerCase(),
    name: text("name", 120),
    phone: text("phone", 40),
    address: text("address", 180),
    apartment: text("apartment", 80),
    city: text("city", 100),
    province: text("province", 100),
    postalCode: text("postalCode", 20),
    notes: text("notes", 600),
  };

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email);
  if (
    !emailIsValid ||
    customer.name.length < 2 ||
    customer.phone.length < 6 ||
    customer.address.length < 4 ||
    customer.city.length < 2 ||
    customer.province.length < 2 ||
    customer.postalCode.length < 3
  ) {
    return null;
  }

  return customer;
}
