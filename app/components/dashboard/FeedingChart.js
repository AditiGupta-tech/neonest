"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Utensils, TrendingUp } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { generateDemoFeedingData, enrichWithDemoData } from "../../utils/demoData";

export default function FeedingChart() {
  const { token } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedingData();
  }, []);

  const fetchFeedingData = async () => {
    try {
      let feedings = [];
      
      if (token) {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get("/api/feeding", { headers });
          feedings = response.data.feed || [];
        } catch (err) {
          console.log("Using demo data for feeding");
        }
      }
      
      // If no data or insufficient data, use demo data
      if (feedings.length < 10) {
        const demoData = generateDemoFeedingData();
        feedings = enrichWithDemoData(feedings, demoData, 50);
      }

      // Get last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      // Count feedings by type for each day
      const dataByDay = last7Days.map(date => {
        const dayFeedings = feedings.filter(f => {
          const feedDate = new Date(f.createdAt || f.time).toISOString().split('T')[0];
          return feedDate === date;
        });

        const breastfeeding = dayFeedings.filter(f => f.type === "Breastfeeding").length;
        const bottle = dayFeedings.filter(f => f.type === "Bottle").length;
        const solidFood = dayFeedings.filter(f => f.type === "Solid Food").length;

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          Breastfeeding: breastfeeding,
          Bottle: bottle,
          "Solid Food": solidFood,
          total: breastfeeding + bottle + solidFood
        };
      });

      setChartData(dataByDay);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feeding data:", error);
      setChartData([]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData.some(d => d.total > 0);

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Utensils className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          <span className="text-gray-800 dark:text-gray-100">Feeding Trends (Last 7 Days)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Bar dataKey="Breastfeeding" fill="#ec4899" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Bottle" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Solid Food" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">Breastfeeding</p>
                <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {chartData.reduce((sum, d) => sum + d.Breastfeeding, 0)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">Bottle</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {chartData.reduce((sum, d) => sum + d.Bottle, 0)}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                <p className="text-xs text-gray-600 dark:text-gray-400">Solid Food</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {chartData.reduce((sum, d) => sum + d["Solid Food"], 0)}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No feeding data yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Start logging feedings to see trends
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
