import { mockChatChannels, mockChatMessages, mockForumCategories, mockForumThreads, mockUserProfiles } from '../lib/mockData';
import type { ChatChannel, ChatMessage, ForumCategory, ForumThread, UserProfile } from '../lib/mockData';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchChatChannels = async (): Promise<ChatChannel[]> => {
  await delay(500);
  return mockChatChannels;
};

export const fetchChatMessages = async (channelId: string): Promise<ChatMessage[]> => {
  await delay(700);
  return mockChatMessages[channelId] || [];
};

export const fetchForumCategories = async (): Promise<ForumCategory[]> => {
    await delay(800);
    return mockForumCategories;
};

export const fetchForumThreads = async (categoryId: string): Promise<ForumThread[]> => {
    await delay(1000);
    return mockForumThreads.filter(t => t.categoryId === categoryId);
};

export const fetchUserProfile = async (mocaId: string): Promise<UserProfile | null> => {
    await delay(600);
    // If a specific profile isn't found, create a generic one.
    return mockUserProfiles[mocaId] || {
        mocaId,
        avatar: `https://i.pravatar.cc/150?u=${mocaId}`,
        joinedDate: 'N/A',
        reputation: 0,
        answersProvided: 0,
        questionsAsked: 0,
        bio: 'This user has not set up a bio yet.'
    };
};