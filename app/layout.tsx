import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InBite, Meal Planning",
  description:
    "Plan recipes, build meals, and gather the people who matter, all in one warm and simple place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <Nav />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
