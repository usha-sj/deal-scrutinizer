import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deal Scrutinizer — Sagard AI",
  description: "Adversarial CIM analysis for PE investment teams",
  icons: {
    icon: "/sagard_favicon.png",
    shortcut: "/sagard_favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}