import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
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
        <main className="flex-1 overflow-auto h-full">{children}</main>
        <nav className="w-80 border-l overflow-auto h-full">
          <Datasets />
        </nav>
      </body>
    </html>
  );
}
