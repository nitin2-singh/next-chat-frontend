import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProviders } from "@/providers/theme-providers";
import { QueryProvider } from "@/providers/query-providers";
import { Toaster } from "@/components/ui/sonner";

export const space_grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Next chat",
  description: "A chat app for everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProviders>
        <QueryProvider>
          <Toaster />
          <body className={`${space_grotesk.variable} antialiased`}>
            {children}
          </body>
        </QueryProvider>
      </ThemeProviders>
    </html>
  );
}
