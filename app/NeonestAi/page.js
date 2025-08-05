"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { Baby, Utensils, Clock, Heart } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

import SpeechRecognition from "../components/SpeechRecognition";
import { fetchChatHistory, saveChatHistory } from "@/lib/chatService";
import { useAuth } from "../context/AuthContext";
import { useChatStore } from "@/lib/store/chatStore";

import ChatHeader from "./(components)/ChatHeader";
import ChatBody from "./(components)/ChatBody";
import ChatInput from "./(components)/ChatInput";
import ChatAnalytics from "./(components)/ChatAnalytics";

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
  const { chatHistory = {}, setChatHistory = () => {}, historyLoaded = {}, resetChatHistoryForRole = () => {} } = useChatStore((state) => state || {});
  const messages = useMemo(() => chatHistory[role] || [], [chatHistory, role]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState(null);

  const [analytics] = useState({
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

  const handleRoleChange = (newRole) => {
    resetChatHistoryForRole(newRole);
    setRole(newRole);
    setInput("");
    setIsSending(false);
    setTransitionMessage(`Switched to ${roles.find((r) => r.value === newRole)?.label} mode`);
    setTimeout(() => setTransitionMessage(null), 1500);
    scrollToBottom();
  };

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

  const handleSpeechTranscript = (transcript) => {
    setInput(transcript);
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
      alert("Failed to copy!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <Card className="max-w-4xl mx-auto">
        <ChatHeader role={role} roles={roles} handleRoleChange={handleRoleChange} />
        <CardContent className="space-y-6 p-6 relative">
          <ChatBody
            transitionMessage={transitionMessage}
            messages={messages}
            formatTime={formatTime}
            chatContainerRef={chatContainerRef}
            quickQuestions={quickQuestions}
            handleQuickQuestion={handleQuickQuestion}
            isHistoryLoading={isHistoryLoading}
            isSending={isSending}
            showNewMessageButton={showNewMessageButton}
            scrollToBottom={scrollToBottom}
            setShowNewMessageButton={setShowNewMessageButton}
            copyToClipboard={copyToClipboard}
            isListening={isListening}
            messagesEndRef={messagesEndRef}
            input={input}
            SpeechRecognition={SpeechRecognition}
            handleSpeechTranscript={handleSpeechTranscript}
            setIsListening={setIsListening}
          />

          <ChatInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isListening={isListening}
            isSending={isSending}
            setIsListening={setIsListening}
            SpeechRecognition={SpeechRecognition}
            handleSpeechTranscript={handleSpeechTranscript}
          />
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto space-y-4">
        <ChatAnalytics analytics={analytics} handleQuickQuestion={handleQuickQuestion} />
      </div>
    </div>
  );
}
