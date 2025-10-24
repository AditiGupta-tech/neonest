import React, { useState, useEffect } from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";

const FeedingTrendsChart = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    breastfeeding: true,
    bottle: true,
    solidFood: true
  });
  const { token } = useAuth();

  useEffect(() => {
    const fetchFeedingTrends = async () => {
      if (!token) return;

      try {
        const res = await fetch('/api/feeding', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const feedingData = await res.json();
        const feeds = feedingData.feed || [];

        // Group feeds by day for last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();

        const chartData = last7Days.map((date) => {
          const dayFeeds = feeds.filter(feed => {
            const feedDate = new Date(feed.createdAt).toISOString().split('T')[0];
            return feedDate === date;
          });

          // Separate by feeding type
          const breastfeeding = dayFeeds.filter(feed => feed.type === 'breastfeeding').reduce((sum, feed) => {
            // Convert duration to minutes if it's in hours
            const duration = feed.amount || feed.duration || 0;
            const minutes = duration.toString().includes('hour') ? parseFloat(duration) * 60 : parseFloat(duration);
            return sum + minutes;
          }, 0);

          const bottle = dayFeeds.filter(feed => feed.type === 'bottle').reduce((sum, feed) => {
            const amount = parseFloat(feed.amount || 0);
            return sum + amount;
          }, 0);

          const solidFood = dayFeeds.filter(feed => feed.type === 'solid').reduce((sum, feed) => {
            const amount = parseFloat(feed.amount || 0);
            return sum + amount;
          }, 0);

          const dateObj = new Date(date);
          return {
            day: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date,
            breastfeeding,
            bottle,
            solidFood
          };
        });

        setData(chartData);
      } catch (error) {
        console.error('Error fetching feeding trends:', error);
      }
    };

    fetchFeedingTrends();
    const interval = setInterval(fetchFeedingTrends, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [token]);

  // Show chart even with no data - use sample data for demonstration with real dates
  const sampleData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      breastfeeding: 0,
      bottle: 0,
      solidFood: 0
    };
  });

  const chartData = (data.length > 0 ? data : sampleData).map(item => ({
    ...item,
    total: (filters.breastfeeding ? item.breastfeeding : 0) +
           (filters.bottle ? item.bottle : 0) +
           (filters.solidFood ? item.solidFood : 0)
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{`Date: ${label}`}</p>
          {payload.map((entry, index) => {
            if (entry.dataKey === 'total') return null;
            const value = entry.value;
            const unit = entry.dataKey === 'breastfeeding' ? 'min' :
                        entry.dataKey === 'bottle' ? 'ml' : 'cups';
            return (
              <p key={index} style={{ color: entry.color }}>
                {`${entry.name}: ${value} ${unit}`}
              </p>
            );
          })}
          <p className="font-semibold text-gray-900 dark:text-gray-100 border-t pt-1 mt-1">
            {`Total: ${payload.find(p => p.dataKey === 'total')?.value || 0} units`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Feeding Trends (Last 7 Days)</h3>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilters(prev => ({ ...prev, breastfeeding: !prev.breastfeeding }))}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.breastfeeding
              ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          🩷 Breastfeeding
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, bottle: !prev.bottle }))}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.bottle
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          💙 Bottle
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, solidFood: !prev.solidFood }))}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            filters.solidFood
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
          }`}
        >
          💛 Solid Food
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
          <YAxis label={{ value: 'Feeding Activity', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }} />
          <Tooltip content={<CustomTooltip />} />
          {filters.breastfeeding && <Bar dataKey="breastfeeding" stackId="a" fill="#ff69b4" name="Breastfeeding (min)" />}
          {filters.bottle && <Bar dataKey="bottle" stackId="a" fill="#4169e1" name="Bottle (ml)" />}
          {filters.solidFood && <Bar dataKey="solidFood" stackId="a" fill="#ffd700" name="Solid Food (cups)" />}
          <Line type="monotone" dataKey="total" stroke="#333" strokeWidth={2} dot={false} name="Total Trend" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedingTrendsChart;
