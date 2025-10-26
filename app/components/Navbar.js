"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/Button";
import Chatbot from "./Chatbot";
import { useAuth } from "../context/AuthContext";
import { useChatStore } from "@/lib/store/chatStore";
import { Menu, X, User, LogOut } from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useAutoTask } from "../context/AutoTaskContext";
import AutoTask from "./AutoTask";
import ThemeToggle from "./ThemeToggle";

const tabs = [
  { label: "home", path: "/" },
  { label: "growth", path: "/Growth" },
  { label: "feeding", path: "/Feeding" },
  { label: "sleep", path: "/Sleep" },
  { label: "medical", path: "/Medical" },
  { label: "essentials", path: "/Essentials" },
  { label: "memories", path: "/Memories" },
  { label: "toys", path: "/Toys" },
  { label: "resources", path: "/Resources" },
  { label: "faqs", path: "/Faqs" },
  { label: "lullaby", path: "/Lullaby" },
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuth, signOut, user } = useAuth();
  const { setAutoTask, isAutoTask } = useAutoTask();

  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(100);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    useChatStore.getState().clearChatHistory();
    await signOut();
    setShowModal(true);
    setProgress(100);
    setMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  useEffect(() => {
    if (!showModal) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 3.33;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showModal]);

  useEffect(() => {
    if (progress <= 0 && showModal) {
      setShowModal(false);
      router.push("/");
    }
  }, [progress, showModal, router, setShowModal]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

return (
  <>
    {/* logout modal */}
    {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] flex items-center justify-center transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 px-6 py-5 rounded-xl shadow-lg text-center w-[320px]">
            <p className="text-gray-800  dark:text-gray-100 mb-3">
              Logged out successfully.{" "}
              <Link href="/Login" onClick={() => setShowModal(false)} className="text-pink-600 dark:text-pink-400 font-normal no-underline">
                Login
              </Link>{" "}
              again!
            </p>
            <div className="w-full h-1 bg-pink-100 dark:bg-pink-900  rounded-full overflow-hidden">
              <div className="h-full bg-pink-500 transition-all duration-100" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
    )}

    {/* --- NAVBAR --- */}
    <header className="bg-white/80 dark:bg-gray-900/80 dark:border-gray-700 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-30">
      <div className="container mx-auto px-6 py-2 md:py-4 flex items-center justify-between">

        {/* Hamburger Menu and Logo */}
        <div className="flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-pink-600 focus:outline-none z-50 mr-5">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <Link href="/" className="flex items-center">
            <Image src="/logoFooter.png" alt="NeoNest" width={60} height={60} />
            <span className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent ml-2">NeoNest</span>
          </Link>
        </div>

        {/*Theme Toggle and Auth Buttons*/}
        <div className="flex items-center space-x-2">
            <ThemeToggle />
            {isAuth ? (
              <>
                <NotificationBell />
                {/* Profile Dropdown */}
                <div className="relative profile-dropdown-container">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
                      {user?.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block font-medium">
                      {user?.user_metadata?.name || 'Account'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {user?.user_metadata?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"><Link href="/Login">Login</Link></Button>
                <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"><Link href="/Signup">Signup</Link></Button>
              </>
            )}
        </div>
      </div>
    </header>


      {/* --- floating chatbot and autoTask button --- */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 flex flex-col gap-3 z-20">
          <div className="m-1 border-white rounded-full border-2"><Chatbot /></div>
          <div className="m-1 border-white rounded-full border-2"><AutoTask setAutoTask={setAutoTask} isAutoTask={isAutoTask} /></div>
      </div>

      {/* --- sidebar --- */}
      {/* {menuOpen && ( */}
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMenuOpen(false)} // Close menu
        >
          <div
            className={`"fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl p-6 flex flex-col transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the menu from closing it
          >
            {/* Logo */}
            <Link href="/" className="flex items-center mb-8" onClick={() => setMenuOpen(false)}>
              <Image src="/logoFooter.png" alt="NeoNest" width={60} height={60} />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent ml-2">NeoNest</span>
            </Link>

            {/* User Profile Section */}
            {isAuth && user && (
              <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.user_metadata?.name ? user.user_metadata.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.user_metadata?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">View Profile</span>
                  </button>
                </Link>
              </div>
            )}

            <nav className="flex flex-col space-y-4 flex-grow overflow-y-auto">
              {tabs.map(({ label, path }) => (
                <Link key={label} href={path}>
                  <span
                    onClick={() => setMenuOpen(false)}
                    className={`block capitalize text-lg font-medium p-2 rounded-md ${pathname === path ? "bg-pink-100 dark:bg-pink-900/50 text-pink-600" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Logout Button in Sidebar */}
            {isAuth && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
    {/* )} */}
  </>
);
};

export default Navbar;
