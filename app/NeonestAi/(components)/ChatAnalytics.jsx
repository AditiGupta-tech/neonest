"use client";

import Badge from "@/app/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { BarChart3, MessageSquare, Users, Clock, ThumbsUp } from "lucide-react";

export default function ChatAnalytics({ analytics, handleQuickQuestion }) {
  return (
    <div className="space-y-4">
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
  );
}
