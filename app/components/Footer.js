"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Facebook, Twitter, Instagram, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-5 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center gap-x-2 mb-2">
              <Image
                src="/logoFooter.jpg"
                alt="NeoNest Logo"
                width={40}
                height={40}
                className="object-contain -mt-1.5"
              />
              <span className="font-semibold text-lg mb-2">NeoNest</span>
            </div>
            <p className="text-gray-400 text-sm">
              Supporting parents through their baby's incredible first year with expert guidance, AI assistance, and a loving community—
              making parenting easier, calmer, and more connected.
              <br />Happy baby, happy you!
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-2">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/Growth" className="hover:text-white">Growth Tracker</Link></li>
              <li><Link href="/Feeding" className="hover:text-white">Feed Scheduler</Link></li>
              <li><Link href="/Sleep" className="hover:text-white">Sleep Tracker</Link></li>
              <li><Link href="/Medical" className="hover:text-white">Vaccine Tracker</Link></li>
              <li><Link href="/Essentials" className="hover:text-white">Inventory Tracker</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-2">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white">About NeoNest</Link></li>
              <li><Link href="/Faqs" className="hover:text-white">FAQs</Link></li>
              <li><Link href="/Resources" className="hover:text-white">Resources</Link></li>
              <li><Link href="/NeonestAi" className="hover:text-white">NeoNest AI</Link></li>
              <li><Link href="/Memories" className="hover:text-white">Memories, Community & Blogs</Link></li>
            </ul>
          </div>

          {/* Contact & Links */}
          <div>
            <h4 className="font-semibold mb-2">Contact & Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@babycare.com" className="hover:text-white">support@babycare.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-BABY-CARE</span>
              </li>
              <li className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <a href="https://github.com/AditiGupta-tech/neonest" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  GitHub Repository
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                <a href="https://instagram.com/neonestofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  @neonestofficial
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                <a href="https://facebook.com/neonestofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  @neonestofficial
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                <a href="https://twitter.com/neonestofficial" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  @neonestofficial
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Link href="https://github.com/AditiGupta-tech/neonest/blob/main/CONTRIBUTING.md" className="hover:text-white">
                  Contributing Guide
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Link href="https://github.com/AditiGupta-tech/neonest/discussions" className="hover:text-white">
                  GitHub Discussions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>© 2025 NeoNest by Aditi Gupta. Released under the MIT License.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

