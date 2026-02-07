import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { SWRProvider } from "@/lib/providers/swr-provider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "TrackGrad | Your Graduate School Application Companion",
  description:
    "Track your journey to your dream graduate program. Manage universities, faculty contacts, interviews, recommendation letters, and application statuses in one elegant place.",
  keywords: [
    "graduate school",
    "PhD application",
    "masters application",
    "university tracker",
    "grad school planner",
    "recommendation letters",
    "faculty tracking",
  ],
  authors: [{ name: "TrackGrad" }],
  openGraph: {
    title: "TrackGrad | Your Graduate School Application Companion",
    description: "Track your journey to your dream graduate program.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <SWRProvider>
            {children}
          </SWRProvider>
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--card-foreground))",
            },
          }}
        />
      </body>
    </html>
  );
}
