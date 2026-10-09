import type { Metadata } from "next";
import { Noto_Serif_Bengali } from "next/font/google";
import { Toaster } from "sonner"; // 1. Sonner Toaster Import
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-geist-sans",
  subsets: ["latin", "bengali"],
});

export const metadata: Metadata = {
  title: "Bazar Dor - বাজার দর",
  description: "Grocery price tracking in Bangladesh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${notoSerifBengali.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        
        {/* 2. Toast Notification Container */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}