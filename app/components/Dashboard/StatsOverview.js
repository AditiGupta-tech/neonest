"use client";

import { Utensils, Moon, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function StatsOverview({ stats }) {
  const statCards = [
    {
      title: "Total Feedings",
      value: stats.totalFeedings,
      icon: Utensils,
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      change: "+12 this week",
    },
    {
      title: "Avg Sleep Hours",
      value: `${stats.avgSleepHours}h`,
      icon: Moon,
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+0.5h from last week",
    },
    {
      title: "Vaccines Done",
      value: `${stats.vaccinesCompleted}/8`,
      icon: Shield,
      color: "from-green-400 to-teal-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      change: "On schedule",
    },
    {
      title: "Milestones",
      value: stats.milestones,
      icon: TrendingUp,
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "2 new this month",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Statistics Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="hover:shadow-lg transition-shadow duration-300 border-2 border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
