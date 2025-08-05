"use client";
import { CardHeader, CardTitle } from "@/app/components/ui/card";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";
import { Bot } from "lucide-react";

export default function ChatHeader({ role, roles, handleRoleChange }) {
  return (
    <CardHeader className="flex justify-between items-center bg-pink-100 rounded-t-lg px-6 py-4">
      <div className="flex items-center gap-3">
        <Bot className="w-6 h-6 text-pink-500" />
        <CardTitle>NeoNest AI Chatbot</CardTitle>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="border px-3 py-1 rounded-md text-sm bg-white cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>
            Choose the role you&apos;d like to chat with
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardHeader>
  );
}
