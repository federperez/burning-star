import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") data.name = body.name.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Precio inválido." }, { status: 400 });
    }
    data.price = price;
  }
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json({ error: "Stock inválido." }, { status: 400 });
    }
    data.stock = stock;
  }
  if (body.imageUrl !== undefined) {
    data.imageUrl = typeof body.imageUrl === "string" && body.imageUrl.trim() ? body.imageUrl.trim() : null;
  }
  if (typeof body.active === "boolean") data.active = body.active;

  const product = await prisma.product.update({ where: { id }, data });

  return NextResponse.json({ product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.product.update({ where: { id }, data: { active: false } });

  return NextResponse.json({ ok: true });
}
