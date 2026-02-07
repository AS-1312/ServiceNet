import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/providers/web3-provider";
import { Navbar } from "@/components/navbar";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ServiceNet - Decentralized Service Marketplace",
  description: "A decentralized marketplace where services are discovered via ENS names and consumed via instant, gas-free micropayments powered by Yellow state channels.",
  keywords: ["ServiceNet", "ENS", "Web3", "Decentralized", "Marketplace", "Yellow Network", "Micropayments"],
  authors: [{ name: "ServiceNet Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Web3Provider>
            <ToastProvider>
              <Navbar />
              <main className="pt-16">
                {children}
              </main>
              <ToastContainer />
            </ToastProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
