import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: "Fitness Temple Gym | The Ultimate Powerhouse",
  description: "Transform your physique at Fitness Temple Gym (फिटनेस टेंपल). Best-in-class equipment, expert coaching by Sanket & Suraj Sir, and a community that pushes you to the limit.",
  icons: {
    icon: [
      { url: "/assets/FitnessTempleGym.png", href: "/assets/FitnessTempleGym.png" },
      { url: "/FitnesstempleGym.png", href: "/FitnesstempleGym.png" },
    ],
    apple: [
      { url: "/assets/FitnessTempleGym.png", href: "/assets/FitnessTempleGym.png" },
    ],
  }
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${montserrat.variable} font-sans bg-background text-foreground`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <Chatbot />
        </AuthProvider>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
      </body>
    </html>
  );
}
