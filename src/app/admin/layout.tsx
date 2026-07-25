import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <span className="section-number">BS® / ADMIN</span>
        <nav className="admin-nav">
          <Link href="/admin/products">PRODUCTOS</Link>
          <Link href="/admin/orders">PEDIDOS</Link>
          <Link href="/">← VOLVER AL SITIO</Link>
        </nav>
      </aside>
      <main className="admin-content">{children}</main>
    </div>
  );
}
