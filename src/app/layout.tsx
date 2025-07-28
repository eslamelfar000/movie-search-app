import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// TODO: Fix import path if Providers component exists elsewhere
// import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "Movie Search",
  description: "Search and discover movies with detailed information",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
