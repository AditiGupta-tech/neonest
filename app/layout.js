import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import GoToTop from "./components/GoToTop";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AutoTaskProvider } from "./context/AutoTaskContext";
import AutoTaskManager from "./components/AutoTaskManager";
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
  title: "NeoNest - For Parents and Babies",
  description: "Supporting parents through their baby's incredible first year with expert guidance, AI assistance, and loving community.",
  keywords: "baby care, parenting, AI assistant, baby tracker, vaccine reminders, feeding log, sleep tracker, milestone, NeoNest",
  openGraph: {
    title: "NeoNest - Your AI-Powered Baby Care Assistant",
    description: "All-in-one platform for new parents: feeding, sleep, growth, vaccines, and more. Trusted by thousands.",
    url: "https://neonest-babycare.vercel.app/",
    siteName: "NeoNest",
    images: [
      {
        url: "/logoFooter.png",
        width: 512,
        height: 512,
        alt: "NeoNest Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NeoNest - Your AI-Powered Baby Care Assistant",
    description: "All-in-one platform for new parents: feeding, sleep, growth, vaccines, and more.",
    images: ["/logoFooter.png"],
    site: "@neonestbabycare",
  },
  icons: {
    icon: "/logoFooter.png",
    shortcut: "/logoFooter.png",
    apple: "/logoFooter.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
  {/* head is managed by Next.js metadata export */}
      <body
        className={`w-screen flex flex-col min-h-screen overflow-x-hidden ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AutoTaskProvider>
            <NotificationProvider>
              <Navbar />
              <main className="flex-grow">{children}</main>
              <AutoTaskManager/>
              <Footer />
              <GoToTop />
            </NotificationProvider>
          </AutoTaskProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
