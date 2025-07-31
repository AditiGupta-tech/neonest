"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval: any;

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  // Update cards when items prop changes
  useEffect(() => {
    setCards(items);
  }, [items]);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, [cards]); // Restart flipping when cards change

  const startFlipping = () => {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);
  };

  if (!cards.length) return null;

  return (
    <div className="relative h-48 w-72 md:h-48 md:w-[448px]">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute bg-gradient-to-br from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 h-48 w-72 md:h-48 md:w-[448px] rounded-3xl p-7 shadow-lg border border-indigo-100 dark:border-indigo-900 shadow-indigo-100/20 dark:shadow-none backdrop-blur-sm flex flex-col justify-between overflow-hidden"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
          >
            {/* Decorative elements */}
            <div className="absolute -right-8 -top-8 w-20 h-20 bg-gradient-to-br from-pink-200 to-indigo-200 dark:from-pink-500/20 dark:to-indigo-500/20 rounded-full blur-2xl opacity-60" />
            <div className="absolute -left-8 -bottom-8 w-20 h-20 bg-gradient-to-br from-indigo-200 to-violet-200 dark:from-indigo-500/20 dark:to-violet-500/20 rounded-full blur-2xl opacity-60" />
            
            <div className="relative">
              <div className="font-medium text-xl md:text-2xl text-gray-700 dark:text-gray-200">
                {card.content}
              </div>
            </div>
            
            <div className="relative">
              <p className="text-base md:text-base font-medium bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                {card.name}
              </p>
              <p className="text-sm md:text-sm text-indigo-400 dark:text-indigo-300 font-normal">
                {card.designation}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}; 