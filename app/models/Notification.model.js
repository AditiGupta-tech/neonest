import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    babyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "feeding_reminder",
        "sleep_reminder", 
        "vaccine_reminder",
        "appointment_reminder",
        "milestone_celebration",
        "weather_alert",
        "essentials_alert",
        "general"
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    scheduledFor: {
      type: Date,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isSent: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    category: {
      type: String,
      enum: ["reminder", "alert", "celebration", "info"],
      default: "reminder",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
notificationSchema.index({ babyId: 1, scheduledFor: 1 });
notificationSchema.index({ babyId: 1, isRead: 1 });
notificationSchema.index({ babyId: 1, isSent: 1 });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification; 