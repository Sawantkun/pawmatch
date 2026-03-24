import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/nav/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PawMatch — Find Your Perfect Pet",
  description:
    "AI-powered pet adoption platform. Find your perfect furry companion with smart matching, real-time shelter chat, and verified pet profiles.",
  keywords: "pet adoption, dog adoption, cat adoption, rescue pets, AI pet matching",
  openGraph: {
    title: "PawMatch — Find Your Perfect Pet",
    description: "AI-powered pet adoption. Find your forever companion.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
                fontSize: "0.88rem",
                fontFamily: "var(--font-inter)",
              },
              success: {
                iconTheme: { primary: "var(--color-amber-500)", secondary: "white" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
