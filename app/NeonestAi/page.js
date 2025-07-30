"use client"

import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { Bot, Send, Loader2, Baby, Utensils, Clock, Heart, MessageSquare, ThumbsUp, Users, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../components/ui/tooltip"
import { Button } from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"
import ReactMarkdown from "react-markdown"

import useChatStore from "../store/chatStore"

const quickQuestions = [
  { icon: Baby, text: "When should my baby start crawling?", color: "pink" },
  { icon: Utensils, text: "How do I introduce solid foods?", color: "purple" },
  { icon: Clock, text: "What's a good sleep schedule for 6 months?", color: "blue" },
  { icon: Heart, text: "Is my baby's crying normal?", color: "green" },
]

const roles = [
  { label: "Pediatrician", value: "pediatrician" },
  { label: "Baby", value: "baby" },
  { label: "Motherly", value: "mother" },
]

export default function NeonestAi() {
  useEffect(() => {
    document.title = "NeoNestAi | NeoNest"
  }, [])

  const { role, setRole, messages, addMessage, clearMessages } = useChatStore()

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transitionMessage, setTransitionMessage] = useState(null)
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
  })
  const [showNewMessageButton, setShowNewMessageButton] = useState(false)

  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)

  const scrollToBottom = () => {
    const el = chatContainerRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }
  }

  const isUserNearBottom = () => {
    const el = chatContainerRef.current
    if (el) {
      const threshold = 100
      return el.scrollHeight - el.scrollTop - el.clientHeight < threshold
    }
    return true
  }

  useEffect(() => {
    if (messages.length === 0 || isUserNearBottom()) {
      scrollToBottom()
      setShowNewMessageButton(false)
    } else {
      setShowNewMessageButton(true)
    }
  }, [messages])

  useEffect(() => {
    const handleScroll = () => {
      const el = chatContainerRef.current
      if (!el) return
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
      setShowNewMessageButton(!atBottom)
    }

    const el = chatContainerRef.current
    el?.addEventListener("scroll", handleScroll)
    return () => el?.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = async (e = null, customInput = null) => {
    if (e) e.preventDefault()
    const finalInput = customInput !== null ? customInput : input
    if (!finalInput.trim()) return

    const newMessage = {
      id: Date.now(),
      role: "user",
      content: finalInput,
      createdAt: new Date().toISOString(),
    }

    addMessage(newMessage)
    setInput("")
    setIsLoading(true)

    try {
      const res = await axios.post("/api/chat", {
        messages: [...messages, newMessage],
        role,
      })
      addMessage(res.data)
    } catch (err) {
      console.error("Error sending message:", err)
      addMessage({
        id: Date.now() + 1,
        role: "system",
        content: "Oops! Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInput(question)
    handleSubmit(null, question)
  }

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleRoleChange = (newRole) => {
    clearMessages()
    setRole(newRole)
    setTransitionMessage(`Switched to ${newRole} mode`)
    setTimeout(() => setTransitionMessage(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      {/* Top Chatbot UI */}
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
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="border px-3 py-1 rounded-md text-sm bg-white cursor-pointer text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6}>
                Choose the role you'd like to chat with
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>

        <CardContent className="space-y-6 p-6 relative">
          {transitionMessage && (
            <div className="flex justify-center animate-fade-in">
              <Badge variant="outline">{transitionMessage}</Badge>
            </div>
          )}

          {messages.length === 0 && (
            <div className="text-center space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleQuickQuestion(q.text)}
                    variant="outline"
                    className="text-left justify-start text-sm"
                  >
                    <q.icon className={`w-4 h-4 mr-2 text-${q.color}-500`} />
                    {q.text}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat, Analytics, Top Questions */}
      <div className="max-w-4xl mx-auto space-y-4 -mt-2">
        <Card className="rounded-t-none">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={chatContainerRef}
              className="max-h-[400px] overflow-y-auto border rounded-md p-4 space-y-3 bg-white shadow-sm"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md ${
                    msg.role === "user"
                      ? "bg-blue-100 text-right"
                      : msg.role === "assistant"
                      ? "bg-gray-100 text-left"
                      : "bg-yellow-100 text-left"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ node, children }) => <p className="text-sm whitespace-pre-line my-2">{children}</p>,
                      ul: ({ node, children }) => <ul className="list-disc pl-5 my-2 text-sm">{children}</ul>,
                      ol: ({ node, children }) => <ol className="list-decimal pl-5 my-2 text-sm">{children}</ol>,
                      li: ({ node, children }) => <li className="my-1 text-sm">{children}</li>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                  <span className="text-xs text-gray-500">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about baby care..."
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>

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
              <button
                key={i}
                onClick={() => handleQuickQuestion(q.question)}
                className="flex justify-between text-sm border-b pb-1 w-full text-left hover:bg-gray-100 px-2 py-1 rounded transition"
              >
                <span>{q.question}</span>
                <Badge variant="secondary">{q.count}</Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
