
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, Hash, Plus, Send } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import SkeletonLoader from '../components/shared/SkeletonLoader';
import { cn } from '../lib/utils';
import CredentialModal from '../components/shared/CredentialModal';
import AddChatModal from '../components/shared/AddChatModal';
import { Link } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const {
    channels,
    messages,
    activeChannelId,
    isLoadingChannels,
    isLoadingMessages,
    isAiTyping,
    fetchChannels,
    setActiveChannel,
    addMessage,
    addChannel,
  } = useChatStore();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [targetChannel, setTargetChannel] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  const handleChannelClick = (channelId: string, isGated: boolean) => {
    if (isGated) {
      setTargetChannel(channelId);
      setIsVerifying(true);
    } else {
      setActiveChannel(channelId);
    }
  };

  const handleVerificationComplete = () => {
    setIsVerifying(false);
    if (targetChannel) {
      setActiveChannel(targetChannel);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && activeChannelId) {
      await addMessage(activeChannelId, messageInput);
      setMessageInput('');
    }
  };
  
  const handleAddChannel = (data: { name: string; isGated: boolean }) => {
    addChannel(data);
    setIsAddModalOpen(false);
  };

  const activeChannel = channels.find(c => c.id === activeChannelId);

  return (
    <div className="flex h-[calc(100vh-160px)] rounded-xl border border-border bg-secondary/50 overflow-hidden">
      <CredentialModal isOpen={isVerifying} onClose={() => setIsVerifying(false)} onVerified={handleVerificationComplete} />
      <AddChatModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddChannel={handleAddChannel} />
      
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-secondary/30 border-r border-border p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Channels</h2>
            <button onClick={() => setIsAddModalOpen(true)} className="p-1 rounded-md hover:bg-border text-text-secondary hover:text-text-primary">
                <Plus size={20} />
            </button>
        </div>
        
        {isLoadingChannels ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="h-8" />)}
          </div>
        ) : (
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => handleChannelClick(channel.id, channel.isGated)}
                className={cn(
                  'w-full flex items-center gap-2 p-2 rounded-md text-left transition-colors',
                  activeChannelId === channel.id ? 'bg-accent/20 text-accent' : 'text-text-secondary hover:bg-border'
                )}
              >
                {channel.isGated ? <Lock size={16} /> : <Hash size={16} />}
                <span className="flex-1 truncate text-white">{channel.name.substring(1)}</span>
              </button>
            ))}
          </nav>
        )}
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {!activeChannelId ? (
          <div className="flex-1 flex items-center justify-center text-text-secondary">
            <p>Select a channel to start chatting</p>
          </div>
        ) : (
          <>
            <header className="p-4 border-b border-border">
              <h1 className="text-xl font-bold text-white">{activeChannel?.name}</h1>
              {activeChannel?.isGated && <p className="text-xs text-accent">This is a gated channel.</p>}
              {activeChannelId === 'c2' && <p className="text-xs text-green-500">AI-powered chat - messages will get responses from Gemini AI</p>}
            </header>
            
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {isLoadingMessages ? (
                 <div className="space-y-4">
                    {[...Array(8)].map((_, i) => <SkeletonLoader key={i} className={cn("h-16", i % 2 === 0 ? "w-3/4" : "w-2/3 ml-auto")} />)}
                </div>
              ) : (
                messages[activeChannelId]?.map(msg => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                  >
                    <Link to={`/users/${msg.author.mocaId}`}>
                      <img src={msg.author.avatar} alt={msg.author.mocaId} className="w-10 h-10 rounded-full" />
                    </Link>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <Link to={`/users/${msg.author.mocaId}`} className="font-semibold text-text-primary hover:underline">{msg.author.mocaId}</Link>
                        <span className="text-xs text-text-secondary">{msg.timestamp}</span>
                      </div>
                      <p className="text-text-primary">{msg.content}</p>
                    </div>
                  </motion.div>
                ))
              )}
              {isAiTyping && activeChannelId === 'c2' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3"
                >
                  <img src="https://i.pravatar.cc/150?u=gemini" alt="AI" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-text-primary">gemini.ai</span>
                      <span className="text-xs text-white">typing...</span>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Message ${activeChannel?.name}`}
                  className="w-full bg-secondary border border-border rounded-lg p-3 pr-12 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors text-white placeholder-gray-400"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-accent p-1 rounded-full hover:bg-accent/20">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
