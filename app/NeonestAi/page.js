"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useChatStore } from "@/lib/store/chatStore";
import SpeechRecognition from "../components/SpeechRecognition";
import ChatHeader from "./(components)/ChatHeader";
import ChatBody from "./(components)/ChatBody";
import ChatInput from "./(components)/ChatInput";
import ChatAnalytics from "./(components)/ChatAnalytics";
import { createAxiosInstance } from "@/app/utils/axiosInstance";
import ChatHistoryPanel from "./(components)/ChatHistoryPanel";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { ROLES } from "../utils/chat";

export default function NeonestAi() {
  const { token } = useAuth();
  const axiosInstance = useMemo(() => createAxiosInstance(token), [token]);

  const [role, setRole] = useState("pediatrician");

  useEffect(() => {
    const savedRole = localStorage.getItem("neonest-active-role");
    if (savedRole && savedRole !== role) setRole(savedRole);
  }, []);

  const [activeChatId, setActiveChatId] = useState(null);
  const { isHistoryLoaded, chatHistory = {}, setChatHistory = () => {}, historyLoaded = {}, chatSessions = [], setChatSessions = () => {} } = useChatStore((state) => state || {});

  const messages = useMemo(() => (activeChatId ? chatHistory[activeChatId] || [] : []), [chatHistory, activeChatId]);
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

  useEffect(() => {
    const savedRole = localStorage.getItem("neonest-active-role");
    if (savedRole && savedRole !== role) setRole(savedRole);
  }, []);

  useEffect(() => {
    localStorage.setItem("neonest-active-role", role);
  }, [role]);

  useEffect(() => {
    async function fetchSessions() {
      if (!token || !role) return;
      setIsHistoryLoading(true);
      try {
        const res = await axiosInstance.get(`/api/chat/list?role=${role}`, { headers: { Authorization: `Bearer ${token}` } });
        setChatSessions(Array.isArray(res.data) ? res.data : []);
        let toSet = null;
        if (Array.isArray(res.data) && res.data.length > 0) {
          const lastId = localStorage.getItem("neonest-active-chat-id");
          if (lastId && res.data.some((c) => c._id === lastId)) toSet = lastId;
          else toSet = res.data[0]._id;
        }
        setActiveChatId(toSet);
        if (toSet) localStorage.setItem("neonest-active-chat-id", toSet);
        else localStorage.removeItem("neonest-active-chat-id");
      } catch {
        setChatSessions([]);
        setActiveChatId(null);
        localStorage.removeItem("neonest-active-chat-id");
      } finally {
        setIsHistoryLoading(false);
      }
    }
    fetchSessions();
  }, [role, token]);

  useEffect(() => {
    async function fetchMessages() {
      if (!activeChatId || historyLoaded[activeChatId]) return;
      setIsHistoryLoading(true);
      try {
        const res = await axiosInstance.get(`/api/chat/history?id=${activeChatId}`, { headers: { Authorization: `Bearer ${token}` } });
        setChatHistory(activeChatId, res.data.messages);
      } catch {
        setChatHistory(activeChatId, []);
      } finally {
        setIsHistoryLoading(false);
      }
    }
    if (activeChatId) fetchMessages();
  }, [activeChatId, token]);

  const isUserNearBottom = () => {
    const el = chatContainerRef.current;
    if (el) {
      const threshold = 100;
      return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    }
    return true;
  };

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
    setRole(newRole);
    localStorage.setItem("neonest-active-role", newRole);
    setActiveChatId(null);
    localStorage.removeItem("neonest-active-chat-id");
    setInput("");
    setIsSending(false);
    setTransitionMessage(`Switched to ${ROLES.find((r) => r.value === newRole)?.label} mode`);
    setTimeout(() => setTransitionMessage(null), 1500);
  };

  const handleSelectChat = async (chatId) => {
    localStorage.setItem("neonest-active-chat-id", chatId);
    if (isHistoryLoaded(chatId)) {
      setActiveChatId(chatId);
    } else {
      setIsHistoryLoading(true);
      try {
        const res = await axiosInstance.get(`/api/chat/history?id=${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatHistory(chatId, res.data.messages || []);
        setActiveChatId(chatId);
      } finally {
        setIsHistoryLoading(false);
      }
    }
  };

  const handleTitleEdited = (chatId, newTitle) => {
    setChatSessions((prev) => prev.map((c) => (c._id === chatId ? { ...c, title: newTitle } : c)));
  };

  const handleChatDeleted = (chatId) => {
    setChatSessions((prev) => prev.filter((c) => c._id !== chatId));
    const next = chatSessions.find((c) => c._id !== chatId);
    if (activeChatId === chatId) {
      if (next) {
        setActiveChatId(next._id);
        localStorage.setItem("neonest-active-chat-id", next._id);
      } else {
        setActiveChatId(null);
        localStorage.removeItem("neonest-active-chat-id");
      }
    }
  };

  const handleSubmit = async (e = null, customInput = null) => {
    if (e) e.preventDefault();
    const finalInput = customInput !== null ? customInput : input;
    if (!finalInput.trim()) return;
    setIsSending(true);

    if (!activeChatId) {
      try {
        const res = await axiosInstance.post("/api/chat/new", { role, message: finalInput }, { headers: { Authorization: `Bearer ${token}` } });
        const newChat = {
          _id: res.data._id,
          role: res.data.role,
          title: res.data.title,
          startedAt: res.data.startedAt,
        };
        setChatSessions((prev) => [newChat, ...prev]);
        setActiveChatId(newChat._id);
        localStorage.setItem("neonest-active-chat-id", newChat._id);
        setChatHistory(newChat._id, []);
        const newMessage = {
          id: Date.now(),
          role: "user",
          content: finalInput,
          createdAt: new Date().toISOString(),
        };
        const updatedMessages = [newMessage];
        setChatHistory(newChat._id, updatedMessages);
        setInput("");
        const res2 = await axiosInstance.post(
          "/api/chat",
          {
            chatId: newChat._id,
            messages: updatedMessages,
            role,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const finalMessages = [...updatedMessages, res2.data];
        setChatHistory(newChat._id, finalMessages);
      } finally {
        setIsSending(false);
      }
      return;
    }

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: finalInput,
      createdAt: new Date().toISOString(),
    };
    const updatedMessages = [...messages, newMessage];
    setChatHistory(activeChatId, updatedMessages);
    setInput("");
    try {
      const res = await axiosInstance.post(
        "/api/chat",
        {
          chatId: activeChatId,
          messages: updatedMessages,
          role,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const finalMessages = [...updatedMessages, res.data];
      setChatHistory(activeChatId, finalMessages);
    } catch {
      const errorMsg = {
        id: Date.now() + 1,
        role: "system",
        content: "Oops! Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setChatHistory(activeChatId, [...updatedMessages, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    handleSubmit(null, question);
  };

  const handleSpeechTranscript = (transcript) => {
    setInput(transcript);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    localStorage.removeItem("neonest-active-chat-id");
    setInput("");
    setTransitionMessage("Started a new chat");
    setTimeout(() => setTransitionMessage(null), 1500);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      alert("Failed to copy!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="w-full rounded-lg border bg-white shadow overflow-hidden">
          <ChatHeader role={role} handleRoleChange={handleRoleChange} />
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel defaultSize={25} minSize={16} maxSize={33}>
              <ChatHistoryPanel
                role={role}
                chatSessions={chatSessions}
                activeChatId={activeChatId}
                isLoading={isHistoryLoading}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                onChatDeleted={handleChatDeleted}
                onTitleEdited={handleTitleEdited}
                token={token}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} minSize={50}>
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto px-4">
                  <ChatBody
                    transitionMessage={transitionMessage}
                    messages={messages}
                    chatContainerRef={chatContainerRef}
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
                </div>
                <div className="border-t p-4">
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
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <div className="mt-8">
          <ChatAnalytics analytics={analytics} handleQuickQuestion={handleQuickQuestion} />
        </div>
      </div>
    </div>
  );
}
