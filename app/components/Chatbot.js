"use client"

import { MessageCircle, Mic } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../components/ui/tooltip"

export default function Chatbot() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/NeonestAi") {
      setIsVisible(false)
    }
  }, [])

  if (!isVisible) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => router.push("/NeonestAi")}
            className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-full shadow-md transition-all duration-200 ease-in-out flex items-center justify-center"
            aria-label="Open NeoNest Chatbot"
          >
            <MessageCircle className="w-5 h-5" /> 
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Chat with NeoNest AI (with voice support)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}