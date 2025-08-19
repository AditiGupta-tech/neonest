// page.js

"use client";

import React, { useState, useMemo } from "react";
import { useNotifications } from "../context/NotificationContext";
import { Bell, Filter, Trash2, Check, ExternalLink, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "../components/ui/Button";

const NotificationsPage = () => {
  const {
    notifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    deleteAllNotifications, // The function to call
    isLoading,
  } = useNotifications();

  // ... (rest of the component logic)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-100 rounded-full">
              <Bell className="text-pink-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {notifications.length} total • {notifications.filter((n) => !n.isRead).length} unread
              </p>
            </div>
          </div>

          {/* New Button Here */}
          <div className="flex items-center gap-2">
            <Button
              onClick={markAllAsRead}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Check size={16} className="mr-2" /> Mark all read
            </Button>

            {/* Added "Delete All" button */}
            {notifications.length > 0 && (
              <Button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete all notifications?")) {
                    deleteAllNotifications();
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={notifications.length === 0}
              >
                <Trash2 size={16} className="mr-2" /> Delete All
              </Button>
            )}
          </div>
        </div>

        {/* ... (rest of the component) */}
      </div>
    </div>
  );
};

export default NotificationsPage;
