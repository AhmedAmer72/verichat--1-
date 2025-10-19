
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Send } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Mock data for a single thread, as it's not in the API
const mockThreadDetails = {
    id: 't1',
    title: 'Favorite upcoming features?',
    author: { mocaId: 'alice.moca', avatar: 'https://i.pravatar.cc/150?u=alice' },
    timestamp: '2 days ago',
    content: "Hey everyone, with the new roadmap just released, I'm curious what features you're most excited about. For me, it's definitely the on-chain reputation system. I think it will add a lot of value to the Q&A section.",
    replies: [
        { id: 'r1', author: { mocaId: 'bob.moca', avatar: 'https://i.pravatar.cc/150?u=bob' }, timestamp: '2 days ago', content: "I agree, the reputation system is going to be a game-changer. I'm also really looking forward to more advanced gating mechanisms for chat channels." },
        { id: 'r2', author: { mocaId: 'vitalik.moca', avatar: 'https://i.pravatar.cc/150?u=vitalik' }, timestamp: '1 day ago', content: "Quadratic voting for governance proposals would be a great addition to the gated forums." },
        { id: 'r3', author: { mocaId: 'alice.moca', avatar: 'https://i.pravatar.cc/150?u=alice' }, timestamp: '1 day ago', content: "That's a fantastic idea, vitalik.moca! That would make governance much more equitable." },
    ]
};

const ForumThreadPage: React.FC = () => {
    const { categoryId, threadId } = useParams<{ categoryId: string, threadId: string }>();
    const navigate = useNavigate();
    // In a real app, you would fetch thread details based on threadId
    const thread = mockThreadDetails;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate(`/forum/${categoryId}`)} className="flex items-center gap-2 text-accent mb-6 hover:underline">
                <ChevronLeft size={20} />
                Back to Threads
            </button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="mb-6">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4">{thread.title}</h1>
                        <div className="flex items-center gap-3 text-sm text-text-secondary border-b border-border pb-4 mb-4">
                            <img src={thread.author.avatar} alt={thread.author.mocaId} className="w-8 h-8 rounded-full" />
                            <Link to={`/users/${thread.author.mocaId}`} className="font-semibold text-text-primary hover:underline">{thread.author.mocaId}</Link>
                            <span>&bull;</span>
                            <span>Posted {thread.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{thread.content}</p>
                    </div>
                </Card>

                <h2 className="text-2xl font-bold mb-4">{thread.replies.length} Replies</h2>

                <div className="space-y-4 mb-8">
                    {thread.replies.map(reply => (
                        <Card key={reply.id} className="p-4">
                             <div className="flex items-start gap-4">
                                <img src={reply.author.avatar} alt={reply.author.mocaId} className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2 text-sm">
                                        <Link to={`/users/${reply.author.mocaId}`} className="font-semibold text-text-primary hover:underline">{reply.author.mocaId}</Link>
                                        <span className="text-text-secondary">{reply.timestamp}</span>
                                    </div>
                                    <p className="mt-1">{reply.content}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Your Reply</h3>
                        <form>
                            <textarea
                                rows={5}
                                placeholder="Write your reply here..."
                                className="w-full bg-secondary border border-border rounded-lg p-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors"
                            />
                            <div className="mt-4 flex justify-end">
                                <Button>
                                    <Send size={16} className="mr-2" />
                                    Post Reply
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default ForumThreadPage;
