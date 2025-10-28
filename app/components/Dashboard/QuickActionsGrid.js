"use client";

import Link from "next/link";
import { 
  Utensils, 
  Moon, 
  Activity, 
  Shield, 
  Package, 
  Camera, 
  Blocks,
  Music,
  Heart,
  BarChart3
} from "lucide-react";
import { Card, CardContent } from "../ui/card";

const quickActions = [
  {
    title: "Feeding",
    description: "Track feeding schedules",
    icon: Utensils,
    href: "/Feeding",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    title: "Sleep",
    description: "Monitor sleep patterns",
    icon: Moon,
    href: "/Sleep",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Growth",
    description: "Track growth milestones",
    icon: Activity,
    href: "/Growth",
    color: "from-green-400 to-teal-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Medical",
    description: "Vaccines & health records",
    icon: Shield,
    href: "/Medical",
    color: "from-red-400 to-pink-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
  {
    title: "Essentials",
    description: "Baby supplies tracker",
    icon: Package,
    href: "/Essentials",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Memories",
    description: "Capture precious moments",
    icon: Camera,
    href: "/Memories",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  {
    title: "Toys",
    description: "Age-appropriate toys",
    icon: Blocks,
    href: "/Toys",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  {
    title: "Lullabies",
    description: "Soothing music & sounds",
    icon: Music,
    href: "/Lullaby",
    color: "from-cyan-400 to-blue-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
  },
];

export default function QuickActionsGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href}>
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 bg-white dark:bg-gray-800 h-full">
                <CardContent className="p-6">
                  <div className={`${action.bgColor} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
