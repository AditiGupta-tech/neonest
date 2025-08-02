"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lock, PlusCircle, PartyPopper, Check, MinusCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import Link from "next/link";

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
    <div className="w-full">
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-4 py-4 px-2 scroll-smooth snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {Array.from({ length: 12 }).map((_, i) => {
          const isCurrent = i === visibleMonth;
          const isPast = i < currentMonth;
          const isFuture = i > currentMonth;
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
              className={`min-w-[250px] sm:min-w-[300px] rounded-xl p-4 transition-all duration-300 shadow-md relative flex flex-col justify-between border-2 snap-start ${isCurrent ? "scale-110 mx-2" : "scale-100"} ${
                i === visibleMonth && i === currentMonth
                  ? "bg-purple-200 border-purple-500 scale-110 ring-2 ring-purple-500 z-10"
                  : i === visibleMonth
                    ? "bg-white border-purple-300 scale-105 ring-1 ring-purple-300 z-10"
                    : showRedAlert
                      ? "bg-red-100 border-red-400"
                      : i === currentMonth
                        ? "bg-purple-100 border-purple-400"
                        : isPast
                          ? "bg-purple-50 border-purple-200 opacity-70"
                          : "bg-gray-100 border-gray-200 opacity-50"}
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2">Month {i + 1}</h3>
                <ul className="space-y-1">
                  {monthMilestones.map((m) => (
                    <li
                      key={m}
                      className={`flex items-center justify-between gap-2 text-sm group ${completed[`${i}:${m}`] ? "text-green-600 line-through" : "text-gray-700"
                        }`}
                    >
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => (i <= currentMonth) && toggleComplete(i, m)}
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                        {m}
                      </div>
                      {i <= currentMonth && (
                        <button
                          className="text-red-500 hover:text-red-700 invisible group-hover:visible"
                          onClick={() => handleDelete(i, m)}
                        >
                          <MinusCircle size={16} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>

                {activeAddInput === i && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter milestone"
                      className="text-sm px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 w-full"
                      value={newMilestone}
                      onChange={(e) => setNewMilestone(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAdd(i);
                      }}
                    />
                    <button
                      onClick={() => handleAdd(i)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mt-4">
                {i === currentMonth && activeAddInput !== i && (
                  <Button
                    onClick={() => setActiveAddInput(i)}
                    variant="ghost"
                    className="text-purple-600 text-sm hover:bg-transparent hover:text-purple-800"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" /> Add
                  </Button>
                )}

                {i > currentMonth && (
                  <div className="absolute inset-0 flex justify-center items-center">
                    <Lock className="w-10 h-10 text-gray-500 opacity-50" />
                  </div>
                )}

                {i < currentMonth && completedAll && (
                  <div className="absolute inset-0 flex justify-center items-center z-0">
                    <PartyPopper className="w-12 h-12 text-purple-700 opacity-50 animate-bounce" />
                  </div>
                )}

                {i < currentMonth && !completedAll && (
                  <Link
                    href="/NeonestAi"
                    className="text-sm text-black/80 hover:text-red-800 hover:underline font-medium"
                  >
                    ⚠️ Ask Chatbot about milestone delay?
                  </Link>
                )}
              </div>

              <div className="flex justify-center mt-4 gap-1">
                {monthMilestones.map((m, d) => (
                  <span
                    key={d}
                    title={`${m} - ${completed[`${i}:${m}`] ? "Completed" : "Pending"}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${completed[`${i}:${m}`] ? "bg-green-500" : "bg-gray-300"
                      }`}
                  ></span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${i === visibleMonth ? "bg-purple-500" : "bg-gray-400"
              }`}
            onClick={() => scrollToCard(i)}
          ></button>
        ))}
      </div>
    </div>
  );
}
