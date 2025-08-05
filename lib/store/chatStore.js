import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set, get) => ({
      chatHistory: {},
      historyLoaded: {},
      chatSessions: [],
      sessionsLoaded: false,
      setChatSessions: (sessionsOrFn) =>
        set((state) => {
          const newSessions = typeof sessionsOrFn === "function" ? sessionsOrFn(state.chatSessions) : sessionsOrFn;
          return {
            chatSessions: newSessions,
            sessionsLoaded: true,
          };
        }),
      getChatSessions: () => get().chatSessions || [],
      clearChatSessions: () =>
        set(() => ({
          chatSessions: [],
          sessionsLoaded: false,
        })),
      setChatHistory: (chatId, messages) =>
        set((state) => ({
          chatHistory: { ...state.chatHistory, [chatId]: messages },
          historyLoaded: { ...state.historyLoaded, [chatId]: true },
        })),
      getChatById: (chatId) => get().chatHistory?.[chatId] || [],
      isHistoryLoaded: (chatId) => !!get().historyLoaded?.[chatId],
      markHistoryLoaded: (chatId) =>
        set((state) => ({
          historyLoaded: { ...state.historyLoaded, [chatId]: true },
        })),
      clearChatHistory: () =>
        set(() => ({
          chatHistory: {},
          historyLoaded: {},
        })),
      resetChatHistoryForId: (chatId) =>
        set((state) => ({
          chatHistory: { ...state.chatHistory, [chatId]: [] },
          historyLoaded: { ...state.historyLoaded, [chatId]: false },
        })),
    }),
    {
      name: "neonest-chat-history",
      storage: typeof window !== "undefined" ? sessionStorage : undefined,
    }
  )
);
