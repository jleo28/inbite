import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { ToastProvider } from "@/components/Toast";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let navUser: { name: string; initials: string } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, initials")
      .eq("id", user.id)
      .single();

    if (profile) {
      navUser = { name: profile.name, initials: profile.initials };
    }
  }

  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>
          <Nav user={navUser} />
          {children}
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
