"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Input from "../components/ui/Input";
import { BookOpen, ExternalLink, Search, Filter, Clock } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Feeding Your Baby: The First Year",
    description: "Discover age-by-age guidance on textures, feeding routines, and nutrition to support your baby’s growth and development during the first year.",
    url: "https://my.clevelandclinic.org/health/articles/9693-feeding-your-baby-the-first-year",
    author: "Cleveland Clinic",
    readTime: "10 min read",
    publishDate: "2023-09-19",
    category: "feeding",
    tags: [ "nutrition", "first foods"],
    thumbnail: "https://www.motherhoodindia.com/wp-content/uploads/2021/09/Introduction-Of-Solid-Foods-To-Toddlers.jpg",
    type: "article",
  },
  {
    id: 2,
    title: "Newborn Sleeping Tips",
    description: "This video explains what normal newborn sleep looks like, how to establish gentle sleep routines, and practical tips for creating a safe, soothing sleep environment.",
    url: "https://youtu.be/j0M4v24gSaw",
    author: "Ann & Robert H. Lurie Children's Hospital of Chicago",
    readTime: "6 min watch",
    publishDate: "2021-07-09",
    category: "sleep",
    tags: ["sleep training", "routine", "newborn"],
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-otohI9DxJtSlKG460AEhGTSSOaLk0DdOeQ&s",
    type: "video",
  },
  {
    id: 3,
    title: "Baby-Proofing Your Home: The Complete Checklist",
    description: "Essential safety measures to protect your curious crawler and toddler",
    url: "https://www.youtube.com/watch?v=d7fCLHVj3K8",
    author: "This Old House",
    readTime: "12 min watch",
    publishDate: "2023-01-23",
    category: "health",
    tags: ["safety", "childproofing", "home"],
    thumbnail: "https://images.ctfassets.net/6m9bd13t776q/6audZmURl4JJyTvbtmAM2E/67143a2ebb092cdc3a9b59e85cb10466/baby-proofing-your-home-hero-Stocksy-5081208.png?q=80",
    type: "video",
  },
  {
    id: 4,
    title: "The Basics of Baby and Toddler Development",
    description: "What to expect in your baby's first year of growth and development",
    url: "https://www.firstthingsfirst.org/first-things/podcast-baby-toddler-development-basics/",
    author: "First Things First",
    readTime: "30 min listen",
    publishDate: "2018-04-24",
    category: "development",
    tags: ["growth", "milestones", "first year"],
    thumbnail: "https://th.bing.com/th/id/OIP.HBRghzz_ORJJ06r1Fj-McgHaJl?w=147&h=191&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "audio",
  },
  {
    id: 5,
    title: "Breastfeeding Tips for New Mothers",
    description: "Expert advice for overcoming common breastfeeding challenges",
    url: "https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/breastfeeding-101-tips-for-new-moms?",
    author: "Mayo Clinic",
    readTime: "6 min read",
    publishDate: "2021-04-19",
    category: "feeding",
    tags: ["breastfeeding", "newborn", "latching"],
    thumbnail: "https://kangaroocareindia.com/static/media/blog-34.66b52c08f84222a06361.jpg",
    type: "article",
  },
  {
    id: 6,
    title: "Tummy Time: What You Need To Know",
    description: "How tummy time helps your baby's development and ways to make it enjoyable",
    url: "https://my.clevelandclinic.org/podcasts/health-essentials/tummy-time-what-you-need-to-know-with-dr-matthew-badgett?",
    author: "Cleveland Clinic",
    readTime: "23 min listen",
    publishDate: "2022-02-09",
    category: "development",
    tags: ["motor skills", "play", "development"],
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxdz5v7_6mOZStFh66GSYg0KMWdbpRfM56bA&s",
    type: "audio",
  },
  {
    id: 7,
    title: "Solid foods: How to get your baby started",
    description: "Find out when and how to make the transition from breast milk or formula to solid foods.",
    url: "https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/healthy-baby/art-20046200",
    author: "Mayo Clinic Staff",
    readTime: "5 min read",
    publishDate: "2025-05-31",
    category: "feeding",
    tags: ["weaning", "nutrition", "first foods"],
    thumbnail: "https://tse3.mm.bing.net/th/id/OIP.jwRAmSybm3hoAGHKaJ-aUwHaE8?w=1024&h=683&rs=1&pid=ImgDetMain&o=7&rm=3",
    type: "article",
  },
  {
    id: 8,
    title: "How to Get Your Breastfed Baby to Take a Bottle",
    description: "Learn gentle and effective ways to help your breastfed baby accept a bottle.",
    url: "https://youtube.com/shorts/qrAC9ueCgZI?si=1Z_G5IcIhMXKMmWV",
    author: "Little Ones",
    readTime: "20 seconds watch",
    publishDate: "2023-03-19",
    category: "feeding",
    tags: ["weaning", "nutrition"],
    thumbnail: "https://th.bing.com/th/id/OIP.klwKE_OECAPtoBky2SHk1gHaE8?w=272&h=182&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "video",
  },
  {
    id: 9,
    title: "How to Soothe a Baby",
    description: "Dr. Wanda Abreu shares some reasons why babies cry, how to calm them and how to take care of yourself during this difficult time.",
    url: "https://youtu.be/CFiJLzuh0k0?si=3aBqgJYYZxslPmZ1",
    author: "UNICEF",
    readTime: "5 min watch",
    publishDate: "2024-12-23",
    category: "sleep",
    tags: ["sleep training", "newborn"],
    thumbnail: "https://th.bing.com/th/id/OIP.v83GRunV3loT0DWLFysTyQHaE8?w=242&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "video",
  },
  {
    id: 10,
    title: "Your Guide To Healthy Pregnancy",
    description: "Discover essential tips for a healthy and happy pregnancy - from nutrition and exercise to prenatal care and emotional well-being.",
    url: "https://my.clevelandclinic.org/-/scassets/files/org/obgyn/healthy-pregnancy-guide-20.ashx#page=2.06",
    author: "Cleveland Clinic",
    readTime: "40 min read",
    publishDate: "2023",
    category: "health",
    tags: ["prenatal care", "maternal health"],
    thumbnail: "https://th.bing.com/th/id/OIP.cbW2FbnUySpkz9oHtBWknwHaEJ?w=329&h=185&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "journal",
  },
  {
    id: 11,
    title: "Ankle Swelling During Pregnancy",
    description: "Ankle swelling is common during pregnancy due to increased blood volume and fluid retention. Learn why it happens and tips to reduce discomfort safely.",
    url: "https://www.mayoclinic.org/healthy-lifestyle/pregnancy-week-by-week/expert-answers/swelling-during-pregnancy/faq-20058467",
    author: "Mayo Clinic",
    readTime: "2 min read",
    publishDate: "2024-07-09",
    category: "health",
    tags: ["maternal health","pregnancy care"],
    thumbnail: "https://th.bing.com/th/id/OIP.flQAQIygEzQbNAZuElNxyAHaE8?w=243&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "article",
  },
  {
    id: 12,
    title: "Postpartum",
    description: "Postpartum refers to the period after childbirth when a mother’s body recovers and adjusts physically and emotionally.Learn about postpartum care, common symptoms, mental health, and tips for a smooth recovery.",
    url: "https://dev.mycc.clevelandclinic.org/health/articles/postpartum",
    author: "Cleveland Clinic",
    readTime: "5 min read",
    publishDate: "2024-02-27",
    category: "health",
    tags: ["postpartum recovery","new mom care"],
    thumbnail: "https://th.bing.com/th/id/OIP.Ka8qAmWQ6sJef3xdozgz_QHaE8?w=280&h=187&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "article",
  },
  {
    id: 13,
    title: "What to Expect After a Vaginal Birth",
    description: "Learn what to expect with healing, bleeding, pelvic discomfort, hormonal shifts, and tips for caring for yourself and your newborn.",
    url: "https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/in-depth/postpartum-care/art-20047233",
    author: "Mayo Clinic",
    readTime: "5 min read",
    publishDate: "2023-12-27",
    category: "health",
    tags: ["after birth recovery","new mom care"],
    thumbnail: "https://th.bing.com/th/id/OIP.UebDLcjcSp2nJxjls8NNjgHaDt?w=345&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "article",
  },
  {
    id: 14,
    title: "Postpartum Depression",
    description: "Postpartum depression is a common mood disorder that can affect new mothers after childbirth. Learn about the symptoms, risk factors, treatment options, and strategies for support and recovery.",
    url: "https://www.mayoclinic.org/healthy-lifestyle/labor-and-delivery/in-depth/postpartum-care/art-20047233",
    author: "Mayo Clinic",
    readTime: "7 min read",
    publishDate: "2022-11-24",
    category: "health",
    tags: ["postpartum care","mental health"],
    thumbnail: "https://th.bing.com/th/id/OIP.dHSBApc4T_FHvvdAB07m2QHaD4?w=280&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "article",
  },
  {
    id: 15,
    title: "Benefits of Breastfeeding",
    description: "Breastfeeding provides essential nutrition, strengthens the baby’s immune system, and promotes bonding between mother and child. Learn about the health benefits for both baby and mother and tips for successful breastfeeding.",
    url: "https://my.clevelandclinic.org/health/articles/15274-benefits-of-breastfeeding",
    author: "Cleveland Clinic",
    readTime: "5 min read",
    publishDate: "2023-07-17",
    category: "feeding",
    tags: ["infant nutrition","breastfeeding"],
    thumbnail: "https://th.bing.com/th/id/OIP.h3Gbc0hiOQZ-dCjGvo2ouAHaE8?w=275&h=183&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "article",
  },
  {
    id: 16,
    title: "Child Development",
    description: "Child development refers to the physical, cognitive, emotional, and social growth that occurs from infancy through adolescence. Learn key milestones, tips to support healthy growth, and ways to nurture your child’s full potential.",
    url: "https://my.clevelandclinic.org/health/articles/21559-child-development",
    author: "Cleveland Clinic",
    readTime: "8 min read",
    publishDate: "2025-03-04",
    category: "development",
    tags: ["child growth","parenting tips"],
    thumbnail: "https://th.bing.com/th/id/OIP.KrJCX7QzMaYwDGYAoYfFngHaE8?w=230&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
    type: "article",
  },
  {
    id: 17,
    title: "Tips for Temper Tantrums",
    description: "Temper tantrums are common in young children as they learn to express emotions. Learn effective strategies to handle tantrums calmly, set boundaries, and help your child develop emotional regulation skills.",
    url: "https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/tips-for-temper-tantrums",
    author: "Mayo Clinic",
    readTime: "3 min read",
    publishDate: "2020-06-15",
    category: "development",
    tags: ["child behavior","parenting tips"],
    thumbnail: "https://www.mayoclinichealthsystem.org/-/media/national-files/images/hometown-health/2020/toddler-pouting.jpg?sc_lang=en&hash=4378907CB978A6E7154802DC551EDA83",
    type: "article",
  },
  {
    id: 18,
    title: "Early Childhood Development Parenting",
    description: "Early Childhood Development focuses on the physical, cognitive, social, and emotional growth of children from birth to around age 8. Effective parenting during this stage supports learning, emotional regulation, and lifelong well-being.",
    url: "https://www.unicef.org/india/what-we-do/early-childhood-development/parenting",
    author: "UNICEF",
    readTime: "5 min read",
    publishDate: "2020",
    category: "development",
    tags: ["parenting tips","childhood development"],
    thumbnail: "https://www.unicef.org/india/sites/unicef.org.india/files/styles/hero_extended/public/UNI333138.jpg.webp?itok=oozD6L09",
    type: "article",
  },

];

const categories = [
  { id: "all", name: "All Resources" },
  { id: "feeding", name: "Feeding & Nutrition" },
  { id: "sleep", name: "Sleep & Rest" },
  { id: "development", name: "Development" },
  { id: "health", name: "Health & Safety" },
];

const formatCategories = [
  { id: "all", name: "All Formats" },
  { id: "article", name: "Article" },
  { id: "video", name: "Video" },
  { id: "audio", name: "Audio" },
  { id: "podcast", name: "Podcast" },
  { id: "journal", name: "Journals" },
];

//auto-cyclic colors for the tags in the article
const colorClasses = [
  "bg-orange-100 text-orange-600 hover:bg-orange-200",
  "bg-purple-100 text-purple-600 hover:bg-purple-200",
  "bg-teal-100 text-teal-600 hover:bg-teal-200",
  "bg-green-100 text-green-600 hover:bg-green-200",
];

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    document.title = "Resources | NeoNest";
  }, []);

  const filtersApplied = selectedCategory !== "all" || selectedType !== "all";

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      !searchTerm ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;

    const matchesType = selectedType === "all" || article.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Parenting Resources</h2>
        <p className="text-lg text-gray-600 dark:text-gray-200">Curated articles to support your parenting journey</p>
      </div>

      {/* Search + Filters Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg w-full">
          <Search className="absolute left-3 inset-y-0 flex items-center h-full text-gray-400 w-4" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-xl dark:bg-gray-700 border border-gray-200 shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 w-full h-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="flex flex-row md:flex-row gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Category:</span>
              </div>
              <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
                <Select.Trigger
                  className="flex justify-between items-center rounded-xl  dark:bg-gray-700 border border-gray-300 px-3 py-2 text-sm w-full sm:w-auto
            focus:ring-2 focus:ring-pink-500 focus:border-pink-500
            hover:border-pink-400 hover:shadow-md transition duration-150 ease-in-out">
                  <Select.Value placeholder="Select category" />
                  <Select.Icon>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Content className="bg-white  dark:bg-gray-700 border z-50 border-gray-200 rounded-lg shadow-lg overflow-hidden w-full sm:w-auto" position="popper">
                  <Select.Viewport className="p-1">
                    {categories.map((cat) => (
                      <Select.Item key={cat.id} value={cat.id} className="px-3 py-2 text-sm rounded-md hover:bg-pink-100  dark:hover:bg-gray-600 cursor-pointer focus:outline-none">
                        <Select.ItemText>{cat.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>

            {/* Format Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Format:</span>
              </div>
              <Select.Root value={selectedType} onValueChange={setSelectedType}>
                <Select.Trigger
                  className="flex justify-between items-center rounded-xl dark:bg-gray-700 border border-gray-300 px-3 py-2 text-sm w-full sm:w-auto
            focus:ring-2 focus:ring-pink-500 focus:border-pink-500
            hover:border-pink-400 hover:shadow-md transition duration-150 ease-in-out">
                  <Select.Value placeholder="Select format" />
                  <Select.Icon>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Content className="bg-white dark:bg-gray-700 z-50 border border-gray-200 rounded-lg shadow-lg overflow-hidden w-full sm:w-auto" position="popper">
                  <Select.Viewport className="p-1">
                    {formatCategories.map((format) => (
                      <Select.Item key={format.id} value={format.id} className="px-3 py-2 text-sm rounded-md hover:bg-pink-100 dark:hover:bg-gray-600 cursor-pointer focus:outline-none">
                        <Select.ItemText>{format.name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        </div>

        {/* Clear All button */}
        <div className="w-full md:w-auto">
          <Button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedType("all");
            }}
            disabled={!filtersApplied}
            variant="outline"
            className={`rounded-xl text-sm font-medium px-4 h-10 w-full md:w-auto transition-colors
        ${filtersApplied ? "border-pink-300 text-pink-700 bg-pink-50 hover:bg-pink-600 hover:text-white" : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"}`}>
            Clear all
          </Button>
        </div>
      </div>

      {/* Horizontal dividing line */}
      <div className="w-full h-px bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 animate-pulse mt-1"></div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="group bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between cursor-default overflow-hidden h-full">
            {/* Thumbnail */}
            {article.thumbnail && (
              <div className="overflow-hidden rounded-t-xl border-b  border-gray-200">
                <img src={article.thumbnail} alt={article.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
            )}

            <CardHeader className="p-4 !pb-2">
              <CardTitle className="text-lg mt-2 text-gray-800 dark:text-gray-200 transition-colors duration-200 group-hover:text-pink-600">{article.title}</CardTitle>
            </CardHeader>

            <div className="px-4 pb-2">
              <span
                className={`
                  inline-block text-xs font-semibold px-3 py-1 rounded-tl-md rounded-bl-md rounded-tr-sm rounded-br-sm uppercase tracking-wide
        ${
          article.type === "article"
            ? "bg-blue-100 text-blue-600"
            : article.type === "video"
              ? "bg-red-100 text-red-600"
              : article.type === "audio"
                ? "bg-green-100 text-green-600"
                : article.type === "podcast"
                  ? "bg-purple-100 text-purple-600"
                  : article.type === "journal"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-600"
        }
      `}>
                {article.type}
              </span>
            </div>

            <CardContent className="px-4 pb-6 !pt-2 flex flex-col flex-grow justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-4 dark:text-gray-200">{article.description}</p>
                <div className="space-y-1 mb-4 text-sm text-gray-500 dark:text-gray-200">
                  <div className="text-black dark:text-gray-200">By {article.author}</div>
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-200">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </div>
                    <div>{new Date(article.publishDate).toLocaleDateString("en-GB")}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${colorClasses[index % colorClasses.length]}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className="w-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white font-medium rounded-xl transition-all duration-200"
                variant="ghost"
                onClick={() => window.open(article.url, "_blank")}>
                <ExternalLink className="w-4 h-4 mr-2" />
                {article.type === "video" ? "Watch Video" : article.type === "audio" ? "Listen Audio" : "Read More"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <p className="text-gray-600 text-lg">No articles found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedType("all");
            }}
            className="rounded-xl text-pink-600 border-pink-300 hover:bg-pink-50 hover:text-pink-700">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
