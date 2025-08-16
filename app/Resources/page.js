"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import { Search, Filter, Clock, ExternalLink } from "lucide-react";
import { resourcesData, parentingCategories, contentCategories } from "./ResourceData";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    document.title = "Resources | NeoNest";
  }, []);

  // Combine all resources
  const allResources = Object.values(resourcesData).flat();

  // Filtering logic
  const filteredResources = allResources.filter((resource) => {
    const matchesSearch =
      !searchTerm ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      resource.type?.toLowerCase() === selectedCategory.toLowerCase() ||
  resource.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Button label logic
  const getButtonLabel = (type) => {
    switch (type) {
      case "video":
        return "Watch Video";
      case "podcast":
        return "Listen Now";
      case "blog":
        return "Read Blog";
      case "article":
        return "Read Article";
      case "toolkits":
        return "Play toolkits";
      default:
        return "View Resource";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-800">Parenting Resources</h2>
        <p className="text-lg text-gray-600">
          Curated resources to support your parenting journey
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 inset-y-0 flex items-center h-full text-gray-400 w-4" />
        <Input
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full"
        />
      </div>

      {/* Category Filter */}
<div className="flex flex-col gap-4 bg-white rounded-xl shadow-sm p-4">

  {/* Parenting Topics */}
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Filter className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-600">Parenting Topics:</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {parentingCategories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          onClick={() =>
            setSelectedCategory((prev) =>
              prev === category.id ? "all" : category.id
            )
          }
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
  </div>

  {/* Content Types */}
  <div>
    <div className="flex items-center gap-2 mb-2">
      <Filter className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-600">Content Types:</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {contentCategories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          onClick={() =>
            setSelectedCategory((prev) =>
              prev === category.id ? "all" : category.id
            )
          }
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
  </div>

</div>


      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg mt-2 hover:text-pink-600 transition-colors duration-200">
                {resource.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-4 pb-6 pt-0">
              <p className="text-gray-600 text-sm mb-4">{resource.description}</p>

              <div className="space-y-1 mb-4 text-sm text-gray-500">
                <div>By {resource.author}</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {resource.readTime}
                  </div>
                  <div>
                    {new Date(resource.publishDate).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-600"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                className="w-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white font-medium rounded-xl transition-all duration-200"
                variant="ghost"
                onClick={() => window.open(resource.url, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {getButtonLabel(resource.type)}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <p className="text-gray-500 text-lg">
            No resources found matching your criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="rounded-xl"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
