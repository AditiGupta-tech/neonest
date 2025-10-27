"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Baby } from "lucide-react";

export default function GrowthChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestGrowth, setLatestGrowth] = useState(null);

  useEffect(() => {
    fetchGrowthData();
  }, []);

  const fetchGrowthData = () => {
    try {
      // Load from localStorage (same as Growth page)
      const savedLogs = localStorage.getItem("growthLogs");
      if (savedLogs) {
        const logs = JSON.parse(savedLogs);
        
        // Sort by date
        const sortedLogs = logs.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Format for chart
        const formattedData = sortedLogs.map(log => ({
          date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          Height: log.height,
          Weight: log.weight,
          fullDate: log.date
        }));

        setChartData(formattedData);
        
        // Get latest entry
        if (sortedLogs.length > 0) {
          setLatestGrowth(sortedLogs[sortedLogs.length - 1]);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading growth data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
            <div className="h-80 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData.length > 0;

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-none shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span className="text-gray-800 dark:text-gray-100">Growth Tracking (Height & Weight)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'Height') return [`${value} cm`, name];
                    if (name === 'Weight') return [`${value} kg`, name];
                    return [value, name];
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="Height" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="Weight" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {latestGrowth && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Latest Height</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {latestGrowth.height} cm
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Latest Weight</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
                    {latestGrowth.weight} kg
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 col-span-2 md:col-span-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {new Date(latestGrowth.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 bg-gradient-to-r from-green-50 to-amber-50 dark:from-green-900/10 dark:to-amber-900/10 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold">💡 Tip:</span> Regular growth tracking helps monitor your baby's development. Visit the Growth page for detailed WHO comparisons.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Baby className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No growth data yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Start tracking your baby's height and weight
            </p>
            <a 
              href="/Growth" 
              className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium"
            >
              Go to Growth Tracker
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
