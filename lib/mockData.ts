// Fix: Added full mock data and type definitions.
export interface User {
  mocaId: string;
  avatar: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  isGated: boolean;
}

export interface ChatMessage {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  threads: number;
  messages: number;
  isGated: boolean;
}

export interface ForumThread {
    id: string;
    categoryId: string;
    title: string;
    author: User;
    replies: number;
    lastActivity: string;
}

export interface UserProfile {
    mocaId: string;
    avatar: string;
    joinedDate: string;
    reputation: number;
    answersProvided: number;
    questionsAsked: number;
    bio: string;
}

export interface QAQuestion {
    id: string;
    title: string;
    author: string;
    votes: number;
    answers: number;
    tags: string[];
}

export const mockUserProfiles: Record<string, UserProfile> = {};

export const mockChatChannels: ChatChannel[] = [
    { id: 'c1', name: '#general', isGated: false },
    { id: 'c2', name: '#dev-talk', isGated: false },
    { id: 'c3', name: '#dao-members', isGated: true },
    { id: 'c4', name: '#security-audits', isGated: true },
    { id: 'c5', name: '#random', isGated: false },
];

export const mockChatMessages: { [key: string]: ChatMessage[] } = {
    'c1': [],
    'c2': [],
    'c3': [],
    'c4': [],
    'c5': [],
};

export const mockForumCategories: ForumCategory[] = [
    { id: 'general', name: 'General Discussion', description: 'Talk about anything and everything related to the Mocaverse.', threads: 120, messages: 1500, isGated: false },
    { id: 'proposals', name: 'Governance Proposals', description: 'Discuss and debate proposals before they go to a formal vote.', threads: 35, messages: 800, isGated: true },
    { id: 'technical', name: 'Technical Support', description: 'Get help with smart contracts, dApps, and more.', threads: 250, messages: 3200, isGated: false },
];

export const mockForumThreads: ForumThread[] = [];

export const mockQuestions: QAQuestion[] = [
    { id: 'q1', title: 'How to handle re-entrancy in a Solidity smart contract?', author: 'solidity-god.moca', votes: 128, answers: 2, tags: ['Solidity', 'Security'] },
    { id: 'q2', title: 'What is the best way to store large data on-chain?', author: 'alice.moca', votes: 64, answers: 3, tags: ['Storage', 'IPFS', 'Gas'] },
    { id: 'q3', title: 'How does EIP-4844 (Proto-Danksharding) work?', author: 'vitalik.moca', votes: 256, answers: 1, tags: ['EIP-4844', 'Scaling', 'Layer-2'] },
];
