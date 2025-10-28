"use client";
import React, { useState, useEffect, useRef } from "react";
import { Star, Heart, MessageCircle, Baby, Gift, Eye, Ear, Hand, Target, Brain, Shapes, Dumbbell, Scale, Palette, Box, Smile, Zap, Gamepad, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/Button";
import toysData from "../data/toys.json";
import Link from "next/link";
import Image from "next/image";
import { useMilestoneStore } from "../../lib/store/milestoneStore";

const ToysSection = ({ babyAgeMonths = "", showAll = false }) => {
  const [selectedCategory, setSelectedCategory] = useState(showAll ? "all" : "0-3m");
  const [toyRatings, setToyRatings] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [activeTab, setActiveTab] = useState("all");

  const { getLatestCompletedMonth, getSuggestedToys } = useMilestoneStore();
  const latestCompletedMonth = getLatestCompletedMonth();
  const suggestedToys = latestCompletedMonth > -1 ? getSuggestedToys(latestCompletedMonth) : [];

  const skillsRef = useRef(null);

  const scrollLeft = () => {
    if (skillsRef.current) skillsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (skillsRef.current) skillsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

const categories = [
  { id: "all", label: "All Ages", color: "bg-gray-100 text-gray-700" },
  { id: "0-3m", label: "0-3 Months", color: "bg-pink-100 text-pink-700" },
  { id: "3-6m", label: "3-6 Months", color: "bg-blue-100 text-blue-700" },
  { id: "6-12m", label: "6-12 Months", color: "bg-green-100 text-green-700" },
  { id: "12-18m", label: "12-18 Months", color: "bg-purple-100 text-purple-700" },
  { id: "18-24m+", label: "18-24 Months+", color: "bg-orange-100 text-orange-700" },
];

  const categoryTips = {
    "0-3m": "At 0-3 months, babies are developing sensory awareness. Toys that make gentle sounds and have different textures help stimulate their senses.",
    "3-6m": "At 3-6 months, babies start reaching and grasping. Interactive toys encourage motor development and exploration.",
    "6-12m": "At 6-12 months, babies are sitting and crawling. Toys that promote stacking and problem-solving support cognitive growth.",
    "12-18m": "At 12-18 months, toddlers are walking and talking. Educational toys help with shape recognition and fine motor skills.",
    "18-24m+": "At 18-24 months+, children engage in imaginative play. Building and creative toys foster creativity and spatial awareness.",
  };

  const allSkills = ["Sensory Development", "Auditory Skills", "Motor Skills", "Visual Tracking", "Fine Motor Skills", "Problem Solving", "Shape Recognition", "Gross Motor Skills", "Balance", "Creativity", "Spatial Awareness", "Self-Recognition", "Cognitive Skills", "Imaginative Play", "Cause and Effect", "Exploration", "Emotional Development"];

  const skillIcons = {
    "Sensory Development": Eye,
    "Auditory Skills": Ear,
    "Motor Skills": Hand,
    "Visual Tracking": Target,
    "Fine Motor Skills": Hand,
    "Problem Solving": Brain,
    "Cognitive Skills": Brain,
    "Shape Recognition": Shapes,
    "Gross Motor Skills": Dumbbell,
    "Balance": Scale,
    "Creativity": Palette,
    "Spatial Awareness": Box,
    "Self-Recognition": Smile,
    "Imaginative Play": Gamepad,
    "Cause and Effect": Zap,
    "Exploration": Search,
    "Emotional Development": Heart,
  };

  // Determine category based on babyAgeMonths prop if provided
  useEffect(() => {
    if (babyAgeMonths === "") return;
    const age = parseInt(babyAgeMonths, 10);
    if (age >= 0 && age < 3) setSelectedCategory("0-3m");
    else if (age >= 3 && age < 6) setSelectedCategory("3-6m");
    else if (age >= 6 && age < 12) setSelectedCategory("6-12m");
    else if (age >= 12 && age < 18) setSelectedCategory("12-18m");
    else if (age >= 18) setSelectedCategory("18-24m+");
  }, [babyAgeMonths]);

  // Filter toys by selected category, search query, and skills
  const filteredToys = toysData.filter((toy) => {
    const toyAge = parseInt(toy.age.replace('m', ''), 10);
    let ageMatch = false;
    switch (selectedCategory) {
      case "0-3m":
        ageMatch = toyAge >= 0 && toyAge < 3;
        break;
      case "3-6m":
        ageMatch = toyAge >= 3 && toyAge < 6;
        break;
      case "6-12m":
        ageMatch = toyAge >= 6 && toyAge < 12;
        break;
      case "12-18m":
        ageMatch = toyAge >= 12 && toyAge < 18;
        break;
      case "18-24m+":
        ageMatch = toyAge >= 18;
        break;
      default:
        ageMatch = true;
    }
    if (!ageMatch) return false;
    if (searchQuery && !toy.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedSkills.length > 0 && !selectedSkills.some(skill => toy.skills.includes(skill))) return false;
    return true;
  });


  const handleRating = (toyId, rating) => {
    setToyRatings((prev) => ({
      ...prev,
      [toyId]: { ...prev[toyId], rating },
    }));
  };

  const handleFeedback = (toyId, feedback) => {
    setToyRatings((prev) => ({
      ...prev,
      [toyId]: { ...prev[toyId], feedback },
    }));
  };

  const handleFavorite = (toyId) => {
    setFavorites((prev) => ({
      ...prev,
      [toyId]: !prev[toyId],
    }));
  };

  const getAverageRating = (toyId) => {
    const ratings = toyRatings[toyId]?.rating || 0;
    return ratings;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-6xl">
        {latestCompletedMonth > -1 && suggestedToys.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">Suggested Toys for Month {latestCompletedMonth + 1}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedToys.slice(0, 3).map((toy) => (
                <Card
                  key={toy.id}
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
          <CardContent className="p-4">
            <Image src={toy.image} alt={toy.name} width={400} height={400} className="w-full h-48 object-cover rounded-lg mb-4" />
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              {toy.name}
            </CardTitle>
            <p className="text-sm text-gray-500 mb-2">{toy.age}</p>

                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Usage Tips: {toy.usageTips}</p>
                    {toy.milestones && <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Milestones: {toy.milestones.join(", ")}</p>}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {toy.skills.map((skill, index) => {
                          const Icon = skillIcons[skill] || Box;
                          return (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center gap-1"
                            >
                              <Icon className="w-3 h-3" />
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                      <strong>Safety:</strong> {toy.safetyNotes}
                    </div>

                    {toy.purchaseLink && toy.purchaseLink !== "#" && <a href={toy.purchaseLink} className="text-blue-500 text-sm">Purchase</a>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search toys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 mx-2 rounded-full text-base font-medium transition-all duration-300 ${
              activeTab === "all"
                ? "bg-blue-500 text-white shadow-lg transform scale-105"
                : "bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80"
            }`}
          >
            All Toys
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-6 py-2 mx-2 rounded-full text-base font-medium transition-all duration-300 ${
              activeTab === "favorites"
                ? "bg-pink-500 text-white shadow-lg transform scale-105"
                : "bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80"
            }`}
          >
            Your Favorite Toys
          </button>
        </div>

        {activeTab === "all" && (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-base font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? `${category.color} shadow-lg transform scale-105`
                      : "bg-white/60 dark:bg-gray-700/60 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Educational Tip */}
            <p className="text-center text-gray-600 dark:text-gray-300 mt-4 max-w-4xl mx-auto mb-8">{categoryTips[selectedCategory]}</p>

            {/* Additional Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="w-full max-w-4xl">
                <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">Skills</label>
                <div className="flex items-center gap-2">
                  <button onClick={scrollLeft} className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <div className="flex overflow-x-auto w-full" ref={skillsRef}>
                    <div className="flex gap-2 min-w-max">
                      {allSkills.map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1 rounded-full text-base transition-colors ${selectedSkills.includes(skill) ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={scrollRight} className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {/* Toys Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {(showAll ? filteredToys : filteredToys.slice(0, 6)).map((toy) => (
            <Card
              key={toy.id}
              className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <CardContent className="p-4">
                <Image src={toy.image} alt={toy.name} width={400} height={400} className="w-full h-48 object-cover rounded-lg mb-4" />
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {toy.name}
                </CardTitle>
                <p className="text-sm text-gray-500 mb-2">{toy.age}</p>

                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Usage Tips: {toy.usageTips}</p>
                {toy.milestones && <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Milestones: {toy.milestones.join(", ")}</p>}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {toy.skills.map((skill, index) => {
                      const Icon = skillIcons[skill] || Box;
                      return (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center gap-1"
                        >
                          <Icon className="w-3 h-3" />
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                      <strong>Safety:</strong> {toy.safetyNotes}
                    </div>

                {toy.purchaseLink && toy.purchaseLink !== "#" && <a href={toy.purchaseLink} className="text-blue-500 text-sm">Purchase</a>}

                {/* Rating & Feedback Section */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Rate this toy:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(toy.id, star)}
                          className="text-yellow-400 hover:text-yellow-500 transition-colors"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= (toyRatings[toy.id]?.rating || 0) ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setShowFeedback((prev) => ({ ...prev, [toy.id]: !prev[toy.id] }))
                      }
                      className="flex-1 text-xs bg-white text-gray-700 border-gray-300"
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Feedback
                    </Button>
                    <Button
                      size="sm"
                      className={`flex-1 text-xs ${favorites[toy.id] ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-500 hover:bg-pink-600'}`}
                      onClick={() => handleFavorite(toy.id)}
                    >
                      <Heart className={`w-3 h-3 mr-1 ${favorites[toy.id] ? 'fill-current' : ''}`} />
                      Favorite
                    </Button>
                  </div>

                  {showFeedback[toy.id] && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <textarea
                        placeholder="Share how this toy helped your baby&apos;s..."
                        className="w-full text-sm p-2 border rounded resize-none focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white text-gray-900"
                        rows="6"
                        maxLength={1000}
                        value={toyRatings[toy.id]?.feedback || ''}
                        onChange={(e) => handleFeedback(toy.id, e.target.value)}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={() => setShowFeedback((prev) => ({ ...prev, [toy.id]: false })) }
                          className="text-xs"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  )}

                  {toyRatings[toy.id]?.feedback && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Feedback:</strong> {toyRatings[toy.id].feedback}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
            </div>

            {!showAll && (
              <div className="text-center">
                <Link href="/Toys">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    <Baby className="w-5 h-5 mr-2" />
                    Explore All Toys
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === "favorites" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {toysData.filter(toy => favorites[toy.id]).length > 0 ? (
              toysData.filter(toy => favorites[toy.id]).map((toy) => (
                <Card
                  key={toy.id}
                  className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <CardContent className="p-4">
                    <Image src={toy.image} alt={toy.name} width={400} height={400} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {toy.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mb-2">{toy.age}</p>

                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Usage Tips: {toy.usageTips}</p>
                    {toy.milestones && <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Milestones: {toy.milestones.join(", ")}</p>}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {toy.skills.map((skill, index) => {
                      const Icon = skillIcons[skill] || Box;
                      return (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center gap-1"
                        >
                          <Icon className="w-3 h-3" />
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>

                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                      <strong>Safety:</strong> {toy.safetyNotes}
                    </div>

                    {toy.purchaseLink && toy.purchaseLink !== "#" && <a href={toy.purchaseLink} className="text-blue-500 text-sm">Purchase</a>}

                    {/* Rating & Feedback Section */}
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Rate this toy:
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRating(toy.id, star)}
                              className="text-yellow-400 hover:text-yellow-500 transition-colors"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= (toyRatings[toy.id]?.rating || 0) ? "fill-current" : ""
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setShowFeedback((prev) => ({ ...prev, [toy.id]: !prev[toy.id] }))
                          }
                          className="flex-1 text-xs bg-white text-gray-700 border-gray-300"
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Feedback
                        </Button>
                        <Button
                          size="sm"
                          className={`flex-1 text-xs ${favorites[toy.id] ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-500 hover:bg-pink-600'}`}
                          onClick={() => handleFavorite(toy.id)}
                        >
                          <Heart className={`w-3 h-3 mr-1 ${favorites[toy.id] ? 'fill-current' : ''}`} />
                          Favorite
                        </Button>
                      </div>

                      {showFeedback[toy.id] && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <textarea
                            placeholder="Share how this toy helped your baby&apos;s..."
                            className="w-full text-sm p-2 border rounded resize-none focus:ring-2 focus:ring-pink-300 focus:border-transparent bg-white text-gray-900"
                            rows="6"
                            maxLength={1000}
                            value={toyRatings[toy.id]?.feedback || ''}
                            onChange={(e) => handleFeedback(toy.id, e.target.value)}
                          />
                          <div className="flex justify-end mt-2">
                            <Button
                              size="sm"
                              onClick={() => setShowFeedback((prev) => ({ ...prev, [toy.id]: false })) }
                              className="text-xs"
                            >
                              Submit
                            </Button>
                          </div>
                        </div>
                      )}

                      {toyRatings[toy.id]?.feedback && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Feedback:</strong> {toyRatings[toy.id].feedback}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300 col-span-full">No favorite toys yet. Start favoriting some toys!</p>
            )}
          </div>
        )}


      </div>
    </section>
  );
};

export default ToysSection;
