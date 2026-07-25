import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
