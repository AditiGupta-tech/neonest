// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Bell, X, Trash2, ExternalLink } from "lucide-react";
// import { useNotifications } from "../context/NotificationContext";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";

// const NotificationBell = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { notifications, unreadCount, markAsRead, deleteNotification, markAllAsRead } = useNotifications();
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleNotificationClick = async (notification) => {
//     if (!notification.isRead) {
//       await markAsRead(notification._id);
//     }
//     setIsOpen(false);
//   };

//   const handleDeleteNotification = async (e, notificationId) => {
//     e.stopPropagation();
//     await deleteNotification(notificationId);
//   };

//   const getNotificationIcon = (type) => {
//     const icons = {
//       feeding_reminder: "🍼",
//       sleep_reminder: "😴",
//       vaccine_reminder: "💉",
//       milestone_celebration: "🎉",
//       essentials_alert: "📦",
//       weather_alert: "🌤️",
//     };
//     return icons[type] || "🔔";
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

//     if (diffInHours < 1) return "Just now";
//     if (diffInHours < 24) return `${diffInHours}h ago`;
//     return date.toLocaleDateString();
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Bell Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 rounded-full"
//         aria-label="Notifications">
//         <Bell size={20} />
//         {unreadCount > 0 && (
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </motion.div>
//         )}
//       </button>

//       {/* Dropdown */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10, scale: 0.95 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.95 }}
//             transition={{ duration: 0.2 }}
//             className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800  rounded-xl shadow-lg border dark:border-none border-gray-200 z-50">
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Notifications</h3>
//               <div className="flex items-center gap-2">
//                 {unreadCount > 0 && (
//                   <button onClick={markAllAsRead} className="text-sm text-pink-600 hover:text-pink-700 font-medium">
//                     Mark all read
//                   </button>
//                 )}
//                 <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
//                   <X size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Body + Footer container with fixed height */}
//             <div className="flex flex-col max-h-96">
//               {/* Notification List Scrollable */}
//               <div className="flex-1 overflow-y-auto">
//                 {notifications.length === 0 ? (
//                   <div className="p-6 text-center dark:bg-gray-800 dark:text-gray-200 text-gray-500">
//                     <Bell size={32} className="mx-auto mb-2 text-gray-300" />
//                     <p>No notifications yet</p>
//                     <p className="text-sm">We'll notify you about important updates</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-100">
//                     {notifications.map((notification) => (
//                       <motion.div
//                         key={notification._id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         className={`p-4 hover:bg-gray-50 dark:bg-gray-300  transition-colors duration-200 cursor-pointer ${!notification.isRead ? "bg-blue-50" : ""}`}
//                         onClick={() => handleNotificationClick(notification)}>
//                         <div className="flex items-start gap-3">
//                           <div className="flex-shrink-0 text-2xl">{getNotificationIcon(notification.type)}</div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1 dark-text-gray-200">
//                                 <p className={`text-sm font-medium ${!notification.isRead ? "text-gray-900 dark-text-gray-500 " : "text-gray-700 dark-text-gray-200"}`}>{notification.title}</p>
//                                 <p className="text-sm dark-text-gray-200 text-gray-600 mt-1 ">{notification.message}</p>
//                                 <p className="text-xs text-gray-400 mt-2 dark-text-gray-200">{formatTime(notification.scheduledFor)}</p>
//                               </div>
//                               <div className="flex items-center gap-1 ml-2">
//                                 {notification.actionUrl && (
//                                   <Link href={notification.actionUrl} className="text-gray-400 hover:text-pink-600 p-1" onClick={(e) => e.stopPropagation()}>
//                                     <ExternalLink size={14} />
//                                   </Link>
//                                 )}
//                                 <button onClick={(e) => handleDeleteNotification(e, notification._id)} className="text-gray-400 hover:text-red-600 p-1">
//                                   <Trash2 size={14} />
//                                 </button>
//                               </div>
//                             </div>
//                             {!notification.isRead && <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Footer Always Visible */}
//               {notifications.length > 0 && (
//                 <div className="p-3 border-t border-gray-100 bg-gray-50 dark:bg-gray-700  shrink-0">
//                   <Link href="/notifications" className="text-sm text-pink-600 dark:text-pink-500 hover:text-pink-700 font-medium text-center block" onClick={() => setIsOpen(false)}>
//                     View all notifications
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default NotificationBell;




"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, X, Trash2, ExternalLink } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import DeleteAllConfirmation from "./DeleteAllConfirmation";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { notifications, unreadCount, markAsRead, deleteNotification, markAllAsRead, deleteAllNotifications } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    setIsOpen(false);
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      await deleteAllNotifications();
      setShowDeleteConfirm(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      feeding_reminder: "🍼",
      sleep_reminder: "😴",
      vaccine_reminder: "💉",
      milestone_celebration: "🎉",
      essentials_alert: "📦",
      weather_alert: "🌤️",
    };
    return icons[type] || "🔔";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* Bell Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 rounded-full"
          aria-label="Notifications">
          <Bell size={20} />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.div>
          )}
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-none border-gray-200 z-50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                      Mark all read
                    </button>
                  )}

                  {/* Delete All Button with Tooltip */}
                  {notifications.length > 0 && (
                    <div className="relative group">
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Delete all notifications">
                        <Trash2 size={16} />
                      </button>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
                        Delete All Notifications
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body + Footer container with fixed height */}
              <div className="flex flex-col max-h-96">
                {/* Notification List Scrollable */}
                <div className="flex-1 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center dark:bg-gray-800 dark:text-gray-200 text-gray-500">
                      <Bell size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                      <p>No notifications yet</p>
                      <p className="text-sm">We'll notify you about important updates</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer ${!notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                          onClick={() => handleNotificationClick(notification)}>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 text-2xl">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${!notification.isRead ? "text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}>{notification.title}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{formatTime(notification.scheduledFor)}</p>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  {notification.actionUrl && (
                                    <Link href={notification.actionUrl} className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 p-1" onClick={(e) => e.stopPropagation()}>
                                      <ExternalLink size={14} />
                                    </Link>
                                  )}
                                  <button onClick={(e) => handleDeleteNotification(e, notification._id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              {!notification.isRead && <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Always Visible */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 shrink-0">
                    <Link
                      href="/notifications"
                      className="text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium text-center block"
                      onClick={() => setIsOpen(false)}>
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Dialog */}
      <DeleteAllConfirmation isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDeleteAll} loading={isDeleting} />
    </>
  );
};

export default NotificationBell;