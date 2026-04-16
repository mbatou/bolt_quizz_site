import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Move, Your Way — Bolt Ghana Rider Quiz",
  description:
    "5 real Accra moments. Your answers reveal what kind of Bolt rider you are.",
  openGraph: {
    title: "Move, Your Way — Bolt Ghana Rider Quiz",
    description:
      "5 real Accra moments. Your answers reveal what kind of Bolt rider you are.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#2A9C64" />
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
