"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuth } = useAuth();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!isAuth) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new notification
  const createNotification = async (notificationData) => {
    if (!isAuth) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(prev => [data.notification, ...prev]);
        toast.success("Notification created successfully!");
        return data.notification;
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create notification");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Failed to create notification");
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    if (!isAuth) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notificationId,
          isRead: true,
        }),
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notification =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!isAuth) return;

    try {
      const token = localStorage.getItem("token");
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      for (const notification of unreadNotifications) {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            notificationId: notification._id,
            isRead: true,
          }),
        });
      }

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
      toast.success("All notifications marked as read!");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
    if (!isAuth) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications(prev =>
          prev.filter(notification => notification._id !== notificationId)
        );
        const deletedNotification = notifications.find(n => n._id === notificationId);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        toast.success("Notification deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  // NEW: Delete all notifications
 // New, correct, and efficient code
 const deleteAllNotifications = async () => {
   if (!isAuth || notifications.length === 0) return;

   if (!confirm("Are you sure you want to delete all notifications?")) return;

   try {
     const token = localStorage.getItem("token");
     const response = await fetch(`/api/notifications?all=true`, {
       method: "DELETE",
       headers: { Authorization: `Bearer ${token}` },
     });

     if (response.ok) {
       setNotifications([]);
       setUnreadCount(0);
       toast.success("All notifications deleted successfully!");
     } else {
       const error = await response.json();
       toast.error(error.error || "Failed to delete all notifications");
     }
   } catch (error) {
     console.error("Error deleting all notifications:", error);
     toast.error("Failed to delete all notifications");
   }
 };

  // ...other notification creation helpers (feeding, sleep, vaccine, etc.) remain the same

  useEffect(() => {
    if (isAuth) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuth]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications, // 
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
