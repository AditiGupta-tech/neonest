"use client";
import React, { useState } from "react";
import { Baby, Bed, Smile } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { CardStack } from "./ui/card-stack";

const sleepStages = [
  {
    title: "0–3 Months",
    value: "0-3",
    color: "pink",
    icon: Baby,
    tips: [
      "⮞ Newborns sleep ~14–17 hours/day in short stretches.",
      "⮞ No fixed routine — follow baby's natural rhythm.",
      "⮞ Feed-sleep cycles dominate at this stage.",
      "⮞ Place baby on their back to sleep.",
      "⮞ Swaddling (when done safely) can soothe.",
      "⮞ Avoid overstimulation before naps.",
      "⮞ Respond calmly to night wakings — it's normal.",
      "⮞ Use dim lights at night to help differentiate day/night.",
      "⮞ Burp gently before laying baby down.",
      "⮞ Track sleep patterns to understand habits early on.",
    ],
  },
  {
    title: "4–6 Months",
    value: "4-6",
    color: "purple",
    icon: Bed,
    tips: [
      "⮞ Begin a consistent bedtime routine (bath, book, lullaby).",
      "⮞ Baby may sleep 6–8 hour stretches at night.",
      "⮞ Transition from 3–4 naps to 2–3 naps daily.",
      "⮞ Start sleep training gently if needed.",
      "⮞ Use blackout curtains for better naps.",
      "⮞ Avoid late-evening naps — they can delay bedtime.",
      "⮞ Watch for sleep cues: rubbing eyes, yawning, fussiness.",
      "⮞ Allow time for baby to self-soothe before intervening.",
      "⮞ No need for feeding every time they wake up at night.",
      "⮞ Offer comfort objects like a soft cloth (under supervision).",
    ],
  },
  {
    title: "7–12 Months",
    value: "7-12",
    color: "blue",
    icon: Smile,
    tips: [
      "⮞ Sleep becomes more stable ~11–12 hours/night.",
      "⮞ 2 naps/day are common at this stage.",
      "⮞ Avoid stimulating play just before bedtime.",
      "⮞ Use bedtime stories to build consistent wind-down.",
      "⮞ Sleep regressions may occur (around 8–10 months).",
      "⮞ Reassure during separation anxiety, but stay consistent.",
      "⮞ Keep night-time interactions quiet and low-energy.",
      "⮞ Avoid late-night feeds unless necessary.",
      "⮞ Stick to a wake-sleep schedule to build habit.",
      "⮞ Encourage falling asleep in crib (not in arms).",
    ],
  },
];

const Sleeptips = () => {
  const [selectedAge, setSelectedAge] = useState(undefined);

  const selectedStage = sleepStages.find((stage) => stage.value === selectedAge);

  const cardStackItems = selectedStage?.tips.map((tip, index) => ({
    id: index,
    name: selectedStage.title,
    designation: "Sleep Tip",
    content: <p className="text-base">{tip}</p>,
  })) || [];

  return (
    <section id="sleep-tips" className="px-4 py-8 bg-white/50 rounded-lg mb-6">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Baby Sleep Tips by Age</h2>
          <p className="text-lg text-gray-600 mb-6">Because if baby sleeps well, so do you!</p>

          <div className="max-w-xs mx-auto">
            <Select
              defaultValue={undefined}
              value={selectedAge}
              onValueChange={setSelectedAge}
            >
              <SelectTrigger className="w-full bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700">
                <SelectValue placeholder="Select age" />
              </SelectTrigger>
              <SelectContent position="popper">
                {sleepStages.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedStage && (
          <div className="flex justify-center items-center min-h-[400px]">
            <CardStack items={cardStackItems} offset={5} scaleFactor={0.08} />
          </div>
        )}

        {/* Statement */}
        <div className="text-center text-gray-500 text-sm mt-10">
          For more information, visit{" "}
          <a href="/Resources" className="text-pink-600 hover:underline">
            Resources
          </a>{" "}
          or{" "}
          <a href="/Faqs" className="text-pink-600 hover:underline">
            FAQs
          </a>
          .
        </div>
      </div>
    </section>
  );
};

export default Sleeptips;
