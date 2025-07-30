"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { Bot, Send, Loader2, Baby, Utensils, Clock, Heart, MessageSquare, ThumbsUp, Users, BarChart3, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip";

import { Button } from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import ReactMarkdown from "react-markdown";

import { fetchChatHistory, saveChatHistory } from "@/lib/chatService";
import { useAuth } from "../context/AuthContext";
import { useChatStore } from "@/lib/store/chatStore";

const quickQuestions = [
  { icon: Baby, text: "When should my baby start crawling?", color: "pink" },
  { icon: Utensils, text: "How do I introduce solid foods?", color: "purple" },
  { icon: Clock, text: "What's a good sleep schedule for 6 months?", color: "blue" },
  { icon: Heart, text: "Is my baby's crying normal?", color: "green" },
];

const roles = [
  { label: "Pediatrician", value: "pediatrician" },
  { label: "Baby", value: "baby" },
  { label: "Motherly", value: "mother" },
];

export default function NeonestAi() {
  const [role, setRole] = useState("pediatrician");
  const { chatHistory = {}, setChatHistory = () => {}, historyLoaded = {} } = useChatStore((state) => state || {});
  const messages = useMemo(() => chatHistory[role] || [], [chatHistory, role]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [analytics, setAnalytics] = useState({
    totalChats: 1247,
    totalMessages: 5832,
    averageResponseTime: 1.2,
    satisfactionRate: 94.5,
    topQuestions: [
      { question: "When should my baby start crawling?", count: 156 },
      { question: "How do I introduce solid foods?", count: 134 },
      { question: "What's a good sleep schedule?", count: 98 },
      { question: "Is my baby's crying normal?", count: 87 },
      { question: "When do babies start teething?", count: 76 },
    ],
  });
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { token } = useAuth();

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  const isUserNearBottom = () => {
    const el = chatContainerRef.current;
    if (el) {
      const threshold = 100;
      return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    }
    return true;
  };

  useEffect(() => {
    if (historyLoaded[role]) return;

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const messages = await fetchChatHistory(role, token);
        setChatHistory(role, messages);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        setChatHistory(role, []);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    if (token) loadHistory();
  }, [role, token, chatHistory, setChatHistory]);

  useEffect(() => {
    if (messages.length === 0 || isUserNearBottom()) {
      scrollToBottom();
      setShowNewMessageButton(false);
    } else {
      setShowNewMessageButton(true);
    }
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      const el = chatContainerRef.current;
      if (!el) return;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
      setShowNewMessageButton(!atBottom);
    };

    const el = chatContainerRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e = null, customInput = null) => {
    if (e) e.preventDefault();
    const finalInput = customInput !== null ? customInput : input;

    if (!finalInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: finalInput,
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setChatHistory(role, updatedMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await axios.post("/api/chat", {
        messages: updatedMessages,
        role,
      });

      const finalMessages = [...updatedMessages, res.data];
      setChatHistory(role, finalMessages);
      await saveChatHistory(role, finalMessages, token);
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMsg = {
        id: Date.now() + 1,
        role: "system",
        content: "Oops! Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setChatHistory(role, [...updatedMessages, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    handleSubmit(null, question);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Failed to copy!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <Card className="max-w-4xl mx-auto">
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
                  onChange={(e) => setRole(e.target.value)}
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

        <CardContent className="space-y-6 p-6 relative">
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

          <form onSubmit={handleSubmit} className="flex gap-2 pt-4 items-center">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me about baby care..." className="flex-1 border-pink-300" disabled={isSending} />
            <Button type="submit" disabled={isSending || !input.trim()} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Chat Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <MessageSquare className="mx-auto text-pink-500" />
              <p className="font-bold">{analytics.totalChats}</p>
              <p className="text-xs text-gray-500">Total Conversations</p>
            </div>
            <div>
              <Users className="mx-auto text-purple-500" />
              <p className="font-bold">{analytics.totalMessages}</p>
              <p className="text-xs text-gray-500">Messages Sent</p>
            </div>
            <div>
              <Clock className="mx-auto text-blue-500" />
              <p className="font-bold">{analytics.averageResponseTime}s</p>
              <p className="text-xs text-gray-500">Avg. Response Time</p>
            </div>
            <div>
              <ThumbsUp className="mx-auto text-green-500" />
              <p className="font-bold">{analytics.satisfactionRate}%</p>
              <p className="text-xs text-gray-500">Satisfaction</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.topQuestions?.map((q, i) => (
              <button key={i} onClick={() => handleQuickQuestion(q.question)} className="flex justify-between text-sm border-b pb-1 w-full text-left hover:bg-gray-100 px-2 py-1 rounded transition">
                <span>{q.question}</span>
                <Badge variant="secondary">{q.count}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
