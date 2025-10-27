"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Moon, TrendingUp } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function SleepChart() {
  const { token } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avgSleep, setAvgSleep] = useState(0);

  useEffect(() => {
    fetchSleepData();
  }, []);

  const parseDuration = (duration) => {
    if (!duration) return 0;
    const hours = parseFloat(duration.match(/(\d+\.?\d*)\s*(hr|hour)/i)?.[1] || 0);
    const mins = parseFloat(duration.match(/(\d+)\s*(min|minute)/i)?.[1] || 0);
    return hours + (mins / 60);
  };

  const fetchSleepData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get("/api/sleep", { headers });
      const sleepLogs = response.data || [];

      // Get last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
      }

      // Calculate total sleep hours per day
      const dataByDay = last7Days.map(date => {
        const daySleep = sleepLogs.filter(s => s.date === date);
        
        const totalHours = daySleep.reduce((sum, s) => {
          return sum + parseDuration(s.duration);
        }, 0);

        const napHours = daySleep
          .filter(s => s.type === "nap")
          .reduce((sum, s) => sum + parseDuration(s.duration), 0);

        const nightHours = daySleep
          .filter(s => s.type === "night")
          .reduce((sum, s) => sum + parseDuration(s.duration), 0);

        return {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          "Total Sleep": parseFloat(totalHours.toFixed(1)),
          "Nap": parseFloat(napHours.toFixed(1)),
          "Night Sleep": parseFloat(nightHours.toFixed(1))
        };
      });

      setChartData(dataByDay);
      
      // Calculate average
      const totalSleep = dataByDay.reduce((sum, d) => sum + d["Total Sleep"], 0);
      const avg = dataByDay.length > 0 ? totalSleep / dataByDay.length : 0;
      setAvgSleep(avg);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
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

  const hasData = chartData.some(d => d["Total Sleep"] > 0);

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-gray-800 dark:text-gray-100">Sleep Duration (Last 7 Days)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value} hrs`, '']}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="Total Sleep" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Nap" 
                  stroke="#fbbf24" 
                  strokeWidth={2}
                  dot={{ fill: '#fbbf24', r: 3 }}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="Night Sleep" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', r: 3 }}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">7-Day Average</p>
                </div>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {avgSleep.toFixed(1)} hrs
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Moon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sleep Quality</p>
                </div>
                <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                  {avgSleep >= 12 ? "Excellent" : avgSleep >= 10 ? "Good" : "Monitor"}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Moon className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No sleep data yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Start logging sleep to see patterns
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
