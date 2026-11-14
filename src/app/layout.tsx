import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "BUILD  | Premium Gen Z Streetwear & Graphic Apparel",
  description:
    "Premium independent streetwear label. Engineered boxy silhouettes, 240+ GSM heavyweight cotton, original anime & cyberpunk graphic drops. Built Different.",
  keywords: [
    "streetwear",
    "oversized t-shirts",
    "heavyweight cotton",
    "240 GSM tees",
    "graphic tees",
    "anime streetwear tees",
    "boxy fit t-shirts",
    "custom printed t-shirts",
    "build clothing",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F5F3EE] text-[#151515] min-h-screen flex flex-col streetwear-grain">
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar />
            <Navbar />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

