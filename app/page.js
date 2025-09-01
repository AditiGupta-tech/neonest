

import Homepage from "./components/Homepage";

// SEO Metadata (Next.js will auto-add to <head>)
export const metadata = {
  title: "NeoNest | AI-Powered Babycare Assistant",
  description:
    "NeoNest bridges the gap with an all-in-one AI-powered babycare assistant. From feeding logs to vaccine reminders, milestone tracking, and an empathetic chatbot, it helps parents stay organized, supported, and informed—without feeling overwhelmed.",
  keywords: [
    "babycare",
    "AI parenting app",
    "feeding logs",
    "vaccine reminders",
    "milestone tracking",
    "baby assistant",
    "parenting support",
    "NeoNest AI",
  ],
  openGraph: {
    title: "NeoNest | AI-Powered Babycare Assistant",
    description:
      "NeoNest helps parents with feeding logs, vaccine reminders, milestone tracking, and an empathetic chatbot—making babycare simple and stress-free.",
    url: "https://neonest.vercel.app/",
    siteName: "NeoNest",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: "NeoNest Logo",
      },
    ],
    type: "website",
  },
};

const Page = () => {
  return (
    <div>
      <Homepage />
    </div>
  );
};

export default Page;
