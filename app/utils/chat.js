export const QUICKQUESTIONS = [
  { icon: require("lucide-react").Baby, text: "When should my baby start crawling?", color: "pink" },
  { icon: require("lucide-react").Utensils, text: "How do I introduce solid foods?", color: "purple" },
  { icon: require("lucide-react").Clock, text: "What's a good sleep schedule for 6 months?", color: "blue" },
  { icon: require("lucide-react").Heart, text: "Is my baby's crying normal?", color: "green" },
];

export const ROLES = [
  { label: "Pediatrician", value: "pediatrician" },
  { label: "Baby", value: "baby" },
  { label: "Motherly", value: "mother" },
];

export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  } catch {
    alert("Failed to copy!");
  }
}
