import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Tenés que iniciar sesión para comprar." }, { status: 401 });
  }

  const body = await request.json();
  const items = Array.isArray(body.items) ? body.items : [];

  if (items.length === 0) {
    return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
  }

  const productIds = items.map((i: { productId: string }) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));

  let total = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    const quantity = Number(item.quantity);

    if (!product) {
      return NextResponse.json(
        { error: `Producto no disponible: ${item.productId}` },
        { status: 400 }
      );
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "Cantidad inválida." }, { status: 400 });
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
      productId: product.id,
      quantity,
      unitPrice,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      status: "PENDING",
      total,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  return NextResponse.json({ order }, { status: 201 });
}
