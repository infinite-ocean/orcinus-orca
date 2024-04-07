import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Datasets from "@/app/components/Datasets";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orcinus Orca",
  authors: { name: "Albert Zang" },
  description: "Personal Web App Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex`}>
        <nav className="w-80 p-2">
          <Datasets />
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
