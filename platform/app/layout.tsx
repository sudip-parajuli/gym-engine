import "./globals.css";
import type { Metadata } from "next";
import { BASE_URL, indexingEnabled } from "@/lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Gym Engine | Fitness plans, diet research & gym management",
    template: "%s | Gym Engine",
  },
  description:
    "Explore evidence-informed diet and exercise guides, make a one-time plan freely, and sign in to track meals, workouts and progress. Built with Nepal in mind.",
  robots: { index: indexingEnabled(), follow: indexingEnabled() },
  openGraph: {
    type: "website",
    siteName: "Gym Engine",
    locale: "en_US",
    title: "Gym Engine — food, movement and your progress",
    description:
      "Public fitness knowledge and personal tracking, alongside gym management.",
  },
  twitter: { card: "summary_large_image" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
