"use client";
import React, { useState, useEffect, useRef } from "react";
import { Lock, PlusCircle, PartyPopper, Check, MinusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../components/ui/Button";

const defaultMilestones = {
  "0": ["Lifts head", "Responds to sound"],
  "1": ["Smiles at people", "Follows objects"],
  "2": ["Rolls over", "Holds head steady"],
  "3": ["Sits without support", "Pushes down on legs"],
};

const getMonthDiff = (dob) => {
  const now = new Date();
  const birth = new Date(dob);
  return Math.max(0, Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 30.44)));
};

export default function MilestoneTracker({ babyDOB }) {
  const [milestones, setMilestones] = useState(defaultMilestones);
  const [completed, setCompleted] = useState({});
  const [visibleMonth, setVisibleMonth] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [activeAddInput, setActiveAddInput] = useState(null);
  const [newMilestone, setNewMilestone] = useState("");

  const cardRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (babyDOB) {
      const month = getMonthDiff(babyDOB);
      setCurrentMonth(month);
      setVisibleMonth(month);
    }
  }, [babyDOB]);

  useEffect(() => {
    scrollToCard(visibleMonth);
  }, [visibleMonth]);

  const toggleComplete = (month, milestone) => {
    const key = `${month}:${milestone}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAdd = (month) => {
    if (newMilestone.trim()) {
      setMilestones((prev) => ({
        ...prev,
        [month]: [...(prev[month] || []), newMilestone.trim()],
      }));
      setNewMilestone("");
      setActiveAddInput(null);
    }
  };

  const handleDelete = (month, milestone) => {
    setMilestones((prev) => ({
      ...prev,
      [month]: prev[month].filter((m) => m !== milestone),
    }));
  };

  const scrollToCard = (index) => {
    if (cardRefs.current[index]) {
      cardRefs.current[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setVisibleMonth(index);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 min-h-screen p-4">
      <div className="relative">
        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-6 py-8 px-4 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {Array.from({ length: 12 }).map((_, i) => {
            const isCurrent = i === visibleMonth;
            const isPast = i < currentMonth;
            const monthMilestones = milestones[i] || [];
            const completedAll = monthMilestones.every((m) => completed[`${i}:${m}`]);
            const showRedAlert = isPast && !completedAll;

            return (
              <div
                ref={(el) => (cardRefs.current[i] = el)}
                key={i}
                onClick={() => {
                  if (visibleMonth !== i) scrollToCard(i);
                }}
                className={`
                  min-w-[280px] sm:min-w-[320px] md:min-w-[340px]
                  rounded-3xl p-6 transition-all duration-500 
                  cursor-pointer snap-start backdrop-blur-sm
                  relative flex flex-col justify-between
                  shadow-lg hover:shadow-2xl
                  ${isCurrent ? "scale-110 mx-4 z-20" : "scale-95 hover:scale-100"}
                  ${i === visibleMonth && i === currentMonth
                    ? "bg-gradient-to-br from-pink-200 via-purple-200 to-pink-300 border-2 border-pink-400 ring-4 ring-pink-300/50"
                    : i === visibleMonth
                      ? "bg-gradient-to-br from-white via-pink-50 to-purple-50 border-2 border-purple-300 ring-2 ring-purple-200/50"
                      : showRedAlert
                        ? "bg-gradient-to-br from-red-100 via-pink-100 to-red-50 border-2 border-red-300"
                        : i === currentMonth
                          ? "bg-gradient-to-br from-purple-100 via-pink-100 to-purple-50 border-2 border-purple-300"
                          : isPast
                            ? "bg-gradient-to-br from-purple-50 via-pink-50 to-white border border-purple-200 opacity-80"
                            : "bg-gradient-to-br from-gray-50 via-white to-gray-50 border border-gray-200 opacity-60"}
                `}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-pink-700 to-purple-700 bg-clip-text text-transparent">
                      Month {i + 1}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {monthMilestones.map((m) => (
                      <div
                        key={m}
                        className={`
                          flex items-center justify-between gap-3 p-3 rounded-2xl
                          transition-all duration-300 group hover:bg-white/50
                          ${completed[`${i}:${m}`] 
                            ? "bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200" 
                            : "bg-white/30 border border-white/50"}
                        `}
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1"
                          onClick={() => (i <= currentMonth) && toggleComplete(i, m)}
                        >
                          <div className={`
                            w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center
                            ${completed[`${i}:${m}`] 
                              ? "bg-gradient-to-r from-green-400 to-emerald-400" 
                              : "bg-gradient-to-r from-pink-400 to-purple-400"}
                          `}>
                            {completed[`${i}:${m}`] && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className={`
                            text-sm font-medium transition-all duration-300
                            ${completed[`${i}:${m}`] 
                              ? "text-green-700 line-through" 
                              : "text-gray-700"}
                          `}>
                            {m}
                          </span>
                        </div>
                        {i <= currentMonth && (
                          <button
                            className="text-red-400 hover:text-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 p-1 rounded-full hover:bg-red-50"
                            onClick={() => handleDelete(i, m)}
                          >
                            <MinusCircle size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {activeAddInput === i && (
                    <div className="mt-4 p-3 bg-white/50 rounded-2xl border border-white/70">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Enter new milestone..."
                          className="flex-1 text-sm px-3 py-2 bg-white border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 placeholder-gray-400"
                          value={newMilestone}
                          onChange={(e) => setNewMilestone(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAdd(i);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleAdd(i)}
                          className="text-green-500 hover:text-green-700 transition-all duration-200 p-1 rounded-full hover:bg-green-50 hover:scale-110"
                        >
                          <Check size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  {i === currentMonth && activeAddInput !== i && (
                    <div className="mb-4">
                      <Button
                        onClick={() => setActiveAddInput(i)}
                        variant="ghost"
                        className="text-purple-600 hover:text-purple-800 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 border border-purple-200 hover:border-purple-300 w-full"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" /> 
                        Add Milestone
                      </Button>
                    </div>
                  )}

                  {i > currentMonth && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/20 backdrop-blur-sm rounded-3xl">
                      <Lock className="w-12 h-12 text-gray-400 opacity-60 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">Coming Soon</span>
                    </div>
                  )}

                  {i < currentMonth && completedAll && (
                    <div className="absolute inset-0 flex justify-center items-center bg-white/5 backdrop-blur-sm rounded-3xl pointer-events-none">
                      <PartyPopper className="w-16 h-16 text-purple-600 opacity-70 animate-bounce" />
                    </div>
                  )}

                  {i < currentMonth && !completedAll && (
                    <div className="bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-xl p-3">
                      <Link
                        href="/NeonestAi"
                        className="text-sm text-orange-700 hover:text-red-700 hover:underline font-medium w-full text-left transition-colors duration-200"
                      >    
                          ⚠ Ask Chatbot about milestone delay?
                      </Link>
                    </div>
                  )}

                  <div className="flex justify-center mt-4 gap-2">
                    {monthMilestones.map((m, d) => (
                      <div
                        key={d}
                        title={`${m} - ${completed[`${i}:${m}`] ? "Completed" : "Pending"}`}
                        className={`
                          w-3 h-3 rounded-full transition-all duration-500 hover:scale-125
                          ${completed[`${i}:${m}`] 
                            ? "bg-gradient-to-r from-green-400 to-emerald-400 shadow-md" 
                            : "bg-gradient-to-r from-gray-300 to-gray-400"}
                        `}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <button
            key={i}
            className={`
              w-4 h-4 rounded-full transition-all duration-300 hover:scale-125
              ${i === visibleMonth 
                ? "bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg ring-2 ring-pink-300" 
                : "bg-gradient-to-r from-gray-300 to-gray-400 hover:from-pink-300 hover:to-purple-300"}
            `}
            onClick={() => scrollToCard(i)}
          />
        ))}
      </div>

      <div className="text-center mt-8 text-gray-500 text-sm">
        Celebrating every little achievement 💕
      </div>
    </div>
  );
}