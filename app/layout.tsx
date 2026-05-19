import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShopiSpy — Trouver des produits gagnants Shopify",
  description:
    "Analysez la saturation du marché, trouvez des produits trending et générez des fiches produits complètes en 1 clic.",
  openGraph: {
    title: "ShopiSpy",
    description: "L'outil de veille produit pour les ecommerçants Shopify.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jakarta.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
