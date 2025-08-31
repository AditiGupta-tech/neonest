
"use client";

import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Filter, Star, ExternalLink } from "lucide-react";
import { Card, CardContent, CardTitle, CardHeader } from '../components/ui/card';
import './toys-card.css';
import Badge from '../components/ui/Badge';

// Dynamic import for JSON data
const fetchToys = async () => {
  const res = await fetch("/toys.json");
  return res.json();
};


const categories = [
  { id: 'all', name: 'All' },
  { id: '0-3m', name: '0-3m' },
  { id: '3-6m', name: '3-6m' },
  { id: '6-12m', name: '6-12m' },
  { id: '12-18m', name: '12-18m' },
  { id: '18-24m+', name: '18-24m+' },
];




export default function Toys() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Toys | NeoNest";
    fetchToys().then((data) => {
      setToys(data);
      setLoading(false);
    });
  }, []);

  // Group toys by age
  const groupedToys = categories
    .filter((cat) => cat.id !== 'all')
    .map((cat) => ({
      ...cat,
      toys: toys.filter(
        (toy) => toy.age === cat.id &&
          (!searchTerm ||
            toy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (toy.notes && toy.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (toy.skills && toy.skills.join(' ').toLowerCase().includes(searchTerm.toLowerCase()))
          )
      )
    }));

  return (
    <div>
      <main>
        <div className="text-center space-y-2">
          <h1 className='text-4xl font-bold text-gray-800'>Toys Collection</h1>
          <p>Fun for Every Age</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow-sm p-4 my-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Category:</span>
          </div>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className={`rounded-xl text-sm ${
                selectedCategory === category.id
                  ? "bg-pink-100 text-pink-700 font-semibold border-pink-300"
                  : "text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Toys by Age Group */}
        {loading ? (
          <div className="text-center py-20">Loading toys...</div>
        ) : (
          <>
            {selectedCategory === 'all' ? (
              groupedToys.map((group) => (
                group.toys.length > 0 && (
                  <div key={group.id} className="mb-10">
                    <h2 className="text-2xl font-semibold text-pink-700 mb-4 mt-8">Age: {group.name}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {group.toys.map((toy) => (
                        <Card
                          key={toy.id}
                          className="toys-card border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between"
                        >
                          <CardHeader className="p-4 pb-2">
                            <div className="flex items-center justify-center bg-white" style={{ minHeight: '160px' }}>
                              <img
                                src={toy.image}
                                alt={toy.name}
                                className="w-32 h-32 object-contain rounded-xl shadow-sm border bg-white"
                                style={{ background: '#fff' }}
                              />
                            </div>
                            <CardTitle className="text-lg mt-2 hover:text-pink-600 transition-colors duration-200">
                              {toy.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-6 pt-0">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-600">
                                {toy.age}
                              </Badge>
                              {toy.skills && toy.skills.map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{toy.notes}</p>
                            <div className="text-xs text-gray-500 mb-2">Safety: {toy.safety}</div>
                            <Button
                              className="w-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white font-medium rounded-xl transition-all duration-200"
                              variant="ghost"
                              onClick={() => window.open("https://www.firstcry.com/toys-and-games/2/1", "_blank")}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Buy Toy
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              ))
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-pink-700 mb-4 mt-8">Age: {categories.find(c => c.id === selectedCategory)?.name}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedToys.find(g => g.id === selectedCategory)?.toys.length > 0 ? (
                    groupedToys.find(g => g.id === selectedCategory)?.toys.map((toy) => (
                      <Card
                        key={toy.id}
                        className="toys-card border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-between"
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <img src={toy.image} alt={toy.name} className="w-16 h-16 object-contain rounded-lg border bg-gray-50" />
                          </div>
                          <CardTitle className="text-lg mt-2 hover:text-pink-600 transition-colors duration-200">
                            {toy.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-6 pt-0">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-600">
                              {toy.age}
                            </Badge>
                            {toy.skills && toy.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{toy.notes}</p>
                          <div className="text-xs text-gray-500 mb-2">Safety: {toy.safety}</div>
                          <Button
                            className="w-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white font-medium rounded-xl transition-all duration-200"
                            variant="ghost"
                            onClick={() => window.open("https://www.firstcry.com/toys-and-games/2/1", "_blank")}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Buy Toy
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20 space-y-4">
                      <p className="text-gray-500 text-lg">No toys found for this filter.</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("all");
                        }}
                        className="rounded-xl"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Safety & Hygiene Guidance */}
        <div className="mt-10 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-xl">
          <h2 className="font-semibold text-yellow-700 mb-2">Safety & Hygiene Guidance</h2>
          <ul className="list-disc pl-5 text-sm text-yellow-800 space-y-1">
            <li>Clean toys regularly with baby-safe soap and water.</li>
            <li>Check for recalls and avoid toys with small, detachable parts for infants.</li>
            <li>Inspect toys for wear-and-tear and replace if damaged.</li>
          </ul>
        </div>

      </main>
    </div>
  );
}