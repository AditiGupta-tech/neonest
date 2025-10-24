import React, { useState, useEffect } from "react";
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";

const SleepDurationsChart = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    night: true,
    nap: true
  });
  const { token } = useAuth();

  useEffect(() => {
    const fetchSleepDurations = async () => {
      if (!token) return;

      try {
        const res = await fetch('/api/sleep', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sleepData = await res.json();
        const sleeps = sleepData || [];

        // Group sleep by day for last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const chartData = last7Days.map((date, index) => {
          const daySleeps = sleeps.filter(sleep => {
            const sleepDate = new Date(sleep.date).toISOString().split('T')[0];
            return sleepDate === date;
          });

          const nightSleep = daySleeps.filter(sleep => sleep.type === 'night').reduce((sum, sleep) => {
            const duration = parseFloat(sleep.duration.split(' ')[0]); // Extract number from "8 hours"
            return sum + duration;
          }, 0);

          const napSleep = daySleeps.filter(sleep => sleep.type === 'nap').reduce((sum, sleep) => {
            const duration = parseFloat(sleep.duration.split(' ')[0]); // Extract number from "8 hours"
            return sum + duration;
          }, 0);

          const dateObj = new Date(date);
          return {
            day: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date,
            night: nightSleep,
            nap: napSleep
          };
        });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching sleep durations:', error);
      }
    };

    fetchSleepDurations();
    const interval = setInterval(fetchSleepDurations, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [token]);

  // Show chart even with no data - use sample data for demonstration with real dates
  const sampleData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      night: 0,
      nap: 0
    };
  });

  const chartData = (data.length > 0 ? data : sampleData).map(item => ({
    ...item,
    total: (filters.night ? item.night : 0) + (filters.nap ? item.nap : 0)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{`Date: ${label}`}</p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'total') return null;
            const value = entry.value;
            return (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${value} hours`}
              </p>
            );
          })}
          <p className="font-semibold text-gray-900 dark:text-gray-100 border-t pt-1 mt-1">
            {`Total: ${payload.find(p => p.dataKey === 'total')?.value || 0} hours`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sleep Duration Trends (Last 7 Days)</h3>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilters(prev => ({ ...prev, night: !prev.night }))}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.night
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          🌙 Night Sleep
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, nap: !prev.nap }))}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.nap
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          😴 Nap
        </button>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="day"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            fontSize={12}
          />
          <YAxis label={{ value: 'Sleep Duration', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }} />
          <Tooltip content={<CustomTooltip />} />
          {filters.night && <Line type="monotone" dataKey="night" stroke="#3b82f6" strokeWidth={3} name="Night Sleep" />}
          {filters.nap && <Line type="monotone" dataKey="nap" stroke="#eab308" strokeWidth={3} name="Nap" />}
          <Line type="monotone" dataKey="total" stroke="#333" strokeWidth={2} dot={false} name="Total Sleep Trend" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepDurationsChart;
