import { useState } from "react";

// This is a simple mock. Replace with your actual store logic if needed.
export function useChatStore() {
  const [chatHistory, setChatHistoryState] = useState({});
  const [historyLoaded, setHistoryLoaded] = useState({});

  // Mimic the setChatHistory signature used in your component
  const setChatHistory = (role, messages) => {
    setChatHistoryState((prev) => ({
      ...prev,
      [role]: messages,
    }));
    setHistoryLoaded((prev) => ({
      ...prev,
      [role]: true,
    }));
  };

  return {
    chatHistory,
    setChatHistory,
    historyLoaded,
  };
}