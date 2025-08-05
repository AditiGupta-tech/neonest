"use client";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";
import { Loader2, Send } from "lucide-react";

export default function ChatInput({ input, setInput, handleSubmit, isListening, isSending, setIsListening, SpeechRecognition, handleSpeechTranscript }) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 pt-4 items-center">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isListening ? "Listening... Speak now..." : "Ask me about baby care..."}
        className={`flex-1 ${isListening ? "border-green-500 bg-green-50" : "border-pink-300"}`}
        disabled={isSending}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <SpeechRecognition onTranscript={handleSpeechTranscript} isListening={isListening} setIsListening={setIsListening} disabled={isSending} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">Click to start voice input (requires internet connection)</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button type="submit" disabled={isSending || !input.trim()} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
        {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  );
}
