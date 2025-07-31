"use client";
import React, { useState } from "react";
import { Baby, Heart, Utensils, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { CardStack } from "./ui/card-stack";

const interactionStages = [
  {
    title: "0–3 Months",
    value: "0-3",
    color: "pink",
    icon: Baby,
    tips: [
      "⮞ Make eye contact and smile at your baby",
      "⮞ Talk softly and use gentle expressions",
      "⮞ Sing lullabies and nursery rhymes",
      "⮞ Practice supervised tummy time daily",
      "⮞ Give gentle baby massages",
      "⮞ Show high-contrast black and white toys",
      "⮞ Hold baby close during feeding times",
      "⮞ Respond to baby's coos and sounds",
      "⮞ Use soft toys and rattles",
      "⮞ Create daily bonding routines",
    ],
  },
  {
    title: "4–6 Months",
    value: "4-6",
    color: "purple",
    icon: Heart,
    tips: [
      "⮞ Play peek-a-boo games frequently",
      "⮞ Use mirrors for self-recognition",
      "⮞ Introduce various rattles and sounds",
      "⮞ Read colorful picture books together",
      "⮞ Encourage rolling and reaching",
      "⮞ Let them grasp safe toys",
      "⮞ Practice sitting with support",
      "⮞ Make funny faces and expressions",
      "⮞ Introduce different textures",
      "⮞ Play simple interactive games",
    ],
  },
  {
    title: "7–9 Months",
    value: "7-9",
    color: "blue",
    icon: Utensils,
    tips: [
      "⮞ Guide exploration of safe objects",
      "⮞ Play musical games and sing along",
      "⮞ Support crawling attempts",
      "⮞ Practice object permanence games",
      "⮞ Encourage self-feeding attempts",
      "⮞ Play with different textures",
      "⮞ Practice clapping and waving",
      "⮞ Read interactive books together",
      "⮞ Support standing with assistance",
      "⮞ Create obstacle courses for crawling",
    ],
  },
  {
    title: "10–12 Months",
    value: "10-12",
    color: "green",
    icon: Star,
    tips: [
      "⮞ Name objects and body parts",
      "⮞ Support early walking attempts",
      "⮞ Play stacking and sorting games",
      "⮞ Encourage imitation of sounds",
      "⮞ Practice simple words regularly",
      "⮞ Play roll and catch with soft balls",
      "⮞ Create safe exploration spaces",
      "⮞ Introduce simple puzzles",
      "⮞ Practice finger foods",
      "⮞ Encourage social interaction",
    ],
  },
];

const InteractionWithBaby = () => {
  const [selectedAge, setSelectedAge] = useState(undefined);

  const selectedStage = interactionStages.find((stage) => stage.value === selectedAge);

  const cardStackItems = selectedStage?.tips.map((tip, index) => ({
    id: index,
    name: selectedStage.title,
    designation: "Interaction Tip",
    content: <p className="text-base">{tip}</p>,
  })) || [];

  return (
    <section id="interaction" className="px-4 py-8 bg-white/50 rounded-lg">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Interacting With Your Baby</h2>
          <p className="text-lg text-gray-600 mb-6">Discover meaningful ways to engage and support your baby's development</p>

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
                {interactionStages.map((stage) => (
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
      </div>
    </section>
  );
};

export default InteractionWithBaby;
