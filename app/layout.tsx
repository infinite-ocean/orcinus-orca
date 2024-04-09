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
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex h-full`}>
        <main className="flex-1">{children}</main>
        <nav className="w-80 border-l overflow-auto h-full">
          <Datasets />
        </nav>
      </body>
    </html>
  );
}
