import React, { useState, useEffect } from "react";
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "../context/AuthContext";

const GrowthTrackingChart = () => {
  const [data, setData] = useState([]);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchGrowthData = async () => {
      if (!token || !user) return;

      try {
        // For now, we'll use the baby's birth date from user data
        // In a real app, you'd have a separate growth tracking API
        const baby = user.BabyDet?.[0];
        if (!baby) return;

        const birthDate = new Date(baby.dateOfBirth);
        const currentDate = new Date();
        const monthsSinceBirth = Math.floor((currentDate - birthDate) / (1000 * 60 * 60 * 24 * 30));

        // Generate growth data based on typical baby growth patterns
        const growthData = [];
        for (let month = 1; month <= Math.min(monthsSinceBirth, 12); month++) {
          // Approximate growth: height increases ~2.5cm/month, weight ~0.5kg/month
          const height = 50 + (month - 1) * 2.5;
          const weight = 3.5 + (month - 1) * 0.5;
          const date = new Date(birthDate);
          date.setMonth(date.getMonth() + month);
          growthData.push({
            age: `${month} month${month > 1 ? 's' : ''}`,
            fullDate: date.toISOString().split('T')[0],
            height: Math.round(height),
            weight: Math.round(weight * 10) / 10
          });
        }

        setData(growthData);
      } catch (error) {
        console.error('Error fetching growth data:', error);
      }
    };

    fetchGrowthData();
    const interval = setInterval(fetchGrowthData, 86400000); // Update daily
    return () => clearInterval(interval);
  }, [token, user]);

  // Show chart even with no data - use sample data for demonstration with age
  const sampleData = Array.from({ length: 24 }, (_, i) => {
    const month = i + 1;
    return {
      age: `${month} month${month > 1 ? 's' : ''}`,
      fullDate: new Date().toISOString().split('T')[0],
      height: 0,
      weight: 0
    };
  });

  const chartData = data.length > 0 ? data : sampleData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{`Age: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} ${entry.dataKey === 'height' ? 'cm' : 'kg'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Growth Tracking (Height & Weight vs age)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="age"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            fontSize={12}
          />
          <YAxis yAxisId="height" orientation="left" label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }} />
          <YAxis yAxisId="weight" orientation="right" label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight', style: { fontWeight: 'bold' } }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line yAxisId="height" type="monotone" dataKey="height" stroke="#2563eb" strokeWidth={3} name="Height (cm)" />
          <Line yAxisId="weight" type="monotone" dataKey="weight" stroke="#16a34a" strokeWidth={3} name="Weight (kg)" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthTrackingChart;
