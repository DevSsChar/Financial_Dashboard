import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zorvyn Finance",
  description: "Track personal financial activity — powered by data, designed with Revolut DNA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen flex font-sans overflow-x-hidden`}>
        <AppProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-32 md:pb-8">
              {children}
            </main>
          </div>
          <MobileNav />
        </AppProvider>
      </body>
    </html>
  );
}
