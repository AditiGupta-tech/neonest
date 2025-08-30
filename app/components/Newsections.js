"use client";

import React, { useState } from "react";
import { Baby, Bot, Smile, Users } from "lucide-react";

const NewsletterContent = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    console.log(`Subscribed with: ${email}`);
  };

  return (
    <div className="bg-white  dark:bg-gray-800  shadow-md rounded-xl p-6 flex-1 min-w-[300px]">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">Subscribe to Our Newsletter</h2>
      {!subscribed ? (
        <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md transition-colors duration-200">
            Subscribe
          </button>
        </form>
      ) : (
        <p className="text-green-600 dark:text-green-400 text-center font-medium">Thank you for subscribing! We’ll send updates to your email.</p>
      )}
    </div>
  );
};

const AppStatsContent = () => {
  const stats = [
    { icon: <Baby className="text-pink-500" />, label: "Babies Tracked", value: "1,200+" },
    { icon: <Bot className="text-blue-500" />, label: "AI Responses", value: "25,000+" },
    { icon: <Smile className="text-yellow-500" />, label: "Avg. Rating", value: "4.8/5" },
    { icon: <Users className="text-green-500" />, label: "Happy Parents", value: "950+" },
  ];

  return (
    <div className="flex-1 min-w-[300px]">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white  dark:bg-gray-800  shadow-md rounded-xl p-6">
            <div className="mb-2 flex justify-center text-2xl">{stat.icon}</div>
            <h3 className="text-lg text-gray-900 dark:text-gray-100 font-semibold">{stat.value}</h3>
            <p className="text-sm text-gray-600  dark:text-gray-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewSections = () => {
  return (
    <div className="container mx-auto max-w-6xl py-2 px-4 sm:px-6 lg:px-8 mb-10">
      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
        <NewsletterContent />
        <AppStatsContent />
      </div>
    </div>
  );
};

export default NewSections;
