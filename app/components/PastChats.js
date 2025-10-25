import React, { useMemo } from 'react';
import { useChatStore } from '@/lib/store/chatStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Badge from './ui/Badge';
import { Clock, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const PastChats = ({ currentRole }) => {
  const chatHistory = useChatStore((state) => state.chatHistory);
  const pastChats = Object.keys(chatHistory).flatMap(role =>
    chatHistory[role].map(message => ({ ...message, role }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filter chats by current role
  const roleChats = pastChats.filter(chat => chat.role === currentRole);

  // Group chats by date
  const groupedChats = roleChats.reduce((groups, chat) => {
    const date = new Date(chat.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(chat);
    return groups;
  }, {});

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPreviewText = (content) => {
    return content; // Show full content instead of truncating
  };

  const exportToPDF = () => {
    if (roleChats.length === 0) {
      alert('No chats to export for this role.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Chat History - ${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}`, 20, 20);

    let yPosition = 40;
    roleChats.forEach((chat, index) => {
      if (yPosition > 270) { // New page if needed
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text(`[${new Date(chat.createdAt).toLocaleString()}] ${chat.role}:`, 20, yPosition);
      yPosition += 10;

      const lines = doc.splitTextToSize(chat.content, 170);
      doc.setFontSize(10);
      lines.forEach(line => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });
      yPosition += 10; // Space between messages
    });

    doc.save(`chat-history-${currentRole}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Card className="h-full dark:bg-gray-700">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg dark:text-gray-200">Past Chats</CardTitle>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
            disabled={roleChats.length === 0}
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        {Object.keys(groupedChats).length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No past chats yet.</p>
        ) : (
          Object.keys(groupedChats).map((date) => (
            <div key={date} className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {date}
              </h4>
              <div className="space-y-1">
                {groupedChats[date].slice(0, 5).map((chat, index) => (
                  <div
                    key={`${chat.id || index}-${index}`}
                    className="p-2 bg-gray-50 dark:bg-gray-600 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {chat.role}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(chat.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {getPreviewText(chat.content)}
                    </p>
                  </div>
                ))}
                {groupedChats[date].length > 5 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{groupedChats[date].length - 5} more chats
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default PastChats;

