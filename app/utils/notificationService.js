import { toast } from "sonner";

// Notification service for creating different types of notifications
export class NotificationService {
  constructor() {
    this.baseUrl = "/api/notifications";
  }

  // Get auth token from local storage
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

  // NEW: Helper function to show toast notifications
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

  // NEW: Specific helper methods to create different notification types
  async createFeedingReminder(scheduledFor, babyId, details) {
    const title = "Feeding Reminder";
    const message = `Time to feed ${babyId}. Details: ${details}.`;
    const type = "feeding_reminder";
    return this.createNotification({
      babyId,
      type,
      title,
      message,
      scheduledFor,
    });
  }

  async createSleepReminder(scheduledFor, babyId) {
    const title = "Sleep Reminder";
    const message = `${babyId} needs to sleep now.`;
    const type = "sleep_reminder";
    return this.createNotification({
      babyId,
      type,
      title,
      message,
      scheduledFor,
    });
  }

  async createVaccineReminder(vaccineName, scheduledFor, babyId) {
    const title = "Vaccine Reminder";
    const message = `Reminder for ${vaccineName} vaccine.`;
    const type = "vaccine_reminder";
    return this.createNotification({
      babyId,
      type,
      title,
      message,
      scheduledFor,
      priority: "urgent",
    });
  }

  async createMilestoneCelebration(milestone, babyId) {
    const title = "Milestone Celebration";
    const message = `Congratulations! ${babyId} reached the milestone: ${milestone}!`;
    const type = "milestone_celebration";
    return this.createNotification({
      babyId,
      type,
      title,
      message,
      scheduledFor: new Date(),
      category: "celebration",
    });
  }

  async createEssentialsAlert(item, babyId) {
    const title = "Essentials Alert";
    const message = `You're running low on ${item} for ${babyId}.`;
    const type = "essentials_alert";
    return this.createNotification({
      babyId,
      type,
      title,
      message,
      scheduledFor: new Date(),
      category: "alert",
    });
  }

  async createWeatherReminder(weatherData, babyId) {
    const title = "Weather Alert";
    const message = weatherData.message || "Important weather update.";
    const type = "weather_alert";
    return this.createNotification({
      babyId,
      type,
      title,
      message,
      scheduledFor: new Date(),
      category: "alert",
    });
  }

  async createAppointmentReminder(appointmentName, scheduledFor, babyId) {
    const title = "Appointment Reminder";
    const message = `Reminder for the ${appointmentName} appointment.`;
    const type = "appointment_reminder";
    return this.createNotification({
      babyId,
      type,
      title,
      message,
      scheduledFor,
      priority: "high",
    });
  }

  // DELETE ALL NOTIFICATIONS
  
  async deleteAllNotifications() {
    try {
      const token = this.getToken();
      if (!token) {
        console.warn("No auth token found for deleting notifications");
        return null;
      }

      const response = await fetch(`${this.baseUrl}?all=true`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        this.showToast("All notifications deleted successfully", "success");
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to delete all notifications:", error);
        this.showToast("Failed to delete notifications", "error");
        return false;
      }
    } catch (error) {
      console.error("Error deleting notifications:", error);
      this.showToast("Error deleting notifications", "error");
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
