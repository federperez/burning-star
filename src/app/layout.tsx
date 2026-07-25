import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import CartLink from "@/components/CartLink";

export const metadata: Metadata = {
  title: "Burning Star — Design to Defy",
  description: "Burning Star: negro, acero y fuego. Design to Defy.",
  icons: {
    icon: "/assets/burning-star-emblem.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <CartLink />
          {children}
        </Providers>
      </body>
    </html>
  );
}
