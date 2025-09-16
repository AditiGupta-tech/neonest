import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GoToTop from "./components/GoToTop";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AutoTaskProvider } from "./context/AutoTaskContext";
import AutoTaskManager from "./components/AutoTaskManager";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
// import Chatbot from "./components/Chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "%s | NeoNest",
    default: "NeoNest - For Parents and Babies",
  },
  description: "Supporting parents through their baby's incredible first year with expert guidance, AI assistance, and a loving community.",
  keywords: ["parenting", "baby", "newborn", "first year", "AI parenting assistant", "NeoNest"],
  openGraph: {
    title: "NeoNest - For Parents and Babies",
    description: "Expert guidance and AI assistance for your baby's first year.",
    url: "https://neonest-babycare.vercel.app/",
    siteName: "NeoNest",
    images: [
      {
        url: "/logo.png",
        width: 900,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeoNest - For Parents and Babies",
    description: "Expert guidance and AI assistance for your baby's first year.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`w-screen dark:bg-gray-900/50 flex flex-col min-h-screen overflow-x-hidden ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AutoTaskProvider>
              <NotificationProvider>
                <Navbar />
                <main className="flex-grow">{children}</main>
                <AutoTaskManager />
                <Footer />
                <GoToTop />
              </NotificationProvider>
            </AutoTaskProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}