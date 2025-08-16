"use client";

import React, { useState } from "react";
import { Button } from "./ui/Button";
import { notificationService } from "../utils/notificationService";
import { useNotifications } from "../context/NotificationContext";
import { 
  Bell, 
  Baby, 
  Utensils, 
  Moon, 
  Syringe, 
  Gift, 
  Package, 
  Cloud, 
  Calendar,
  Play,
  Trash2
} from "lucide-react";

const NotificationDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { notifications, fetchNotifications, deleteNotification } = useNotifications();

  const handleCreateNotification = async (type) => {
    setIsLoading(true);
    try {
      let notification;
      switch (type) {
        case "feeding":
          notification = await notificationService.createFeedingReminder(
            new Date(Date.now() + 5 * 60 * 1000),
            "Baby",
            "formula"
          );
          break;
        case "sleep":
          notification = await notificationService.createSleepReminder(
            new Date(Date.now() + 10 * 60 * 1000),
            "Baby"
          );
          break;
        case "vaccine":
          notification = await notificationService.createVaccineReminder(
            "DTaP Vaccine",
            new Date(Date.now() + 24 * 60 * 60 * 1000),
            "Baby"
          );
          break;
        case "milestone":
          notification = await notificationService.createMilestoneCelebration(
            "First Smile",
            "Baby"
          );
          break;
        case "essentials":
          notification = await notificationService.createEssentialsAlert(
            "Diapers",
            "Baby"
          );
          break;
        case "weather":
          notification = await notificationService.createWeatherReminder(
            { message: "It's going to rain today!" },
            "Baby"
          );
          break;
        case "appointment":
          notification = await notificationService.createAppointmentReminder(
            "Pediatrician Checkup",
            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
            "Baby"
          );
          break;
        default:
          break;
      }

      if (notification) {
        notificationService.showToast("Notification created successfully!", "success");
        await fetchNotifications();
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      notificationService.showToast("Failed to create notification", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;
    if (confirm("Are you sure you want to delete all notifications?")) {
      await Promise.all(notifications.map(n => deleteNotification(n._id)));
      await fetchNotifications();
    }
  };

  const demoNotifications = [
    { type: "feeding", title: "Feeding Reminder", icon: Utensils, color: "bg-blue-500 hover:bg-blue-600" },
    { type: "sleep", title: "Sleep Reminder", icon: Moon, color: "bg-purple-500 hover:bg-purple-600" },
    { type: "vaccine", title: "Vaccine Reminder", icon: Syringe, color: "bg-red-500 hover:bg-red-600" },
    { type: "milestone", title: "Milestone Celebration", icon: Gift, color: "bg-pink-500 hover:bg-pink-600" },
    { type: "essentials", title: "Essentials Alert", icon: Package, color: "bg-orange-500 hover:bg-orange-600" },
    { type: "weather", title: "Weather Alert", icon: Cloud, color: "bg-cyan-500 hover:bg-cyan-600" },
    { type: "appointment", title: "Appointment Reminder", icon: Calendar, color: "bg-green-500 hover:bg-green-600" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with Delete All */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-100 rounded-full">
            <Bell className="text-pink-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notification Demo</h2>
            <p className="text-gray-600">
              {notifications.length} total • {notifications.filter(n => !n.isRead).length} unread
            </p>
          </div>
        </div>
        <Button
          onClick={handleDeleteAll}
          className={`bg-red-500 hover:bg-red-600 text-white ${notifications.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={notifications.length === 0}
        >
          <Trash2 size={16} className="mr-2" /> Delete All
        </Button>
      </div>

      {/* Notification buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoNotifications.map((notification) => {
          const IconComponent = notification.icon;
          return (
            <div key={notification.type} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${notification.color} text-white`}>
                  <IconComponent size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
              </div>
              <Button
                onClick={() => handleCreateNotification(notification.type)}
                disabled={isLoading}
                className={`w-full ${notification.color} text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play size={16} />
                    Create Notification
                  </div>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationDemo;
