
import { create } from 'zustand';
import { fetchChatChannels, fetchChatMessages, sendMessageToGemini, saveChannels, saveMessages, getStoredMessages } from '../api/geminiApi';
import type { ChatChannel, ChatMessage } from '../lib/mockData';
import { useAuthStore } from './authStore';

interface ChatState {
  channels: ChatChannel[];
  messages: { [key: string]: ChatMessage[] };
  activeChannelId: string | null;
  isLoadingChannels: boolean;
  isLoadingMessages: boolean;
  isAiTyping: boolean;
  fetchChannels: () => Promise<void>;
  fetchMessages: (channelId: string) => Promise<void>;
  setActiveChannel: (channelId: string) => void;
  addMessage: (channelId: string, content: string) => Promise<void>;
  addChannel: (channel: { name: string; isGated: boolean }) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  channels: [],
  messages: getStoredMessages(),
  activeChannelId: null,
  isLoadingChannels: false,
  isLoadingMessages: false,
  isAiTyping: false,

  fetchChannels: async () => {
    set({ isLoadingChannels: true });
    try {
      const channels = await fetchChatChannels();
      set({ channels, isLoadingChannels: false });
      if (!get().activeChannelId && channels.length > 0) {
        get().setActiveChannel(channels[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch channels:", error);
      set({ isLoadingChannels: false });
    }
  },

  fetchMessages: async (channelId: string) => {
    set({ isLoadingMessages: true });
    try {
      const messages = await fetchChatMessages(channelId);
      set((state) => ({
        messages: { ...state.messages, [channelId]: messages },
        isLoadingMessages: false,
      }));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      set({ isLoadingMessages: false });
    }
  },

  setActiveChannel: (channelId: string) => {
    set({ activeChannelId: channelId });
    if (!get().messages[channelId]) {
      get().fetchMessages(channelId);
    }
  },

  addMessage: async (channelId: string, content: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: {
        mocaId: localStorage.getItem(`username_${user.user.id}`) || user.airId?.name || user.user.name || user.user.email || user.user.id,
        avatar: localStorage.getItem(`avatar_${user.user.id}`) || `https://ui-avatars.com/api/?name=${encodeURIComponent(localStorage.getItem(`username_${user.user.id}`) || user.user.email || user.user.id)}&size=150&background=6366f1&color=ffffff`,
      },
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message immediately
    set((state) => {
      const updatedMessages = {
        ...state.messages,
        [channelId]: [...(state.messages[channelId] || []), userMessage],
      };
      saveMessages(updatedMessages);
      return { messages: updatedMessages };
    });

    // Get AI response for #ai-chat channel
    if (channelId === 'c2') {
      set({ isAiTyping: true });
      try {
        const aiResponse = await sendMessageToGemini(content);
        const aiMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          author: {
            mocaId: 'gemini.ai',
            avatar: 'https://i.pravatar.cc/150?u=gemini',
          },
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set((state) => {
          const updatedMessages = {
            ...state.messages,
            [channelId]: [...(state.messages[channelId] || []), aiMessage],
          };
          saveMessages(updatedMessages);
          return { messages: updatedMessages, isAiTyping: false };
        });
      } catch (error) {
        console.error('Failed to get AI response:', error);
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          author: {
            mocaId: 'system',
            avatar: 'https://i.pravatar.cc/150?u=system',
          },
          content: 'Sorry, I\'m having trouble connecting to the AI service right now.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set((state) => {
          const updatedMessages = {
            ...state.messages,
            [channelId]: [...(state.messages[channelId] || []), errorMessage],
          };
          saveMessages(updatedMessages);
          return { messages: updatedMessages, isAiTyping: false };
        });
      }
    }
  },
  
  addChannel: (channelData: { name: string; isGated: boolean }) => {
    const newChannel: ChatChannel = {
      id: `channel-${Date.now()}`,
      name: `#${channelData.name}`,
      isGated: channelData.isGated,
    };
    set((state) => {
      const updatedChannels = [...state.channels, newChannel];
      saveChannels(updatedChannels);
      return { channels: updatedChannels };
    });
  },
}));
