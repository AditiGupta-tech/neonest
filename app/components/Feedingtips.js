import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Utensils } from "lucide-react";

const Feedingtips = () => {
  return (
    <div>
      <section id="feeding-tips" className="py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 text-gray-800 leading-tight">
              Feeding Tips
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Guidance for nourishing your baby at every stage
            </p>
          </div>

          {/* Top 2 Side-by-Side Cards - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-center text-blue-700 leading-tight">
                  General Feeding Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ul className="space-y-2 sm:space-y-3 list-disc list-inside text-xs sm:text-sm lg:text-base text-gray-700">
                  {[
                    "Always feed in a calm, comfortable setting.",
                    "Sterilize bottles and utensils properly.",
                    "Watch for hunger cues rather than sticking to strict schedules.",
                    "Burp your baby after every feed.",
                    "Do not add cereal to bottles unless prescribed.",
                    "Gradually introduce one solid food at a time after 6 months.",
                    "Ensure baby stays upright during and after feeding.",
                    "Avoid honey before 12 months.",
                    "Keep hydrated – breast milk or formula covers hydration until 6 months.",
                    "Trust your baby's appetite – don't force-feed.",
                  ].map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-center text-red-700 leading-tight">
                  Feeding Cautions & Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ul className="space-y-2 sm:space-y-3 list-disc list-inside text-xs sm:text-sm lg:text-base text-gray-700">
                  {[
                    "Do not feed cow's milk before 1 year.",
                    "Avoid choking hazards – no nuts, grapes, or raw carrots early on.",
                    "Check food temperature before feeding.",
                    "Don't prop bottles or leave baby unattended.",
                    "Limit juice; it's not necessary for infants.",
                    "Watch for food allergies – introduce one new food every 3 days.",
                    "No added salt or sugar in baby foods.",
                    "Always supervise during solid feeding.",
                    "Avoid overfeeding – look for satiety signs.",
                    "Breastfeeding mothers should monitor their diet too.",
                  ].map((tip, idx) => (
                    <li key={idx} className="leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Age-wise Feeding Tips Cards - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                month: "0-3 Months",
                color: "pink",
                icon: Utensils,
                tips: [
                  "Exclusive breastfeeding or formula.",
                  "Feed every 2–3 hours.",
                  "Watch for rooting and sucking cues.",
                  "Burp after every feed.",
                  "Avoid overfeeding – small stomachs.",
                  "No water or solids yet.",
                ],
              },
              {
                month: "4-6 Months",
                color: "purple",
                icon: Utensils,
                tips: [
                  "May start solids if baby is ready.",
                  "Begin with iron-rich single grains.",
                  "Introduce spoon-feeding slowly.",
                  "Breast milk/formula still primary.",
                  "Avoid allergenic foods initially.",
                  "Ensure sitting support during feeding.",
                ],
              },
              {
                month: "7-9 Months",
                color: "blue",
                icon: Utensils,
                tips: [
                  "Introduce mashed fruits/veggies.",
                  "Offer water in small amounts.",
                  "Start finger foods like soft bananas.",
                  "Use soft spoons and baby bowls.",
                  "Encourage self-feeding exploration.",
                  "Gradually increase feeding frequency.",
                ],
              },
              {
                month: "10-12 Months",
                color: "green",
                icon: Utensils,
                tips: [
                  "Offer family foods in soft form.",
                  "Encourage spoon and cup use.",
                  "Introduce 3 meals + 2 snacks routine.",
                  "Avoid high-sugar/salty foods.",
                  "Still include breast milk/formula.",
                  "Let baby decide how much to eat.",
                ],
              },
            ].map((stage, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center p-4 sm:p-6">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto rounded-full bg-${stage.color}-400 flex items-center justify-center mb-3 sm:mb-4`}
                  >
                    <stage.icon className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-${stage.color}-600`} />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl leading-tight">{stage.month}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <ul className="space-y-2 sm:space-y-3">
                    {stage.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm lg:text-base leading-relaxed">
                        <div className={`w-2 h-2 rounded-full bg-${stage.color}-400 flex-shrink-0 mt-1.5 sm:mt-2`}></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Information - Responsive */}
      <div className="text-center text-gray-500 text-xs sm:text-sm lg:text-base mt-6 sm:mt-8 lg:mt-10 mb-4 sm:mb-6 px-4">
        For more information regarding this section, visit{" "}
        <a href="/Resources" className="text-pink-600 hover:underline font-medium">
          Resources
        </a>{" "}
        or{" "}
        <a href="/Faqs" className="text-pink-600 hover:underline font-medium">
          FAQs
        </a>
        .
      </div>
    </div>
  );
};

export default Feedingtips;