"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { User, Baby, Settings, Download, LogOut, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/lib/store/chatStore";

// Mock data - will be replaced with real data from backend
const mockUserData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  profilePicture: null, // placeholder for now
};

const mockBabiesData = [
  {
    id: 1,
    babyName: "Emma",
    dateOfBirth: new Date("2023-08-15"),
    gender: "female",
    weight: "3.2 kg"
  },
  {
    id: 2,
    babyName: "Oliver",
    dateOfBirth: new Date("2023-11-22"),
    gender: "male",
    weight: "3.5 kg"
  }
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();
  const router = useRouter();

  // Calculate age in months and days
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    
    let months = today.getMonth() - birth.getMonth();
    let years = today.getFullYear() - birth.getFullYear();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    const totalMonths = years * 12 + months;
    
    // Calculate days for more precise age
    const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, birth.getDate());
    const days = Math.floor((today - lastMonthDate) / (1000 * 60 * 60 * 24));
    
    if (totalMonths === 0) {
      return `${days} days`;
    } else if (totalMonths < 12) {
      return `${totalMonths} months, ${days} days`;
    } else {
      const displayYears = Math.floor(totalMonths / 12);
      const displayMonths = totalMonths % 12;
      return `${displayYears} year${displayYears > 1 ? 's' : ''}, ${displayMonths} months`;
    }
  };

  const handleLogout = () => {
    useChatStore.getState().clearChatHistory();
    logout();
    router.push("/");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to normalize gender values
  const normalizeGender = (gender) => {
    if (!gender) return 'other';
    const g = gender.toLowerCase();
    if (g === 'female' || g === 'girl' || g === 'f') return 'female';
    if (g === 'male' || g === 'boy' || g === 'm') return 'male';
    return 'other';
  };

  // Prioritize real user data over mock data
  const displayUser = user || mockUserData;
  const displayBabies = (user?.BabyDet && user.BabyDet.length > 0) 
    ? user.BabyDet.map(baby => ({
        ...baby,
        gender: normalizeGender(baby.gender),
        weight: baby.Weight || baby.weight // Handle both Weight and weight fields
      }))
    : mockBabiesData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your account and baby information
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-pink-100 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* User Info Section */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-pink-100 dark:ring-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl dark:text-white">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-8">
                  {/* Profile Picture Placeholder */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* User Details */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {displayUser.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                      {displayUser.email}
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg">
                        <Baby className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        <span className="font-semibold text-pink-800 dark:text-pink-300">
                          {displayBabies.length} {displayBabies.length === 1 ? 'Baby' : 'Babies'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Baby Info Cards */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                  <Baby className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Baby Information
                </h2>
              </div>
              
              {displayBabies.length === 0 ? (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-pink-100 dark:ring-gray-700">
                  <CardContent className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Baby className="h-10 w-10 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No babies added yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Add your baby's details to get started with tracking their growth and milestones.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {displayBabies.map((baby, index) => (
                    <Card key={baby.id || index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-pink-100 dark:ring-gray-700 hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                              normalizeGender(baby.gender) === 'female' ? 'bg-gradient-to-br from-pink-400 to-pink-600' : 
                              normalizeGender(baby.gender) === 'male' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 'bg-gradient-to-br from-purple-400 to-purple-600'
                            }`}>
                              {normalizeGender(baby.gender) === 'female' ? (
                                <span className="text-white font-bold text-lg">♀</span>
                              ) : normalizeGender(baby.gender) === 'male' ? (
                                <span className="text-white font-bold text-lg">♂</span>
                              ) : (
                                <Baby className="h-6 w-6 text-white" />
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-bold dark:text-white mb-1">
                                {baby.babyName}
                              </CardTitle>
                              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                                normalizeGender(baby.gender) === 'female' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' : 
                                normalizeGender(baby.gender) === 'male' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  normalizeGender(baby.gender) === 'female' ? 'bg-pink-500' : 
                                  normalizeGender(baby.gender) === 'male' ? 'bg-blue-500' : 'bg-purple-500'
                                }`} />
                                {normalizeGender(baby.gender) === 'female' ? 'Girl' : normalizeGender(baby.gender) === 'male' ? 'Boy' : 'Other'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl">
                              <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">
                                {calculateAge(baby.dateOfBirth)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Born</p>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {formatDate(baby.dateOfBirth)}
                              </p>
                            </div>
                          </div>
                          
                          {(baby.weight || baby.Weight) && (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full" />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Weight</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {baby.weight || baby.Weight}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Actions */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-pink-100 dark:ring-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl dark:text-white">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  Profile Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <Button 
                      disabled 
                      className="w-full h-16 flex items-center gap-3 opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      variant="outline"
                    >
                      <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
                        <Download className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Download Data</div>
                        <div className="text-sm opacity-75">Export as PDF (Coming Soon)</div>
                      </div>
                    </Button>
                  </div>
                  
                  <div className="group">
                    <Button 
                      onClick={handleLogout}
                      variant="destructive"
                      className="w-full h-16 flex items-center gap-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="p-2 bg-red-600 rounded-lg">
                        <LogOut className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Logout</div>
                        <div className="text-sm opacity-90">Sign out of your account</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl ring-1 ring-pink-100 dark:ring-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl dark:text-white">
                  <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                    <Settings className="h-6 w-6 text-white" />
                  </div>
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <Settings className="h-12 w-12 text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Settings Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg max-w-md mx-auto">
                    We're working on bringing you comprehensive settings to customize your experience.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                    This section will include account preferences, notification settings, privacy controls, and more personalization options.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
