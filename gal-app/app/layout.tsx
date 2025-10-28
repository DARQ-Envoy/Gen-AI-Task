import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LLM Lab - Response Quality Analyzer",
    template: "%s | LLM Lab"
  },
  description: "Compare LLM parameter effects on response quality with advanced analytics and metrics",
  keywords: ["LLM", "AI", "Machine Learning", "Response Quality", "Analytics", "Experiments"],
  authors: [{ name: "LLM Lab Team" }],
  creator: "LLM Lab",
  publisher: "LLM Lab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://llm-lab.example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://llm-lab.example.com',
    title: 'LLM Lab - Response Quality Analyzer',
    description: 'Compare LLM parameter effects on response quality with advanced analytics and metrics',
    siteName: 'LLM Lab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM Lab - Response Quality Analyzer',
    description: 'Compare LLM parameter effects on response quality with advanced analytics and metrics',
    creator: '@llmlab',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}