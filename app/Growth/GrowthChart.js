// Enhanced WHO Growth Chart with comprehensive guidance and accurate WHO standards
"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { AlertCircle, ExternalLink, Info, TrendingUp, TrendingDown, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

export default function GrowthChart({ defaultMonths = 24 }) {
  const [months, setMonths] = useState(defaultMonths);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailedGuidance, setShowDetailedGuidance] = useState(false);
  const [babyGender, setBabyGender] = useState('');
  const [babyDOB, setBabyDOB] = useState('');
  const [growthEntries, setGrowthEntries] = useState([]);

  // Helper function to calculate age in months more accurately
  const calculateAgeInMonths = (birthDate, measurementDate) => {
    const birth = new Date(birthDate);
    const measurement = new Date(measurementDate);
    
    if (measurement < birth) return -1;
    
    let months = (measurement.getFullYear() - birth.getFullYear()) * 12;
    months += measurement.getMonth() - birth.getMonth();
    
    // Adjust for day of month
    if (measurement.getDate() < birth.getDate()) {
      months--;
    }
    
    return Math.max(0, months);
  };

  // WHO Child Growth Standards - Height/Length for age (50th percentile values) - OFFICIAL WHO DATA
  const getWHOHeight = useCallback((ageMonths, gender) => {
    // Official WHO Child Growth Standards 2006 - Length/Height-for-age (50th percentile in cm)
    const maleHeightData = {
      0: 49.9, 1: 54.7, 2: 58.4, 3: 61.4, 4: 63.9, 5: 65.9, 6: 67.6,
      7: 69.2, 8: 70.6, 9: 72.0, 10: 73.3, 11: 74.5, 12: 75.7,
      13: 77.0, 14: 78.0, 15: 79.1, 16: 80.2, 17: 81.2, 18: 82.3,
      19: 83.2, 20: 84.2, 21: 85.1, 22: 86.0, 23: 86.9, 24: 87.8,
      25: 88.7, 26: 89.6, 27: 90.4, 28: 91.2, 29: 92.0, 30: 92.8,
      31: 93.6, 32: 94.4, 33: 95.1, 34: 95.9, 35: 96.6, 36: 97.4,
      42: 102.0, 48: 106.3, 54: 110.3, 60: 114.0
    };
    
    const femaleHeightData = {
      0: 49.1, 1: 53.7, 2: 57.1, 3: 59.8, 4: 62.1, 5: 64.0, 6: 65.7,
      7: 67.3, 8: 68.7, 9: 70.1, 10: 71.5, 11: 72.8, 12: 74.0,
      13: 75.2, 14: 76.4, 15: 77.5, 16: 78.6, 17: 79.7, 18: 80.7,
      19: 81.7, 20: 82.7, 21: 83.7, 22: 84.6, 23: 85.5, 24: 86.4,
      25: 87.2, 26: 88.1, 27: 88.9, 28: 89.7, 29: 90.5, 30: 91.3,
      31: 92.1, 32: 92.9, 33: 93.6, 34: 94.4, 35: 95.1, 36: 95.9,
      42: 100.3, 48: 104.5, 54: 108.4, 60: 112.2
    };

    const heightData = gender === "male" ? maleHeightData : femaleHeightData;

    // If exact month exists, return it
    if (heightData[ageMonths]) {
      return heightData[ageMonths];
    }

    // Linear interpolation for months not in the table
    const months = Object.keys(heightData).map(Number).sort((a, b) => a - b);
    
    // Find surrounding months
    let lowerMonth = 0;
    let upperMonth = 60;
    
    for (let i = 0; i < months.length - 1; i++) {
      if (ageMonths >= months[i] && ageMonths <= months[i + 1]) {
        lowerMonth = months[i];
        upperMonth = months[i + 1];
        break;
      }
    }
    
    // Handle edge cases
    if (ageMonths <= 0) return heightData[0];
    if (ageMonths >= 60) {
      // Extrapolate beyond 60 months based on WHO growth patterns
      const growthRate = gender === "male" ? 0.5 : 0.45;
      return heightData[60] + ((ageMonths - 60) * growthRate);
    }
    
    // Interpolate between two known values
    const lowerHeight = heightData[lowerMonth];
    const upperHeight = heightData[upperMonth];
    const ratio = (ageMonths - lowerMonth) / (upperMonth - lowerMonth);
    
    return lowerHeight + (ratio * (upperHeight - lowerHeight));
  }, []);

  // WHO Child Growth Standards - Weight for age (50th percentile values) - OFFICIAL WHO DATA
  const getWHOWeight = useCallback((ageMonths, gender) => {
    // Official WHO Child Growth Standards 2006 - Weight-for-age (50th percentile in kg)
    const maleWeightData = {
      0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5, 6: 7.9,
      7: 8.3, 8: 8.6, 9: 8.9, 10: 9.2, 11: 9.4, 12: 9.6,
      13: 9.9, 14: 10.1, 15: 10.3, 16: 10.5, 17: 10.7, 18: 11.0,
      19: 11.2, 20: 11.5, 21: 11.7, 22: 11.9, 23: 12.2, 24: 12.5,
      25: 12.7, 26: 13.0, 27: 13.2, 28: 13.5, 29: 13.7, 30: 13.9,
      31: 14.2, 32: 14.4, 33: 14.7, 34: 14.9, 35: 15.2, 36: 15.4,
      42: 17.0, 48: 18.6, 54: 20.3, 60: 22.0
    };
    
    const femaleWeightData = {
      0: 3.2, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3,
      7: 7.6, 8: 7.9, 9: 8.2, 10: 8.5, 11: 8.7, 12: 8.9,
      13: 9.2, 14: 9.4, 15: 9.6, 16: 9.8, 17: 10.0, 18: 10.2,
      19: 10.4, 20: 10.6, 21: 10.9, 22: 11.1, 23: 11.3, 24: 11.5,
      25: 11.8, 26: 12.0, 27: 12.3, 28: 12.5, 29: 12.7, 30: 13.0,
      31: 13.2, 32: 13.5, 33: 13.7, 34: 14.0, 35: 14.2, 36: 14.5,
      42: 16.0, 48: 17.6, 54: 19.3, 60: 21.0
    };

    const weightData = gender === "male" ? maleWeightData : femaleWeightData;

    if (weightData[ageMonths]) {
      return weightData[ageMonths];
    }

    // Linear interpolation for months not in the table
    const months = Object.keys(weightData).map(Number).sort((a, b) => a - b);
    
    let lowerMonth = 0;
    let upperMonth = 60;
    
    for (let i = 0; i < months.length - 1; i++) {
      if (ageMonths >= months[i] && ageMonths <= months[i + 1]) {
        lowerMonth = months[i];
        upperMonth = months[i + 1];
        break;
      }
    }
    
    if (ageMonths <= 0) return weightData[0];
    if (ageMonths >= 60) {
      // Extrapolate beyond 60 months
      const weightGain = gender === "male" ? 0.25 : 0.22;
      return weightData[60] + ((ageMonths - 60) * weightGain);
    }
    
    const lowerWeight = weightData[lowerMonth];
    const upperWeight = weightData[upperMonth];
    const ratio = (ageMonths - lowerMonth) / (upperMonth - lowerMonth);
    
    return lowerWeight + (ratio * (upperWeight - lowerWeight));
  }, []);

  // Load REAL data from memory (no localStorage to avoid browser compatibility issues)
  const [memoryStorage, setMemoryStorage] = useState({
    growthLogs: [],
    babyDOB: '',
    babyGender: ''
  });

  const loadGrowthData = useCallback(() => {
    try {
      console.log("Loading data from memory:", memoryStorage);
      
      if (memoryStorage.babyDOB) setBabyDOB(memoryStorage.babyDOB);
      if (memoryStorage.babyGender) setBabyGender(memoryStorage.babyGender);

      // Load REAL growth entries (NO DUMMY DATA)
      if (memoryStorage.growthLogs && memoryStorage.babyDOB) {
        const logs = memoryStorage.growthLogs;
        const processedEntries = logs.map(log => {
          const ageMonths = calculateAgeInMonths(memoryStorage.babyDOB, log.date);
          return {
            id: log.id,
            date: log.date,
            height: parseFloat(log.height) || 0,
            weight: parseFloat(log.weight) || 0,
            head: parseFloat(log.head) || 0,
            comment: log.comment || "",
            ageMonths: ageMonths
          };
        }).filter(entry => entry.ageMonths >= 0 && entry.ageMonths <= months);
        
        console.log("Processed real entries:", processedEntries);
        setGrowthEntries(processedEntries);
      } else {
        setGrowthEntries([]);
      }
    } catch (error) {
      console.error("Error loading growth data:", error);
      setGrowthEntries([]);
    }
  }, [months, memoryStorage]);

  // Load data on component mount and when dependencies change
  useEffect(() => {
    loadGrowthData();
  }, [loadGrowthData]);

  // Listen for growth data updates from the parent component
  useEffect(() => {
    const handleGrowthDataUpdate = (event) => {
      console.log("Growth data updated event received:", event.detail);
      setMemoryStorage({
        growthLogs: event.detail.logs || [],
        babyDOB: event.detail.dob || '',
        babyGender: event.detail.gender || ''
      });
    };

    window.addEventListener('growthDataUpdated', handleGrowthDataUpdate);
    
    return () => {
      window.removeEventListener('growthDataUpdated', handleGrowthDataUpdate);
    };
  }, []);

  // Generate chart data using REAL user data ONLY (no dummy data)
  useEffect(() => {
    const generateChartData = () => {
      setLoading(true);
      setError(null);

      try {
        if (!babyGender) {
          setChartData([]);
          setLoading(false);
          return;
        }

        // Create WHO standard data points for all months
        const whoData = [];
        for (let m = 0; m <= months; m++) {
          whoData.push({
            month: m,
            whoHeight: Number(getWHOHeight(m, babyGender).toFixed(1)),
            whoWeight: Number(getWHOWeight(m, babyGender).toFixed(1)),
            actualHeight: null,
            actualWeight: null,
            hasActualData: false
          });
        }

        // Add ONLY REAL user measurements (absolutely no dummy data)
        if (growthEntries.length > 0) {
          growthEntries.forEach(entry => {
            const monthIndex = Math.round(entry.ageMonths);
            if (monthIndex >= 0 && monthIndex < whoData.length) {
              whoData[monthIndex] = {
                ...whoData[monthIndex],
                actualHeight: Number(entry.height.toFixed(1)),
                actualWeight: Number(entry.weight.toFixed(1)),
                hasActualData: true,
                entryDate: entry.date,
                comment: entry.comment
              };
            }
          });
        }

        console.log("Generated chart data with ONLY real user data:", whoData);
        setChartData(whoData);
      } catch (err) {
        console.error("Error generating chart data:", err);
        setError(err.message);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    generateChartData();
  }, [babyGender, growthEntries, months, getWHOHeight, getWHOWeight]);

  // Enhanced validation function with percentile calculations
  const validateGrowth = (actualHeight, actualWeight, whoHeight, whoWeight, ageMonths, gender) => {
    const heightDiff = actualHeight - whoHeight;
    const weightDiff = actualWeight - whoWeight;
    
    const heightPercent = (Math.abs(heightDiff) / whoHeight) * 100;
    const weightPercent = (Math.abs(weightDiff) / whoWeight) * 100;
    
    // More nuanced status determination
    const getDetailedStatus = (actual, expected, percent, type) => {
      const isAbove = actual > expected;
      const genderText = gender === 'male' ? 'boys' : 'girls';
      
      if (percent <= 3) {
        return { 
          status: 'perfect', 
          color: 'text-emerald-600',
          severity: 'excellent',
          percentile: '~50th percentile'
        };
      }
      if (percent <= 8) {
        return { 
          status: 'excellent', 
          color: 'text-green-600',
          severity: 'normal',
          percentile: isAbove ? '50th-75th percentile' : '25th-50th percentile'
        };
      }
      if (percent <= 15) {
        return { 
          status: isAbove ? 'above-normal' : 'below-normal', 
          color: 'text-blue-600',
          severity: 'monitor',
          percentile: isAbove ? '75th-85th percentile' : '15th-25th percentile'
        };
      }
      if (percent <= 25) {
        return { 
          status: isAbove ? 'high-normal' : 'low-normal', 
          color: 'text-yellow-600',
          severity: 'attention',
          percentile: isAbove ? '85th-95th percentile' : '5th-15th percentile'
        };
      }
      if (percent <= 35) {
        return { 
          status: isAbove ? 'concerning-high' : 'concerning-low', 
          color: 'text-orange-600',
          severity: 'concerning',
          percentile: isAbove ? '>95th percentile' : '<5th percentile'
        };
      }
      return { 
        status: isAbove ? 'significantly-high' : 'significantly-low', 
        color: 'text-red-600',
        severity: 'urgent',
        percentile: isAbove ? '>>95th percentile' : '<<5th percentile'
      };
    };

    return {
      heightStatus: getDetailedStatus(actualHeight, whoHeight, heightPercent, 'height'),
      weightStatus: getDetailedStatus(actualWeight, whoWeight, weightPercent, 'weight'),
      heightPercent,
      weightPercent,
      heightDiff,
      weightDiff
    };
  };

  // Comprehensive and specific guidance messages
  const getComprehensiveGuidance = (validation, ageMonths, gender) => {
    if (!validation) return null;
    
    const { heightStatus, weightStatus, heightDiff, weightDiff } = validation;
    const genderText = gender === 'male' ? 'boys' : 'girls';
    const ageText = ageMonths < 12 ? `${ageMonths} months` : `${Math.floor(ageMonths / 12)} years ${ageMonths % 12} months`;
   
    const getSpecificGuidance = (status, measurement, diff, type) => {
      const isHeight = type === 'height';
      const unit = isHeight ? 'cm' : 'kg';
      const measurementName = isHeight ? 'height' : 'weight';
      
      const guidance = {
        'perfect': {
          message: `Your baby's ${measurementName} (${measurement}${unit}) is perfectly aligned with WHO standards for ${genderText} at ${ageText}. This indicates optimal growth conditions.`,
          actions: [
            "Continue current feeding and care routine",
            "Maintain regular pediatric check-ups",
            isHeight ? "Ensure adequate sleep (growth hormone is released during sleep)" : "Keep balanced nutrition with appropriate portions"
          ],
          priority: "maintain",
          icon: "🎯",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'excellent': {
          message: `Your baby's ${measurementName} is excellent and within the healthy WHO range for ${genderText} at ${ageText}. Growth is on track.`,
          actions: [
            "Keep current nutrition and activity patterns",
            "Monitor growth trends over time",
            isHeight ? "Ensure calcium-rich foods and vitamin D" : "Continue age-appropriate feeding schedule"
          ],
          priority: "continue",
          icon: "✅",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'above-normal': {
          message: `Your baby is ${Math.abs(diff).toFixed(1)}${unit} ${diff > 0 ? 'taller' : 'heavier'} than the WHO median for ${genderText} at ${ageText}. This is within normal variation but worth monitoring.`,
          actions: [
            isHeight ? "This often indicates good nutrition or genetic factors" : "Review portion sizes and feeding frequency",
            "Track growth velocity (rate of change) rather than single measurements",
            "Discuss family growth patterns with your pediatrician",
            isHeight ? "Ensure balanced nutrition continues" : "Encourage age-appropriate physical activity"
          ],
          priority: "monitor",
          icon: "📊",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'below-normal': {
          message: `Your baby is ${Math.abs(diff).toFixed(1)}${unit} ${diff < 0 ? 'shorter' : 'lighter'} than the WHO median for ${genderText} at ${ageText}. This may be normal variation but requires attention.`,
          actions: [
            isHeight ? "Evaluate nutrition, especially protein and calcium intake" : "Assess feeding patterns and appetite",
            "Discuss growth velocity with your pediatrician",
            "Consider family growth patterns and genetic factors",
            isHeight ? "Ensure adequate sleep (10-14 hours for toddlers)" : "Rule out feeding difficulties or food sensitivities"
          ],
          priority: "discuss",
          icon: "🔍",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'high-normal': {
          message: `Your baby's ${measurementName} is significantly above average for ${genderText} at ${ageText}. While this can be normal, it warrants professional evaluation.`,
          actions: [
            "Schedule pediatric consultation for comprehensive evaluation",
            isHeight ? "Review family height history and growth patterns" : "Assess caloric intake and eating behaviors",
            "Monitor for other growth-related symptoms",
            isHeight ? "Consider bone age assessment if recommended" : "Evaluate physical activity levels and screen time"
          ],
          priority: "consult",
          icon: "⚠️",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'low-normal': {
          message: `Your baby's ${measurementName} is significantly below average for ${genderText} at ${ageText}. Professional guidance is recommended to ensure healthy development.`,
          actions: [
            "Schedule pediatric consultation within 1-2 weeks",
            isHeight ? "Complete nutritional assessment including micronutrients" : "Evaluate feeding effectiveness and caloric density",
            "Rule out underlying medical conditions",
            isHeight ? "Consider referral to pediatric endocrinologist if indicated" : "Assess for feeding difficulties or gastrointestinal issues"
          ],
          priority: "consult-soon",
          icon: "⚠️",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'concerning-high': {
          message: `Your baby's ${measurementName} is well above WHO standards for ${genderText} at ${ageText}. This requires immediate professional evaluation.`,
          actions: [
            "Contact your pediatrician this week for evaluation",
            isHeight ? "Comprehensive growth hormone and endocrine assessment may be needed" : "Immediate dietary and lifestyle assessment required",
            "Rule out underlying medical conditions",
            "Consider specialist referral (pediatric endocrinologist or nutritionist)"
          ],
          priority: "urgent-consult",
          icon: "🚨",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'concerning-low': {
          message: `Your baby's ${measurementName} is well below WHO standards for ${genderText} at ${ageText}. Immediate professional evaluation is essential.`,
          actions: [
            "Contact your pediatrician immediately (within 24-48 hours)",
            isHeight ? "Comprehensive medical evaluation including growth hormone testing" : "Immediate nutritional intervention and medical assessment",
            "Rule out failure to thrive and underlying conditions",
            "Emergency pediatric specialist referral may be necessary"
          ],
          priority: "immediate",
          icon: "🚨",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'significantly-high': {
          message: `Your baby's ${measurementName} is extremely above WHO standards. This requires IMMEDIATE medical attention.`,
          actions: [
            "Contact your pediatrician TODAY or visit emergency pediatric care",
            "Comprehensive medical evaluation is urgently required",
            "Multiple specialist consultations likely needed",
            "Do not delay - this level of deviation needs immediate assessment"
          ],
          priority: "emergency",
          icon: "🚨",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        },
        'significantly-low': {
          message: `Your baby's ${measurementName} is extremely below WHO standards. This requires IMMEDIATE medical attention.`,
          actions: [
            "Contact your pediatrician TODAY or visit emergency pediatric care",
            "Immediate comprehensive medical evaluation required",
            "Urgent specialist referrals and intervention needed",
            "This level of growth deviation requires emergency assessment"
          ],
          priority: "emergency",
          icon: "🚨",
          whoLink: `https://www.who.int/tools/child-growth-standards/standards/${isHeight ? 'length-height' : 'weight'}-for-age`
        }
      };
      
      return guidance[status.status] || guidance['perfect'];
    };
    
    return {
      height: getSpecificGuidance(heightStatus, validation.actualHeight, heightDiff, 'height'),
      weight: getSpecificGuidance(weightStatus, validation.actualWeight, weightDiff, 'weight')
    };
  };

  // Custom tooltip with enhanced information
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = chartData[label];
      if (data) {
        const validation = data.hasActualData ? 
          validateGrowth(data.actualHeight, data.actualWeight, data.whoHeight, data.whoWeight, label, babyGender) : null;

        return (
          <div className="bg-white p-4 border border-gray-400 rounded-lg shadow-lg text-sm max-w-xs">
            <p className="font-medium text-gray-800 mb-2">{`Age: ${label} months`}</p>
            <div className="space-y-1">
              <p style={{ color: "#FFA500" }}>
                WHO Height: {data.whoHeight} cm
              </p>
              <p style={{ color: "#20B2AA" }}>
                WHO Weight: {data.whoWeight} kg
              </p>
              {data.hasActualData && (
                <>
                  <p style={{ color: "#FF1493" }}>
                    Baby's Height: {data.actualHeight} cm
                  </p>
                  <p style={{ color: "#4169E1" }}>
                    Baby's Weight: {data.actualWeight} kg
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Measured: {data.entryDate}
                  </p>
                  {data.comment && (
                    <p className="text-xs italic text-gray-500">
                      "{data.comment}"
                    </p>
                  )}
                  {validation && (
                    <div className="mt-2 pt-2 border-t">
                      <p className={`text-xs ${validation.heightStatus.color}`}>
                        Height: {validation.heightStatus.percentile}
                      </p>
                      <p className={`text-xs ${validation.weightStatus.color}`}>
                        Weight: {validation.weightStatus.percentile}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-5xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading WHO growth standards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-5xl mx-auto">
        <div className="text-center py-8 text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-4" />
          <p>Error loading chart: {error}</p>
        </div>
      </div>
    );
  }

  // Show message if no baby info is provided
  if (!babyDOB || !babyGender) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm max-w-5xl mx-auto">
        <div className="text-center py-8">
          <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">WHO Growth Standards Chart</h3>
          <p className="text-gray-600 mb-4">
            Please fill in your baby's date of birth and gender above to see the WHO growth comparison.
          </p>
          <div className="text-sm text-gray-500">
            This chart will compare your baby's actual growth measurements with WHO standards.
          </div>
        </div>
      </div>
    );
  }

  const actualDataPoints = chartData.filter(d => d.hasActualData);
  const latestActual = actualDataPoints.length > 0 ? actualDataPoints[actualDataPoints.length - 1] : null;
  
  // Get comprehensive guidance for the latest measurement
  const latestValidation = latestActual ? 
    validateGrowth(latestActual.actualHeight, latestActual.actualWeight, latestActual.whoHeight, latestActual.whoWeight, latestActual.month, babyGender) : null;
  const comprehensiveGuidance = latestValidation ? 
    getComprehensiveGuidance(latestValidation, latestActual.month, babyGender) : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            WHO Growth Standards Comparison
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Based on WHO Child Growth Standards 2006 (50th percentile)
          </p>
          {babyDOB && babyGender && (
            <p className="text-sm text-blue-600 mt-1">
              {babyGender === 'male' ? 'Boy' : 'Girl'} born on {babyDOB} • {actualDataPoints.length} measurements
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Max Age (months):</label>
            <input
              type="number"
              min={6}
              max={60}
              value={months}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 6 && value <= 60) {
                  setMonths(value);
                }
              }}
              className="border px-2 py-1 rounded w-20 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Latest measurement summary with enhanced status indicators */}
      {latestActual && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Latest Measurement Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-600">Age</div>
              <div className="text-lg font-semibold text-blue-600">{latestActual.month} months</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-600">Height Status</div>
              <div className={`text-lg font-semibold ${latestValidation.heightStatus.color}`}>
                {latestActual.actualHeight} cm
              </div>
              <div className="text-xs text-gray-500">WHO: {latestActual.whoHeight} cm</div>
              <div className={`text-xs ${latestValidation.heightStatus.color}`}>
                {latestValidation.heightStatus.percentile}
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-600">Weight Status</div>
              <div className={`text-lg font-semibold ${latestValidation.weightStatus.color}`}>
                {latestActual.actualWeight} kg
              </div>
              <div className="text-xs text-gray-500">WHO: {latestActual.whoWeight} kg</div>
              <div className={`text-xs ${latestValidation.weightStatus.color}`}>
                {latestValidation.weightStatus.percentile}
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-gray-600">Total Entries</div>
              <div className="text-lg font-semibold text-green-600">{actualDataPoints.length}</div>
              {latestValidation.heightStatus.severity === 'urgent' || latestValidation.weightStatus.severity === 'urgent' && (
                <div className="text-xs text-red-600 font-medium">⚠️ Attention Needed</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Guidance Section with WHO Links */}
      {comprehensiveGuidance && (
        <div className="mb-6">
          <button
            onClick={() => setShowDetailedGuidance(!showDetailedGuidance)}
            className={`w-full flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all ${
              latestValidation.heightStatus.severity === 'urgent' || latestValidation.weightStatus.severity === 'urgent' 
                ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
                : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {(latestValidation.heightStatus.severity === 'urgent' || latestValidation.weightStatus.severity === 'urgent') && (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <Info className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-800">
                Comprehensive Growth Analysis & Professional Guidance
              </h3>
            </div>
            {showDetailedGuidance ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {showDetailedGuidance && (
            <div className="mt-4 space-y-4">
              {/* Height Guidance with WHO Link */}
              <div className={`p-4 bg-white border rounded-lg ${
                comprehensiveGuidance.height.priority === 'emergency' || comprehensiveGuidance.height.priority === 'immediate' 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{comprehensiveGuidance.height.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      Height Analysis
                      {comprehensiveGuidance.height.priority === 'emergency' && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">URGENT</span>
                      )}
                    </h4>
                    <p className="text-gray-700 mb-3">{comprehensiveGuidance.height.message}</p>
                    <div className={`p-3 rounded border-l-4 ${
                      comprehensiveGuidance.height.priority === 'emergency' || comprehensiveGuidance.height.priority === 'immediate'
                        ? 'bg-red-50 border-red-400' 
                        : 'bg-blue-50 border-blue-400'
                    }`}>
                      <h5 className="font-semibold text-sm mb-2">Recommended Actions:</h5>
                      <ul className="text-sm space-y-1">
                        {comprehensiveGuidance.height.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <a 
                        href={comprehensiveGuidance.height.whoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Official WHO Height Standards for {babyGender === 'male' ? 'Boys' : 'Girls'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight Guidance with WHO Link */}
              <div className={`p-4 bg-white border rounded-lg ${
                comprehensiveGuidance.weight.priority === 'emergency' || comprehensiveGuidance.weight.priority === 'immediate' 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{comprehensiveGuidance.weight.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      Weight Analysis
                      {comprehensiveGuidance.weight.priority === 'emergency' && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">URGENT</span>
                      )}
                    </h4>
                    <p className="text-gray-700 mb-3">{comprehensiveGuidance.weight.message}</p>
                    <div className={`p-3 rounded border-l-4 ${
                      comprehensiveGuidance.weight.priority === 'emergency' || comprehensiveGuidance.weight.priority === 'immediate'
                        ? 'bg-red-50 border-red-400' 
                        : 'bg-green-50 border-green-400'
                    }`}>
                      <h5 className="font-semibold text-sm mb-2">Recommended Actions:</h5>
                      <ul className="text-sm space-y-1">
                        {comprehensiveGuidance.weight.actions.map((action, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <a 
                        href={comprehensiveGuidance.weight.whoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Official WHO Weight Standards for {babyGender === 'male' ? 'Boys' : 'Girls'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Statistical Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Detailed Statistical Comparison</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <p className="text-gray-600 mb-1">Height Deviation from WHO Median:</p>
                    <p className={`font-medium ${latestValidation.heightStatus.color}`}>
                      {latestValidation.heightDiff > 0 ? '+' : ''}{latestValidation.heightDiff.toFixed(1)} cm 
                      ({latestValidation.heightPercent.toFixed(1)}%)
                    </p>
                    <p className={`text-xs ${latestValidation.heightStatus.color}`}>
                      {latestValidation.heightStatus.percentile}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="text-gray-600 mb-1">Weight Deviation from WHO Median:</p>
                    <p className={`font-medium ${latestValidation.weightStatus.color}`}>
                      {latestValidation.weightDiff > 0 ? '+' : ''}{latestValidation.weightDiff.toFixed(1)} kg 
                      ({latestValidation.weightPercent.toFixed(1)}%)
                    </p>
                    <p className={`text-xs ${latestValidation.weightStatus.color}`}>
                      {latestValidation.weightStatus.percentile}
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-blue-800">
                  <p><strong>Understanding Percentiles:</strong> The 50th percentile represents the median (average). 
                  25th-75th percentile is considered normal range. Below 5th or above 95th percentile may require medical attention.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Growth Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              label={{ value: 'Age (months)', position: 'insideBottom', offset: -20 }}
              height={60}
              type="number"
              domain={[0, months]}
            />
            <YAxis 
              yAxisId="height"
              orientation="left" 
              label={{ value: 'Height (cm)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="weight"
              orientation="right" 
              label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={customTooltip} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px'
              }}
            />
            
            {/* WHO Standard Lines */}
            <Line
              yAxisId="height"
              type="monotone"
              dataKey="whoHeight"
              stroke="#FFA500"
              strokeWidth={2}
              name="WHO Height Standard (50th %ile)"
              dot={false}
              strokeDasharray="5 5"
            />
            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="whoWeight"
              stroke="#20B2AA"
              strokeWidth={2}
              name="WHO Weight Standard (50th %ile)"
              dot={false}
              strokeDasharray="5 5"
            />
            
            {/* Actual Growth Lines - ONLY REAL DATA */}
            <Line
              yAxisId="height"
              type="monotone"
              dataKey="actualHeight"
              stroke="#FF1493"
              strokeWidth={3}
              name="Your Baby's Height"
              dot={{ fill: '#FF1493', strokeWidth: 2, r: 6 }}
              connectNulls={false}
            />
            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="actualWeight"
              stroke="#4169E1"
              strokeWidth={3}
              name="Your Baby's Weight"
              dot={{ fill: '#4169E1', strokeWidth: 2, r: 6 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Show message when no REAL data */}
      {actualDataPoints.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Growth Data Yet</h3>
          <p className="text-gray-500">
            Add some growth measurements above to see your baby's progress compared to WHO standards.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Only real measurements will be displayed - no dummy data.
          </p>
        </div>
      )}

      {/* Enhanced Educational Note with Multiple WHO Links */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">About WHO Growth Standards</h3>
        <p className="text-xs text-yellow-700 mb-3">
          The WHO Child Growth Standards describe how children should grow under optimal conditions. 
          These charts show the 50th percentile (median) values based on data from healthy, breastfed children 
          from diverse populations worldwide. Normal growth typically falls within the 3rd to 97th percentiles.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <a 
            href="https://www.who.int/tools/child-growth-standards"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900 underline"
          >
            <ExternalLink className="w-3 h-3" />
            WHO Growth Standards Overview
          </a>
          <a 
            href={`https://www.who.int/tools/child-growth-standards/standards/length-height-for-age`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900 underline"
          >
            <ExternalLink className="w-3 h-3" />
            Height Standards by Age
          </a>
          <a 
            href={`https://www.who.int/tools/child-growth-standards/standards/weight-for-age`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-yellow-700 hover:text-yellow-900 underline"
          >
            <ExternalLink className="w-3 h-3" />
            Weight Standards by Age
          </a>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t text-xs text-gray-500 text-center">
        <p className="mb-2">
          This chart uses official WHO Child Growth Standards 2006 and is for educational purposes only. 
          It should not replace professional medical advice or diagnosis.
        </p>
        <p>
          Always consult with your pediatrician for personalized guidance on your baby's growth and development.
          In case of concerning measurements, seek professional medical evaluation promptly.
        </p>
      </div>
    </div>
  );
}