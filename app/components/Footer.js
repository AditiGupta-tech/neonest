"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Github,
  ExternalLink,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export default function NeoNestFooter() {
  const features = [
    { name: "Growth Tracker", href: "/Growth" },
    { name: "Feed Scheduler", href: "/Feeding" },
    { name: "Sleep Tracker", href: "/Sleep" },
    { name: "Vaccine Tracker", href: "/Medical" },
    { name: "Inventory Tracker", href: "/Essentials" },
  ];

  const support = [
    { name: "About NeoNest", href: "/" },
    { name: "FAQs", href: "/Faqs" },
    { name: "Resources", href: "/Resources" },
    { name: "NeoNest AI", href: "/NeonestAi" },
    { name: "Memories, Community & Blogs", href: "/Memories" },
  ];

  const projectLinks = [
    {
      name: "GitHub Repository",
      icon: Github,
      href: "https://github.com/AditiGupta-tech/neonest",
    },
    {
      name: "Live Website",
      icon: ExternalLink,
      href: "https://neonest-babycare.vercel.app/",
    },
    {
      name: "Contributing Guide",
      icon: BookOpen,
      href: "https://github.com/AditiGupta-tech/neonest/blob/main/Contributing.md",
    },
    {
      name: "GitHub Discussions",
      icon: MessageCircle,
      href: "https://github.com/AditiGupta-tech/neonest/discussions",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col justify-end">
      <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

        {/* Floating elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-purple-400/10 rounded-full blur-xl"></div>

        <div className="max-w-6xl mx-auto px-6 py-16 relative">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center gap-x-1 mb-2">
                    <Image
                      src="/logoFooter.png"
                      alt="NeoNest Logo"
                      width={40}
                      height={40}
                      className="object-contain -mt-1.5"
                    />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    NeoNest
                  </span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  Supporting parents through their baby's incredible first year
                  with expert guidance, AI assistance, and a loving
                  community—making parenting 10x easier, calmer, and more
                  connected.
                </p>
                <div className="flex items-center space-x-2 text-pink-400 font-medium">
                  <span>Happy baby, Happy you!</span>
                  <Heart className="w-5 h-5 fill-current animate-pulse" />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full mr-3"></div>
                Features
              </h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="group">
                    <Link
                      href={feature.href}
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-200 flex items-center"
                    >
                      <span className="w-2 h-2 bg-pink-400/60 rounded-full mr-3 group-hover:bg-pink-400 transition-colors"></span>
                      {feature.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-3"></div>
                Support
              </h3>
              <ul className="space-y-3">
                {support.map((item, index) => (
                  <li key={index} className="group">
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center"
                    >
                      <span className="w-2 h-2 bg-blue-400/60 rounded-full mr-3 group-hover:bg-blue-400 transition-colors"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Project Links */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <div className="w-2 h-5 bg-gradient-to-b from-green-400 to-blue-400 rounded-full mr-3"></div>
              Project Links
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {projectLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <link.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white transition-colors text-sm font-medium">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/20 pt-4">
            <div className="text-center space-y-1">
              <div className="text-gray-300 text-sm flex items-center justify-center space-x-2">
                <span>© 2025 NeoNest by</span>
                <span className="font-semibold text-pink-300">Aditi Gupta</span>
                <span>• Released under the</span>
                <span className="font-semibold text-blue-300">
                  MIT License
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
                <span>for parents and babies</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
