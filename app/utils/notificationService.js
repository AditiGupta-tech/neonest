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

  // Create feeding reminder
  async createFeedingReminder(scheduledTime, babyName = "your baby", type = "formula") {
    const reminderData = {
      type: "feeding_reminder",
      title: "Feeding Time! 🍼",
      message: `It's time for ${babyName}'s next ${type} feeding session.`,
      priority: "medium",
      scheduledFor: scheduledTime,
      category: "reminder",
      actionUrl: "/Feeding",
      metadata: { feedingType: type },
    };

    return await this.createNotification(reminderData);
  }

  // Create sleep reminder
  async createSleepReminder(scheduledTime, babyName = "your baby") {
    const reminderData = {
      type: "sleep_reminder",
      title: "Sleep Time! 😴",
      message: `${babyName} should be getting ready for sleep now.`,
      priority: "medium",
      scheduledFor: scheduledTime,
      category: "reminder",
      actionUrl: "/Sleep",
    };

    return await this.createNotification(reminderData);
  }

  // Create vaccine reminder
  async createVaccineReminder(vaccineName, scheduledTime, babyName = "your baby") {
    const reminderData = {
      type: "vaccine_reminder",
      title: "Vaccine Due! 💉",
      message: `${babyName}'s ${vaccineName} is due. Please schedule an appointment.`,
      priority: "high",
      scheduledFor: scheduledTime,
      category: "alert",
      actionUrl: "/Medical",
      metadata: { vaccineName },
    };

    return await this.createNotification(reminderData);
  }

  // Create milestone celebration
  async createMilestoneCelebration(milestone, babyName = "your baby") {
    const celebrationData = {
      type: "milestone_celebration",
      title: "Milestone Achieved! 🎉",
      message: `Congratulations! ${babyName} has achieved: ${milestone}`,
      priority: "low",
      scheduledFor: new Date(),
      category: "celebration",
      actionUrl: "/Growth",
      metadata: { milestone },
    };

    return await this.createNotification(celebrationData);
  }

  // Create essentials alert
  async createEssentialsAlert(itemName, babyName = "your baby") {
    const alertData = {
      type: "essentials_alert",
      title: "Low Stock Alert! 📦",
      message: `${itemName} is running low. Time to restock for ${babyName}!`,
      priority: "medium",
      scheduledFor: new Date(),
      category: "alert",
      actionUrl: "/Essentials",
      metadata: { itemName },
    };

    return await this.createNotification(alertData);
  }

  // Create weather-based reminder
  async createWeatherReminder(weatherInfo, babyName = "your baby") {
    const weatherData = {
      type: "weather_alert",
      title: "Weather Alert! 🌤️",
      message: `${weatherInfo.message} Don't forget to dress ${babyName} appropriately!`,
      priority: "medium",
      scheduledFor: new Date(),
      category: "alert",
      actionUrl: "/Essentials",
      metadata: { weatherInfo },
    };

    return await this.createNotification(weatherData);
  }

  // Create appointment reminder
  async createAppointmentReminder(appointmentType, scheduledTime, babyName = "your baby") {
    const reminderData = {
      type: "appointment_reminder",
      title: "Appointment Reminder! 📅",
      message: `${babyName} has a ${appointmentType} appointment coming up.`,
      priority: "high",
      scheduledFor: scheduledTime,
      category: "reminder",
      actionUrl: "/Medical",
      metadata: { appointmentType },
    };

    return await this.createNotification(reminderData);
  }

  // Schedule recurring feeding reminders based on feeding patterns
  async scheduleFeedingReminders(feedingHistory, babyName = "your baby") {
    if (!feedingHistory || feedingHistory.length === 0) return;

    // Calculate average time between feeds
    const sortedFeeds = feedingHistory
      .map(feed => new Date(feed.time))
      .sort((a, b) => a - b);

    if (sortedFeeds.length < 2) return;

    const intervals = [];
    for (let i = 1; i < sortedFeeds.length; i++) {
      const interval = sortedFeeds[i] - sortedFeeds[i - 1];
      intervals.push(interval);
    }

    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const nextFeedingTime = new Date(Date.now() + averageInterval);

    // Create reminder for next feeding
    await this.createFeedingReminder(nextFeedingTime, babyName);
  }

  // Schedule sleep reminders based on sleep patterns
  async scheduleSleepReminders(sleepHistory, babyName = "your baby") {
    if (!sleepHistory || sleepHistory.length === 0) return;

    // Find the most common bedtime
    const bedtimes = sleepHistory
      .filter(sleep => sleep.sleepTime)
      .map(sleep => {
        const sleepDate = new Date(sleep.sleepTime);
        return sleepDate.getHours() * 60 + sleepDate.getMinutes(); // Convert to minutes
      });

    if (bedtimes.length === 0) return;

    // Calculate average bedtime
    const averageBedtimeMinutes = bedtimes.reduce((sum, time) => sum + time, 0) / bedtimes.length;
    
    // Create today's bedtime reminder
    const today = new Date();
    const bedtime = new Date(today);
    bedtime.setHours(Math.floor(averageBedtimeMinutes / 60), averageBedtimeMinutes % 60, 0, 0);
    
    // If bedtime has passed today, schedule for tomorrow
    if (bedtime <= today) {
      bedtime.setDate(bedtime.getDate() + 1);
    }

    await this.createSleepReminder(bedtime, babyName);
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