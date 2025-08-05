"use client";
import ReactMarkdown from "react-markdown";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";
import { Loader2, Copy } from "lucide-react";

import { Button } from "@/app/components/ui/Button";
import TextToSpeech from "@/app/components/TextToSpeech";

export default function ChatBody({
  transitionMessage,
  messages,
  formatTime,
  chatContainerRef,
  quickQuestions,
  handleQuickQuestion,
  isHistoryLoading,
  isSending,
  showNewMessageButton,
  scrollToBottom,
  setShowNewMessageButton,
  copyToClipboard,
  isListening,
  messagesEndRef,
  input,
  SpeechRecognition,
  handleSpeechTranscript,
  setIsListening,
}) {
  return (
    <>
      {transitionMessage && (
        <div className="absolute top-0 left-0 right-0 flex justify-center z-20">
          <span className="bg-pink-200 text-pink-900 px-6 py-2 rounded-lg shadow-lg font-semibold text-base">{transitionMessage}</span>
        </div>
      )}

      {messages.length === 0 && (
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500 mt-2">AI advice is not a substitute for professional medical consultation.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {quickQuestions.map((q, idx) => (
              <Button key={idx} onClick={() => handleQuickQuestion(q.text)} variant="outline" className="text-left justify-start text-sm">
                <q.icon className={`w-4 h-4 mr-2 text-${q.color}-500`} />
                {q.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {isHistoryLoading ? (
        <div className="space-y-4 max-h-[600px] min-h-[500px] overflow-y-auto pr-2 py-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}>
              <div className={`rounded-xl px-4 py-3 min-w-[60%] ${i % 2 === 0 ? "bg-gray-200" : "bg-gradient-to-r from-pink-300 to-purple-300"}`}>
                <div className="h-4 bg-white/50 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div ref={chatContainerRef} className="space-y-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
          {messages.map((m, index) => (
            <div key={`${m.id || index}-${index}`} className={`flex mt-3 group ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`relative rounded-xl px-4 py-3 max-w-[80%] ${m.role === "user" ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                {/* Action icons */}
                <div
                  className={`absolute bottom-full mb-2 flex gap-1 bg-white p-1 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10
                   ${m.role === "user" ? "right-0" : "left-0"}`}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(m.content)}>
                          <Copy className="w-4 h-4 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy to clipboard</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {m.role === "assistant" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <TextToSpeech text={m.content} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Listen to response</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="prose prose-sm max-w-full text-sm">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 className={`text-2xl font-extrabold mb-2 mt-4 ${m.role === "pediatrician" ? "text-blue-700" : "text-pink-600"}`} {...props} />,
                      h2: ({ node, ...props }) => <h2 className={`text-xl font-semibold mb-2 mt-4 ${m.role === "baby" ? "text-purple-700" : "text-blue-600"}`} {...props} />,
                      h3: ({ node, ...props }) => <h3 className={`text-lg font-semibold mb-2 mt-4 ${m.role === "nani" ? "text-green-700" : "text-pink-500"}`} {...props} />,
                      h4: ({ node, ...props }) => <h4 className={`text-base font-semibold mb-2 mt-4 ${m.role === "general" ? "text-orange-700" : "text-purple-500"}`} {...props} />,
                      p: ({ node, ...props }) => <p className="text-sm leading-relaxed mb-2" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc list-inside text-sm mb-2" {...props} />,
                      li: ({ node, ...props }) => <li className="ml-4 mb-1" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                      em: ({ node, ...props }) => <em className="italic" {...props} />,
                      code: ({ node, ...props }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-pink-300 pl-4 italic text-sm text-gray-600 my-2" {...props} />,
                    }}>
                    {m.content}
                  </ReactMarkdown>
                </div>
                <span className={`text-xs block mt-1 ${m.role === "user" ? "text-gray-300" : "text-pink-700"}`}>{formatTime(m.createdAt)}</span>
              </div>
              {m.role === "assistant" && (
                <div className="flex justify-start mt-2">
                  <TextToSpeech text={m.content} />
                </div>
              )}
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start mt-3">
              <div className="rounded-xl px-4 py-2 max-w-[80%] bg-gray-200 text-gray-800 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">NeoNest AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {showNewMessageButton && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              scrollToBottom();
              setShowNewMessageButton(false);
            }}
            className="text-sm text-white bg-pink-600 px-4 py-1 rounded-full shadow-md hover:bg-pink-700 transition">
            ⬇ New Message
          </button>
        </div>
      )}
    </>
  );
}
