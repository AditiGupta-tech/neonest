"use client";
import React, { useState } from "react";
import { Utensils, Apple, Baby, Spoon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { CardStack } from "./ui/card-stack";

const feedingStages = [
  {
    title: "0–3 Months",
    value: "0-3",
    color: "pink",
    icon: Baby,
    tips: [
      "⮞ Feed exclusively with breast milk or formula",
      "⮞ Feed every 2-3 hours or on demand",
      "⮞ Watch for hunger cues: rooting, sucking motions",
      "⮞ Ensure proper latching during feeding",
      "⮞ Burp baby after every feeding session",
      "⮞ Never prop bottles or leave baby unattended",
      "⮞ Track wet and soiled diapers",
      "⮞ Sterilize all feeding equipment properly",
      "⮞ Avoid overfeeding - respect baby's cues",
      "⮞ No water or other liquids needed",
    ],
  },
  {
    title: "4–6 Months",
    value: "4-6",
    color: "purple",
    icon: Spoon,
    tips: [
      "⮞ Watch for solid food readiness signs",
      "⮞ Start with iron-fortified single grain cereals",
      "⮞ Introduce one new food every 3-5 days",
      "⮞ Keep breast milk/formula as main nutrition",
      "⮞ Use soft spoons designed for babies",
      "⮞ Ensure baby can sit with support",
      "⮞ Feed solids after milk feeds initially",
      "⮞ Keep first feedings thin and smooth",
      "⮞ Watch for allergic reactions",
      "⮞ Never force feed - follow baby's lead",
    ],
  },
  {
    title: "7–9 Months",
    value: "7-9",
    color: "blue",
    icon: Utensils,
    tips: [
      "⮞ Introduce mashed fruits and vegetables",
      "⮞ Offer small amounts of water with meals",
      "⮞ Begin with soft finger foods",
      "⮞ Establish regular meal times",
      "⮞ Include protein-rich foods",
      "⮞ Watch for pincer grasp development",
      "⮞ Avoid honey and high-allergy foods",
      "⮞ Continue breast milk/formula feeds",
      "⮞ Encourage self-feeding attempts",
      "⮞ Make meal times fun and interactive",
    ],
  },
  {
    title: "10–12 Months",
    value: "10-12",
    color: "green",
    icon: Apple,
    tips: [
      "⮞ Transition to more table foods",
      "⮞ Establish 3 meals + 2 snacks routine",
      "⮞ Encourage cup drinking",
      "⮞ Offer variety of textures and tastes",
      "⮞ Include iron-rich foods regularly",
      "⮞ Practice self-feeding with utensils",
      "⮞ Avoid added salt and sugar",
      "⮞ Continue breast milk/formula until 12 months",
      "⮞ Watch for food allergies",
      "⮞ Make family meals inclusive",
    ],
  },
];

const Feedingtips = () => {
  const [selectedAge, setSelectedAge] = useState(undefined);

  const selectedStage = feedingStages.find((stage) => stage.value === selectedAge);

  const cardStackItems = selectedStage?.tips.map((tip, index) => ({
    id: index,
    name: selectedStage.title,
    designation: "Feeding Tip",
    content: <p className="text-base">{tip}</p>,
  })) || [];

  return (
    <section id="feeding-tips" className="px-4 py-8 bg-white/50 rounded-lg">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Baby Feeding Tips by Age</h2>
          <p className="text-lg text-gray-600 mb-6">Guidance for nourishing your baby at every stage</p>

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
                {feedingStages.map((stage) => (
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

export default Feedingtips;