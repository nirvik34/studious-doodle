import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import VoiceCommandButton from "@/components/shared/VoiceCommandButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "StrokeRisk AI - Early Detection Platform",
  description: "Medical-grade stroke risk detection using AI analysis.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <Providers>
          {children}
          <VoiceCommandButton />
        </Providers>
      </body>
    </html>
  );
}
