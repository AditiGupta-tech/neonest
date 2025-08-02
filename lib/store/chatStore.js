import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set, get) => ({
      chatHistory: {},
      historyLoaded: {},
      setChatHistory: (role, messages) =>
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [role]: messages,
          },
          historyLoaded: {
            ...state.historyLoaded,
            [role]: true,
          },
        })),
      getChatByRole: (role) => get().chatHistory?.[role] || [],
      markHistoryLoaded: (role) =>
        set((state) => ({
          historyLoaded: {
            ...state.historyLoaded,
            [role]: true,
          },
        })),
      clearChatHistory: () =>
        set(() => ({
          chatHistory: {},
          historyLoaded: {},
        })),
      // NEW: Reset chat history for a specific role
      resetChatHistoryForRole: (role) =>
        set((state) => ({
          chatHistory: {
            ...state.chatHistory,
            [role]: [],
          },
          historyLoaded: {
            ...state.historyLoaded,
            [role]: false,
          },
        })),
    }),
    {
      name: "neonest-chat-history",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
    }
  )
);
