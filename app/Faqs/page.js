"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/Button"
import Input from "../components/ui/Input"
import {
  ChevronDown,
  ChevronUp,
  Search,
  Baby,
  Utensils,
  Moon,
  Shield,
} from "lucide-react"

const faqCategories = [
  {
    id: "feeding",
    title: "Feeding & Nutrition",
    icon: Utensils,
    color: "pink",
    faqs: [
      {
        question: "When should I start introducing solid foods?",
        answer:
          "Most babies are ready for solid foods around 6 months of age. Signs of readiness include sitting up with support, showing interest in food, and losing the tongue-thrust reflex.",
      },
      {
        question: "How often should I breastfeed my newborn?",
        answer:
          "Newborns typically need to feed every 2-3 hours, or 8-12 times per day. Follow your baby's hunger cues rather than strict schedules.",
      },
      {
        question: "How do I know if my baby is getting enough milk?",
        answer:
          "Look for 6-8 wet diapers a day, steady weight gain, and a baby who seems content after feeding. Your pediatrician will track their growth at checkups.",
      },
      {
        question: "When can my baby have water?",
        answer:
          "It's best to wait until your baby is around 6 months old and starting solids. Breast milk or formula provides all the hydration they need before then.",
      },
      {
        question: "What's the difference between spit-up and vomit?",
        answer:
          "Spit-up is a gentle flow of milk from your baby's mouth, while vomit is more forceful and involves a larger volume. Frequent, forceful vomiting warrants a call to the doctor.",
      },
      {
        question: "How should I store expressed breast milk?",
        answer:
          "Store breast milk in clean bottles or bags. It can be kept at room temperature for up to 4 hours, in the fridge for up to 4 days, or in the freezer for about 6 months.",
      },
      {
        question: "What foods should I avoid giving my baby?",
        answer:
          "Avoid honey (before 12 months), whole nuts, hard candies, popcorn, and foods that are choking hazards. Also avoid cow's milk as a drink before 12 months.",
      },
    ],
  },
  {
    id: "sleep",
    title: "Sleep & Rest",
    icon: Moon,
    color: "purple",
    faqs: [
      {
        question: "How much sleep does my baby need?",
        answer:
          "Newborns sleep 14-17 hours per day, while 6-12 month olds need 12-16 hours including naps. Sleep patterns vary greatly between babies.",
      },
      {
        question: "What is a good bedtime routine?",
        answer:
          "A simple, calming routine can help signal it's time to sleep. Try a warm bath, a gentle massage, reading a short story, or singing a lullaby.",
      },
      {
        question: "When will my baby sleep through the night?",
        answer:
          "Most babies can sleep through the night (6-8 hours) by 3-6 months, but this varies. Some may take longer, and that's completely normal.",
      },
      {
        question: "Is it safe for my baby to sleep on their stomach?",
        answer:
          "No, always place babies on their back to sleep to reduce the risk of SIDS. Once they can roll over on their own, it's okay if they choose to sleep on their stomach.",
      },
      {
        question: "When should I stop swaddling my baby?",
        answer:
          "Stop swaddling when your baby shows signs of rolling over, which is usually around 2-4 months. Transition to a sleep sack for safety.",
      },
      {
        question: "How do I handle sleep regressions?",
        answer:
          "Sleep regressions are normal and often linked to growth spurts or developmental milestones. Stick to your routine, offer extra comfort, and it should pass in a few weeks.",
      },
    ],
  },
  {
    id: "development",
    title: "Development & Milestones",
    icon: Baby,
    color: "blue",
    faqs: [
      {
        question: "When should my baby start crawling?",
        answer:
          "Most babies start crawling between 6-10 months. Some babies skip crawling entirely and go straight to walking, which is also normal.",
      },
      {
        question: "Why is tummy time important?",
        answer:
          "Tummy time helps strengthen your baby's neck and shoulder muscles, which are crucial for rolling over and crawling. It also helps prevent a flat spot on their head.",
      },
      {
        question: "How can I help with teething pain?",
        answer:
          "Offer a solid, chilled teething toy or a cool, wet washcloth. Gently massaging their gums with a clean finger can also provide relief.",
      },
      {
        question: "When do babies typically say their first words?",
        answer:
          "First words usually appear between 10-14 months. 'Mama' and 'dada' are often among the first words, though they may not be used meaningfully at first.",
      },
      {
        question: "Should I worry if my baby isn't hitting milestones?",
        answer:
          "Babies develop at their own pace, and there's a wide range of normal. However, if you have concerns about a significant delay, always discuss it with your pediatrician.",
      },
      {
        question: "How can I encourage my baby's development?",
        answer:
          "Talk, read, and sing to your baby regularly. Provide tummy time, offer age-appropriate toys, and respond to their cues and attempts at communication.",
      },
    ],
  },
  {
    id: "health",
    title: "Health & Safety",
    icon: Shield,
    color: "green",
    faqs: [
      {
        question: "When should I call the pediatrician?",
        answer:
          "Call for fever over 100.4°F (38°C) in a newborn, difficulty breathing, persistent vomiting, signs of dehydration, or if you're concerned about any changes in behavior.",
      },
      {
        question: "How often should I bathe my baby?",
        answer:
          "A full bath 2-3 times a week is usually enough for a baby in the first year. Too much bathing can dry out their sensitive skin.",
      },
      {
        question: "What should I do for a diaper rash?",
        answer:
          "Change diapers frequently, clean the area gently with water, and allow it to air dry. Apply a thick layer of zinc oxide diaper cream for protection.",
      },
      {
        question: "How do I care for the umbilical cord stump?",
        answer:
          "Keep the stump clean and dry until it falls off on its own, usually within 1-2 weeks. Fold the diaper down to expose it to air and give sponge baths until it has healed.",
      },
      {
        question: "How often should my baby have checkups?",
        answer:
          "Regular checkups are typically at birth, 3-5 days, 2 weeks, and then at 2, 4, 6, 9, and 12 months during the first year.",
      },
      {
        question: "What vaccines does my baby need?",
        answer:
          "Follow the CDC vaccination schedule, which includes vaccines for hepatitis B, DTaP, Hib, PCV, IPV, rotavirus, and others. Your pediatrician will guide you.",
      },
    ],
  },
]

export default function Page() {

  useEffect(() => {
      document.title = "FAQs | NeoNest";
    }, []);
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const filteredFAQs = faqCategories.filter((category) => {
    if (selectedCategory !== "all" && category.id !== selectedCategory) return false

    if (searchTerm) {
      return category.faqs.some(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return true
  })

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8"> {/* Changed max-w-4xl to max-w-6xl */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
        <p className="text-xl text-gray-600 mb-8">Find quick answers to common baby care questions</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            size="sm"
          >
            All
          </Button>
          {faqCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className="flex items-center gap-2"
            >
              <category.icon className="w-4 h-4" />
              {category.title}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        {filteredFAQs.map((category) => (
          <Card key={category.id} className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${category.color}-100`}>
                  <category.icon className={`w-5 h-5 text-${category.color}-600`} />
                </div>
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-4">
              {category.faqs
                .filter(
                  (faq) =>
                    !searchTerm ||
                    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((faq, index) => {
                  const isExpanded = expandedFAQ === `${category.id}-${index}`
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg my-2">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setExpandedFAQ(isExpanded ? null : `${category.id}-${index}`)
                        }
                        className="w-full justify-between p-5 h-auto text-left"
                      >
                        <span className="font-medium">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      {isExpanded && (
                        <div className="px-5 pb-5 text-gray-600">{faq.answer}</div>
                      )}
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}