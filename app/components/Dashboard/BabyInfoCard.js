"use client";

import { Baby, Calendar, Weight, Cake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function BabyInfoCard({ baby }) {
  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    const ageInMs = today - birthDate;
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 30) {
      return `${ageInDays} days old`;
    } else if (ageInDays < 365) {
      const months = Math.floor(ageInDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} old`;
    } else {
      const years = Math.floor(ageInDays / 365);
      const remainingMonths = Math.floor((ageInDays % 365) / 30);
      return `${years} ${years === 1 ? 'year' : 'years'}${remainingMonths > 0 ? ` and ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}` : ''}`;
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Gender emoji
  const getGenderEmoji = (gender) => {
    if (!gender) return "👶";
    const g = gender.toLowerCase();
    if (g === "male") return "👦";
    if (g === "female") return "👧";
    return "👶";
  };

  const age = calculateAge(baby.dateOfBirth || baby.DOB);
  const dob = formatDate(baby.dateOfBirth || baby.DOB);
  const name = baby.name || baby.babyName || "Baby";
  const gender = baby.gender || "Not specified";
  const weight = baby.weight || baby.Weight || "N/A";

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-2xl text-purple-800 dark:text-purple-200">
            <span className="text-3xl">{getGenderEmoji(gender)}</span>
            {name}
          </CardTitle>
          <div className="bg-purple-500 dark:bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {age}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Date of Birth */}
          <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="bg-purple-500 dark:bg-purple-600 p-2 rounded-lg">
              <Cake className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Date of Birth</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{dob}</p>
            </div>
          </div>

          {/* Gender */}
          <div className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <div className="bg-pink-500 dark:bg-pink-600 p-2 rounded-lg">
              <Baby className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Gender</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">{gender}</p>
            </div>
          </div>

          {/* Weight */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="bg-blue-500 dark:bg-blue-600 p-2 rounded-lg">
              <Weight className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Birth Weight</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{weight}</p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span>First Year Progress</span>
            <span>{Math.min(100, Math.floor((new Date() - new Date(baby.dateOfBirth || baby.DOB)) / (365 * 24 * 60 * 60 * 1000) * 100))}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, Math.floor((new Date() - new Date(baby.dateOfBirth || baby.DOB)) / (365 * 24 * 60 * 60 * 1000) * 100))}%` 
              }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
