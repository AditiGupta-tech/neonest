"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import LoginPrompt from "../components/LoginPrompt";
import DashboardLayout from "../components/Dashboard/DashboardLayout";

export default function DashboardPage() {
  const { isAuth, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    document.title = "Dashboard | NeoNest";
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <LoginPrompt sectionName="dashboard" />;
  }

  return <DashboardLayout />;
}
