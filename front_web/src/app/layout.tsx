import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";

import config from "@/config";
import Navigation from "@/components/Navigation/Navigation";
import styles from './page.module.css'
import Footer from "@/components/Footer/Footer";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: config.websiteTitle,
  description: config.websiteDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = headers().get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers cookie={cookie}>
          <Navigation />
          <main className={styles.main}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html >
  );
}
