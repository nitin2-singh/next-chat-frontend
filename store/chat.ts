import { create } from "zustand";
import { User } from "@/types/user";

interface ActiveChat {
  chatId: string;
  user: User;
}

interface ChatState {
  activeChat: ActiveChat | null;
  setActiveChat: (chat: ActiveChat | null) => void;
  typingChats: Record<string, boolean>;
  setTyping: (chatId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeChat: null,
  setActiveChat: (chat) => set({ activeChat: chat }),
  typingChats: {},
  setTyping: (chatId, isTyping) =>
    set((state) => ({
      typingChats: {
        ...state.typingChats,
        [chatId]: isTyping,
      },
    })),
}));
