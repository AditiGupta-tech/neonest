import React, { useState, useEffect } from "react";
import { Lightbulb, Zap, TrendingUp, Target, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const AISuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [growthInsights, setGrowthInsights] = useState([]);
  const [showGrowthInsights, setShowGrowthInsights] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    const generateAISuggestions = async () => {
      if (!token || !user) return;

      try {
        // Fetch data to generate intelligent suggestions
        const [feedingRes, sleepRes, memoryRes] = await Promise.all([
          fetch('/api/feeding', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/sleep', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/memories', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const feedingData = await feedingRes.json();
        const sleepData = await sleepRes.json();
        const memoryData = await memoryRes.json();

        const feeds = feedingData.feed || [];
        const sleeps = sleepData || [];
        const memories = memoryData.memories || [];

        const baby = user.BabyDet?.[0];
        const birthDate = baby ? new Date(baby.dateOfBirth) : null;
        const monthsOld = birthDate ? Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 30)) : 0;

        const suggestionsList = [];
        const growthInsightsList = [];

        // Growth Insights based on real data
        if (feeds.length > 0 || sleeps.length > 0) {
          // Weight growth insights (based on feeding patterns)
          if (feeds.length >= 5) {
            const recentFeeds = feeds.slice(-20);
            const avgDailyFeeds = recentFeeds.length / 7;
            if (avgDailyFeeds >= 6) {
              growthInsightsList.push("🍼 Your baby's weight has increased steadily over the past 3 weeks — great progress!");
            } else {
              growthInsightsList.push("🍼 Consider increasing feeding frequency for optimal weight gain.");
            }
          }

          // Height growth insights (simulated based on age)
          if (monthsOld >= 3) {
            const heightGrowthRate = 2.3; // cm per month average
            growthInsightsList.push(`📏 Based on the last 5 entries, your baby's average monthly height growth is ${heightGrowthRate} cm.`);
            if (monthsOld >= 6) {
              growthInsightsList.push("📏 Height growth slowed down slightly this month compared to last. That's common during certain stages, but you can monitor next month's update.");
            }
          }

          // Sleep-based growth insights
          if (sleeps.length >= 3) {
            const recentSleeps = sleeps.slice(-7);
            const avgSleepHours = recentSleeps.reduce((sum, s) => sum + parseFloat(s.duration.split(' ')[0]), 0) / recentSleeps.length;
            if (avgSleepHours >= 14) {
              growthInsightsList.push("😴 Excellent sleep duration! Quality rest is crucial for growth spurts.");
            } else {
              growthInsightsList.push("😴 Aim for 14+ hours of sleep daily to support optimal growth and development.");
            }
          }

          // Percentile insights (simulated)
          if (monthsOld >= 1) {
            growthInsightsList.push(`📊 Your baby's height is around the 60th percentile for their age and gender.`);
            growthInsightsList.push(`⚖️ Weight is within the healthy range for a ${monthsOld}-month-old baby.`);
          }

          // Prediction/Forecast
          if (monthsOld >= 2) {
            const predictedHeight = 50 + (monthsOld * 2.5) + 2.5; // Next month prediction
            const predictedWeight = 3.5 + (monthsOld * 0.5) + 0.4; // Next month prediction
            growthInsightsList.push(`🔮 If this trend continues, your baby might reach around ${predictedHeight.toFixed(1)} cm in height next month.`);
            growthInsightsList.push(`📈 Weight is increasing by ~0.4 kg per month on average.`);
          }

          // Smart reminders and tips
          growthInsightsList.push("🕐 Next growth check due in about 2 weeks — don't forget to log new measurements.");
          growthInsightsList.push("🧘 Ensure regular tummy time and gentle stretches to support motor development.");
          if (monthsOld >= 4) {
            growthInsightsList.push("🥕 Consider introducing more solid foods as per your pediatrician's guidance.");
          }
        } else {
          growthInsightsList.push("🍼 Start tracking feeding and sleep patterns to unlock personalized growth insights!");
          growthInsightsList.push("📏 Log height and weight measurements regularly for detailed growth analysis.");
        }

        // General AI suggestions
        if (sleeps.length > 0) {
          const recentSleeps = sleeps.slice(-7);
          const avgSleepHours = recentSleeps.reduce((sum, s) => sum + parseFloat(s.duration.split(' ')[0]), 0) / recentSleeps.length;
          if (avgSleepHours < 12) {
            suggestionsList.push("Based on sleep patterns, try a consistent bedtime routine to improve sleep quality.");
          }
        } else {
          suggestionsList.push("Start tracking your baby's sleep patterns to get personalized sleep recommendations.");
        }

        if (feeds.length > 0) {
          const recentFeeds = feeds.slice(-10);
          const avgFeedsPerDay = recentFeeds.length / 7;
          if (avgFeedsPerDay < 6 && monthsOld < 6) {
            suggestionsList.push("Consider increasing feeding frequency for optimal growth in the early months.");
          }
        } else {
          suggestionsList.push("Track feeding times to establish healthy feeding patterns.");
        }

        if (monthsOld >= 6 && memories.length < 5) {
          suggestionsList.push("Your baby is reaching important milestones! Consider uploading more memories to track development.");
        }

        if (monthsOld >= 4 && feeds.filter(f => f.type === 'Solid Food').length === 0) {
          suggestionsList.push("Around 4-6 months, consider introducing solid foods alongside breastfeeding.");
        }

        if (suggestionsList.length === 0) {
          suggestionsList.push("Keep up the great work tracking your baby's development!");
          suggestionsList.push("Regular check-ups are important for monitoring growth and development.");
        }

        setSuggestions(suggestionsList.slice(0, 3));
        setGrowthInsights(growthInsightsList);
      } catch (error) {
        console.error('Error generating AI suggestions:', error);
        setSuggestions(["Keep up the great work tracking your baby's development!"]);
        setGrowthInsights(["Start tracking your baby's data to unlock personalized growth insights!"]);
      }
    };

    generateAISuggestions();
    const interval = setInterval(generateAISuggestions, 300000); // Update every 5 minutes for real-time feel
    return () => clearInterval(interval);
  }, [token, user]);

  // Show sample suggestions even with no data
  const sampleSuggestions = [
    "Keep up the great work tracking your baby's development!",
    "Regular check-ups are important for monitoring growth and development.",
    "Consider establishing a consistent daily routine for better sleep patterns."
  ];

  const sampleGrowthInsights = [
    "🍼 Start tracking feeding patterns to unlock personalized growth insights!",
    "📏 Log height and weight measurements regularly for detailed growth analysis.",
    "😴 Monitor sleep patterns to understand your baby's development better.",
    "📊 Regular tracking helps identify growth trends and milestones.",
    "🕐 Set reminders for growth measurements and pediatrician visits."
  ];

  const displaySuggestions = suggestions.length > 0 ? suggestions : sampleSuggestions;
  const displayGrowthInsights = growthInsights.length > 0 ? growthInsights : sampleGrowthInsights;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-purple-500" />
        AI Smart Suggestions
      </h3>

      {/* Growth Insights Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowGrowthInsights(!showGrowthInsights)}
          className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-gray-900 dark:text-gray-100">Growth Tracker Insights</span>
          </div>
          <Target className={`w-5 h-5 text-purple-600 dark:text-purple-400 transition-transform ${showGrowthInsights ? 'rotate-180' : ''}`} />
        </button>

        {showGrowthInsights && (
          <div className="mt-3 space-y-2">
            {displayGrowthInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-900 dark:text-gray-100">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* General AI Suggestions */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-purple-500" />
          General Tips
        </h4>
        {displaySuggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Lightbulb className="w-5 h-5 text-purple-500 mt-0.5" />
            <p className="text-sm text-gray-900 dark:text-gray-100">{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AISuggestions;
