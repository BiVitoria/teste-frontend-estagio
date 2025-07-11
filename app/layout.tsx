import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initializeTheme } from "@/lib/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Teste Frontend - Login",
  description: "Aplicação de teste com login e cadastro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined") {
    initializeTheme();
  }

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
