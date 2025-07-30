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
    }),
    {
      name: "neonest-chat-history",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
    }
  )
);
