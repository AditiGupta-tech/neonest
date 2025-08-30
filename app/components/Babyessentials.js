import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ShoppingCart, Plus } from "lucide-react";
import Badge from "./ui/Badge";

const indianBabyEssentials = [
  { name: "Cotton Diapers (Langot)", use: "Traditional, reusable diapers for comfort.", category: "clothing" },
  { name: "Mustard Seed Pillow (Sarson ka Takiya)", use: "Shapes baby's head and prevents flat head syndrome.", category: "traditional" },
  { name: "Baby Massage Oil", use: "For daily massages to promote circulation and bonding.", category: "health" },
  { name: "Kajal/Surma", use: "Applied around eyes for traditional beliefs and to ward off evil eye.", category: "traditional" },
  { name: "Baby Wipes/Soft Cloths", use: "For quick and gentle cleaning during diaper changes.", category: "diapering" },
  { name: "Formula/Breast Milk Storage", use: "Essential for feeding, whether nursing or formula feeding.", category: "feeding" },
  { name: "Swaddling Cloths", use: "Helps soothe baby and promotes better sleep.", category: "clothing" },
  { name: "Baby Bathtub/Bucket", use: "For safe and convenient bathing.", category: "bathing" },
  { name: "Baby Soap/Shampoo", use: "Mild cleansers for baby's delicate skin and hair.", category: "bathing" },
  { name: "Nail Clipper/File", use: "To keep baby's nails short and prevent scratches.", category: "health" },
  { name: "Thermometer", use: "To monitor baby's temperature when unwell.", category: "health" },
  { name: "Burp Cloths", use: "Protects clothes from spit-up during and after feeding.", category: "feeding" },
  { name: "Mosquito Net", use: "Protects baby from mosquito bites while sleeping.", category: "sleeping" },
  { name: "Baby Carrier/Sling", use: "For hands-free carrying and bonding.", category: "travel" },
  { name: "Rattles/Soft Toys", use: "Stimulates senses and provides entertainment.", category: "playtime" },
  { name: "Cotton Nappies", use: "Soft reusable nappies for newborns during daytime.", category: "clothing" },
  { name: "Baby Blanket (Lightweight)", use: "Keeps baby warm during naps and sleep.", category: "sleeping" },
  { name: "Quick-Dry Sheet", use: "Prevents bed from getting wet during leaks.", category: "sleeping" },
  { name: "Jhablas (Cotton Tops)", use: "Easy-to-wear loose shirts for warm weather.", category: "clothing" },
  { name: "Baby Cap & Mittens Set", use: "Regulates temperature and prevents scratches.", category: "clothing" },
  { name: "Wooden Neem Comb", use: "Promotes scalp health and prevents cradle cap.", category: "health" },
  { name: "Towel with Hood", use: "Wraps baby after bath and keeps head warm.", category: "bathing" },
  { name: "Diaper Rash Powder/Cream", use: "Soothes and prevents diaper rashes.", category: "diapering" },
  { name: "Baby Comb & Brush Set", use: "Grooms fine baby hair gently.", category: "bathing" },
  { name: "Feeding Bowl & Spoon", use: "For starting solids around 6 months.", category: "feeding" },
  { name: "Sterilizing Container", use: "For cleaning feeding accessories without boiling.", category: "feeding" },
  { name: "Lullaby Music Toy", use: "Helps baby relax and sleep better.", category: "sleeping" },
  { name: "Teething Gel", use: "Soothes sore gums during teething phase.", category: "health" },
  { name: "Liquid Cleanser (for bottles & toys)", use: "Cleans feeding items and toys safely.", category: "cleaning" },
  { name: "Antiseptic Cream", use: "For minor cuts and rashes during crawling phase.", category: "health" },
];

const getCategoryBadgeProps = (category) => {
  switch (category) {
    case "clothing":
      return { className: "bg-purple-200 text-purple-800 hover:bg-purple-300" };
    case "health":
      return { className: "bg-green-200 text-green-800 hover:bg-green-300" };
    case "feeding":
      return { className: "bg-orange-200 text-orange-800 hover:bg-orange-300" };
    case "diapering":
      return { className: "bg-red-400 text-red-800 hover:bg-red-300" };
    case "bathing":
      return { className: "bg-cyan-200 text-cyan-800 hover:bg-cyan-300" };
    case "sleeping":
      return { className: "bg-indigo-200 text-indigo-800 hover:bg-indigo-300" };
    case "playtime":
      return { className: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300" };
    case "travel":
      return { className: "bg-teal-200 text-teal-800 hover:bg-teal-300" };
    case "traditional":
      return { className: "bg-rose-200 text-rose-800 hover:bg-rose-300" };
    case "cleaning":
      return { className: "bg-lime-200 text-lime-800 hover:bg-lime-300" };
    default:
      return { className: "bg-gray-200 text-gray-800 hover:bg-gray-300" };
  }
};

const Babyessentials = ({ onAddEssential }) => {
  return (
    <Card className="bg-white/80 dark:bg-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center dark:text-gray-200 gap-2">
          <ShoppingCart className="w-5 h-5 text-green-600" />
          Common Baby Essentials
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[250px] overflow-y-auto pr-2">
        {indianBabyEssentials.map((item, index) => {
          const badgeProps = getCategoryBadgeProps(item.category);
          return (
            <div
              key={index}
              className="p-3 bg-pink-100 dark:bg-gray-600  rounded-lg shadow-sm
                         hover:bg-pink-50 hover:border-blue-200 hover:shadow-md
                         transition-all duration-200 cursor-default flex flex-col justify-between">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{item.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-200 mb-2">{item.use}</p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Badge className={`${badgeProps.className} capitalize dark:text-gray-800`}>{item.category}</Badge>

                <button
                  onClick={() => onAddEssential(item.name, item.category)}
                  className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors
                             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  title={`Add ${item.name} to inventory`}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default Babyessentials;
