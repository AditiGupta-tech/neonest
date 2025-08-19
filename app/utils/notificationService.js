// notificationService.js

import { toast } from "sonner";

// Notification service for creating different types of notifications
export class NotificationService {
  constructor() {
    this.baseUrl = "/api/notifications";
  }

  // Get auth token
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  // Create a notification
  async createNotification(notificationData) {
    try {
      const token = this.getToken();
      if (!token) {
        console.warn("No auth token found for notification creation");
        return null;
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const data = await response.json();
        return data.notification;
      } else {
        const error = await response.json();
        console.error("Failed to create notification:", error);
        return null;
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      return null;
    }
  }

  // Show toast notification
  showToast(message, type = "success") {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast(message);
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
