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
  Play
} from "lucide-react";

const NotificationDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchNotifications } = useNotifications();

  const handleCreateNotification = async (type, data) => {
    setIsLoading(true);
    try {
      let notification;
      
      switch (type) {
        case "feeding":
          notification = await notificationService.createFeedingReminder(
            new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
            "Baby",
            "formula"
          );
          break;
        case "sleep":
          notification = await notificationService.createSleepReminder(
            new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
            "Baby"
          );
          break;
        case "vaccine":
          notification = await notificationService.createVaccineReminder(
            "DTaP Vaccine",
            new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
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
            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            "Baby"
          );
          break;
        default:
          break;
      }

      if (notification) {
        notificationService.showToast("Notification created successfully!", "success");
        await fetchNotifications(); // Refresh notifications
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      notificationService.showToast("Failed to create notification", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const demoNotifications = [
    {
      type: "feeding",
      title: "Feeding Reminder",
      description: "Create a feeding reminder for 5 minutes from now",
      icon: Utensils,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      type: "sleep",
      title: "Sleep Reminder",
      description: "Create a sleep reminder for 10 minutes from now",
      icon: Moon,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      type: "vaccine",
      title: "Vaccine Reminder",
      description: "Create a vaccine reminder for tomorrow",
      icon: Syringe,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      type: "milestone",
      title: "Milestone Celebration",
      description: "Create a milestone celebration notification",
      icon: Gift,
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      type: "essentials",
      title: "Essentials Alert",
      description: "Create a low stock alert for diapers",
      icon: Package,
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      type: "weather",
      title: "Weather Alert",
      description: "Create a weather-based reminder",
      icon: Cloud,
      color: "bg-cyan-500 hover:bg-cyan-600",
    },
    {
      type: "appointment",
      title: "Appointment Reminder",
      description: "Create an appointment reminder",
      icon: Calendar,
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-pink-100 rounded-full">
          <Bell className="text-pink-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Notification Demo</h2>
          <p className="text-gray-600">Test different types of notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoNotifications.map((notification) => {
          const IconComponent = notification.icon;
          return (
            <div
              key={notification.type}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-full ${notification.color} text-white`}>
                  <IconComponent size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">{notification.description}</p>
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

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click any button above to create a test notification</li>
          <li>• Notifications will appear in the bell icon in the navbar</li>
          <li>• You can mark them as read, delete them, or click to navigate</li>
          <li>• Visit the notifications page to see all your notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationDemo; 