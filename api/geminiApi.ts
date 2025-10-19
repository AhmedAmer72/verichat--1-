import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatChannel, ChatMessage } from '../lib/mockData';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

// Real channels stored in localStorage for persistence
const CHANNELS_KEY = 'verichat_channels';
const MESSAGES_KEY = 'verichat_messages';

export const getStoredChannels = (): ChatChannel[] => {
  const stored = localStorage.getItem(CHANNELS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default channels
  const defaultChannels: ChatChannel[] = [
    { id: 'c1', name: '#general', isGated: false },
    { id: 'c2', name: '#ai-chat', isGated: false },
    { id: 'c3', name: '#dev-talk', isGated: false },
  ];
  
  localStorage.setItem(CHANNELS_KEY, JSON.stringify(defaultChannels));
  return defaultChannels;
};

export const getStoredMessages = (): { [key: string]: ChatMessage[] } => {
  const stored = localStorage.getItem(MESSAGES_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveChannels = (channels: ChatChannel[]): void => {
  localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels));
};

export const saveMessages = (messages: { [key: string]: ChatMessage[] }): void => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

export const fetchChatChannels = async (): Promise<ChatChannel[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return getStoredChannels();
};

export const fetchChatMessages = async (channelId: string): Promise<ChatMessage[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  const messages = getStoredMessages();
  return messages[channelId] || [];
};