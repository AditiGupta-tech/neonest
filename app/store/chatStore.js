import { create } from "zustand"

const useChatStore = create((set) => ({
  role: "pediatrician",
  messages: [],
  setRole: (newRole) => set({ role: newRole }),
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}))

export default useChatStore
