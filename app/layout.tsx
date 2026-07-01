import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "The Operator's Notes",
    template: "%s — The Operator's Notes",
  },
  description: "A public repository of ideas, observations, startup research, product analysis, and lessons from building. By Felix.",
  keywords: ["startups", "product", "web3", "growth", "operator", "Felix"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://operatorsnotes.com",
    title: "The Operator's Notes",
    description: "Notes on startups, products, Web3, growth, systems, and execution.",
    siteName: "The Operator's Notes",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Operator's Notes",
    description: "Notes on startups, products, Web3, growth, systems, and execution.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
