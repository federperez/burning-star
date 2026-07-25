import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(request: Request) {
  const { response } = await requireAdmin();
  if (response) return response;

  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const price = Number(body.price);
  const stock = Number.isFinite(Number(body.stock)) ? Number(body.stock) : 0;
  const imageUrl = typeof body.imageUrl === "string" && body.imageUrl.trim() ? body.imageUrl.trim() : null;

  if (!name || !description || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { error: "Nombre, descripción y precio (mayor a 0) son obligatorios." },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: { name, description, price, stock, imageUrl },
  });

  return NextResponse.json({ product }, { status: 201 });
}
