"use client"

import React, { useState, useEffect } from "react";
import { Info, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/Carousel";

const feedingCategories = [
  {
    title: "General Feeding Tips",
    icon: Info,
    tips: [
      "⮞ Always feed in a calm, comfortable setting.",
      "⮞ Sterilize bottles and utensils properly.",
      "⮞ Watch for hunger cues rather than sticking to strict schedules.",
      "⮞ Burp your baby after every feed.",
      "⮞ Do not add cereal to bottles unless prescribed.",
      "⮞ Gradually introduce one solid food at a time after 6 months.",
      "⮞ Ensure baby stays upright during and after feeding.",
      "⮞ Avoid honey before 12 months.",
      "⮞ Keep hydrated – breast milk or formula covers hydration until 6 months.",
      "⮞ Trust your baby's appetite – don't force-feed.",
    ],
  },
  {
    title: "Feeding Cautions & Notes",
    icon: AlertTriangle,
    tips: [
      "⮞ Do not feed cow's milk before 1 year.",
      "⮞ Avoid choking hazards – no nuts, grapes, or raw carrots early on.",
      "⮞ Check food temperature before feeding.",
      "⮞ Don't prop bottles or leave baby unattended.",
      "⮞ Limit juice; it's not necessary for infants.",
      "⮞ Watch for food allergies – introduce one new food every 3 days.",
      "⮞ No added salt or sugar in baby foods.",
      "⮞ Always supervise during solid feeding.",
      "⮞ Avoid overfeeding – look for satiety signs.",
      "⮞ Breastfeeding mothers should monitor their diet too.",
    ],
  },
];

const Feedingtips = () => {
  const [selectedCategory, setSelectedCategory] = useState("General Feeding Tips");
  const [api, setApi] = useState(null);

  // Reset carousel to first slide when category changes
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [selectedCategory, api]);

  return (
    <section id="feeding-tips" className="px-4 py-6 bg-white/50 rounded-lg">
      <div className="container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Feeding Tips</h2>
          <p className="text-lg text-gray-600">Guidance for nourishing your baby at every stage</p>
        </div>

        {/* Category selection buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {feedingCategories.map((category) => (
            <label
              key={category.title}
              className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg transition-all ${selectedCategory === category.title
                  ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 shadow-md"
                }`}
            >
              <input
                type="radio"
                name="category"
                value={category.title}
                checked={selectedCategory === category.title}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="hidden"
              />
              <category.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{category.title}</span>
            </label>
          ))}
        </div>

        {/* Carousel for tips */}
        <div className="w-full px-4 sm:px-8 md:px-12 max-w-[95vw] sm:max-w-2xl mx-auto">
          <Carousel className="w-full" setApi={setApi}>
            <CarouselContent>
              {feedingCategories
                .find((category) => category.title === selectedCategory)
                ?.tips.map((tip, index) => (
                  <CarouselItem key={index}>
                    <div className="p-0.5">
                      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-pink-50 via-white to-blue-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/40 to-blue-200/40" />
                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-300/30 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-300/30 to-transparent rounded-full translate-x-16 translate-y-16 blur-2xl" />

                        <CardContent className="relative flex items-center justify-center min-h-[150px] p-4 sm:p-6">
                          <div className="relative w-full">
                            {/* Border gradient */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur" />

                            {/* Tip content with enhanced styling */}
                            <div className="relative bg-white/80 rounded-lg p-3 sm:p-4 backdrop-blur-sm border border-pink-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                              <p className="text-base sm:text-lg text-center leading-relaxed font-medium bg-gradient-to-l from-pink-600 to-blue-600 bg-clip-text text-transparent">
                                {tip}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>

            {/* Navigation buttons - simple, always at the bottom */}
            <div className="flex justify-center gap-8 mt-4">
              <CarouselPrevious className="static translate-y-0 bg-white hover:bg-gray-50" />
              <CarouselNext className="static translate-y-0 bg-white hover:bg-gray-50" />
            </div>
          </Carousel>
        </div>

        {/* Statement */}
        <div className="text-center text-gray-500 text-sm mt-2">
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