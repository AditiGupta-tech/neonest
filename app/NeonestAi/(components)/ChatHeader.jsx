"use client";
import { CardHeader, CardTitle } from "@/app/components/ui/card";
import { ROLES } from "@/app/utils/chat";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Bot, ChevronDown } from "lucide-react";

export default function ChatHeader({ role, handleRoleChange }) {
  const currentRole = ROLES.find((r) => r.value === role);

  return (
    <CardHeader className="flex !flex-row gap-4 items-center bg-pink-100 rounded-t-lg px-6 py-4 w-full">
      <div className="flex items-center gap-3">
        <Bot className="w-6 h-6 text-pink-500" />
        <CardTitle className="text-lg font-semibold text-pink-600">NeoNest AI Chatbot</CardTitle>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex !mt-0 items-center gap-2 border px-3 py-1 rounded-md text-sm bg-white cursor-pointer text-gray-700 font-medium hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition">
            {currentRole?.label || "Choose Role"}
            <ChevronDown className="w-4 h-4 text-pink-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6}>
          {ROLES.map((r) => (
            <DropdownMenuItem key={r.value} onClick={() => handleRoleChange(r.value)} className={role === r.value ? "font-semibold text-pink-500" : ""}>
              {r.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
  );
}
