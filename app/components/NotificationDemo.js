"use client";

import React, { useState } from "react";
import { Button } from "./ui/Button";
import { useNotifications } from "../context/NotificationContext";
import { Bell, Play, Trash2 } from "lucide-react";
import { notificationService } from "../utils/notificationService";

const NotificationDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { fetchNotifications, deleteAllNotifications } = useNotifications();

  const handleCreateNotification = async (type, data) => {
    setIsLoading(true);
    try {
      let notification;
      switch (type) {
        case "feeding":
          notification = await notificationService.createFeedingReminder(new Date(Date.now() + 5 * 60 * 1000), "Baby", "formula");
          break;
        case "sleep":
          notification = await notificationService.createSleepReminder(new Date(Date.now() + 10 * 60 * 1000), "Baby");
          break;
        case "vaccine":
          notification = await notificationService.createVaccineReminder("DTaP Vaccine", new Date(Date.now() + 24 * 60 * 60 * 1000), "Baby");
          break;
        case "milestone":
          notification = await notificationService.createMilestoneCelebration("First Smile", "Baby");
          break;
        case "essentials":
          notification = await notificationService.createEssentialsAlert("Diapers", "Baby");
          break;
        case "weather":
          notification = await notificationService.createWeatherReminder({ message: "It's going to rain today!" }, "Baby");
          break;
        case "appointment":
          notification = await notificationService.createAppointmentReminder("Pediatrician Checkup", new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), "Baby");
          break;
        default:
          break;
      }

      if (notification) {
        notificationService.showToast("Notification created successfully!", "success");
        await fetchNotifications();
      }
    } catch (error) {
      console.error(error);
      notificationService.showToast("Failed to create notification", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ...demoNotifications array stays the same

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header with bin */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-100 rounded-full">
            <Bell className="text-pink-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notification Demo</h2>
            <p className="text-gray-600">Test different types of notifications</p>
          </div>
        </div>
        <Button onClick={deleteAllNotifications} className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2">
          <Trash2 size={16} /> Delete All
        </Button>
      </div>

      {/* Demo buttons */}
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
              <p className="text-sm text-gray-600 mb-4">{notification.description}</p>
              <Button onClick={() => handleCreateNotification(notification.type)} disabled={isLoading} className={`w-full ${notification.color} text-white`}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play size={16} /> Create Notification
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
