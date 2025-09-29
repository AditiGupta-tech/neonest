
"use client";
import React, { useState } from 'react';

export default function SmartCareCard({ icon, title, data }) {
  const [feedback, setFeedback] = useState(null);
  return (
  <div className="bg-white text-black dark:bg-gray-900 dark:text-white rounded-xl shadow p-4 flex flex-col gap-2 min-h-[180px]">
      <div className="flex items-center gap-2 text-lg font-bold dark:text-white">
        <span className="text-2xl">{icon}</span>
        <span>{title}</span>
        <span className="ml-auto text-xs text-gray-500 dark:text-gray-300" suppressHydrationWarning={true}>Confidence: <span className="font-bold">{data.confidence}%</span></span>
      </div>
      <div className="flex-1 text-sm py-2">
        {title === 'Feeding' && (
          <div suppressHydrationWarning={true} className="text-gray-700 dark:text-gray-300">Next feed in: <span className="font-bold">{data.nextFeedTime}</span></div>
        )}
        {title === 'Sleep' && (
          <div suppressHydrationWarning={true} className="text-gray-700 dark:text-gray-300">
            Next nap: <span className="font-bold">{data.nextNapTime}</span><br/>
            Bedtime window: <span className="font-bold">{data.bedtimeWindow}</span>
          </div>
        )}
        {title === 'Growth' && (
          <div suppressHydrationWarning={true} className="text-gray-700 dark:text-gray-300">
            Percentile: <span className="font-bold">{data.percentile}</span><br/>
            Tips: <span className="italic">{data.tips}</span>
          </div>
        )}
        {title === 'Recommendation' && (
          <div suppressHydrationWarning={true} className="text-gray-700 dark:text-gray-300">{data.message}</div>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <button
          className={`px-2 py-1 rounded bg-green-100 hover:bg-green-200 text-green-700 text-xs ${feedback==='up'?'ring-2 ring-green-400':''}`}
          onClick={() => setFeedback('up')}
        >👍</button>
        <button
          className={`px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs ${feedback==='down'?'ring-2 ring-red-400':''}`}
          onClick={() => setFeedback('down')}
        >👎</button>
      </div>
    </div>
  );
}
