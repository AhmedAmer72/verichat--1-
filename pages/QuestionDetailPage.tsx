
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowUp, CheckCircle, Send } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Mock data
const mockQuestionDetails = {
    id: 'q1',
    title: 'How to handle re-entrancy in a Solidity smart contract?',
    author: 'solidity-god.moca',
    votes: 128,
    tags: ['Solidity', 'Security'],
    content: "I'm developing a DeFi protocol and I'm concerned about re-entrancy attacks. What are the current best practices to prevent this vulnerability? I've heard about the checks-effects-interactions pattern, but are there other things I should be aware of, like using OpenZeppelin's ReentrancyGuard?",
    answers: [
        { 
            id: 'a1', 
            author: 'sergey.moca', 
            votes: 56, 
            content: "The checks-effects-interactions pattern is crucial. Always perform your checks (e.g., `require` statements), then update state variables (effects), and only then interact with external contracts. Using OpenZeppelin's `ReentrancyGuard` is highly recommended as it provides a simple and battle-tested modifier (`nonReentrant`) to protect your functions.",
            isVerified: true
        },
        { 
            id: 'a2', 
            author: 'satoshi.moca', 
            votes: 12, 
            content: "Another point is to favor `pull` over `push` payments. Instead of the contract sending Ether directly to an address, have a function that allows the user to withdraw their funds. This way, the state change happens in your contract before the external call to `send` or `transfer`.",
            isVerified: false
        },
    ]
};

const QuestionDetailPage: React.FC = () => {
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    // In a real app, you would fetch question details based on questionId
    const question = mockQuestionDetails;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/qa')} className="flex items-center gap-2 text-accent mb-6 hover:underline">
                <ChevronLeft size={20} />
                Back to Questions
            </button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="mb-6">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4 text-white">{question.title}</h1>
                        <div className="flex items-center gap-3 text-sm text-text-secondary border-b border-border pb-4 mb-4">
                            <span>Asked by <Link to={`/users/${question.author}`} className="font-semibold text-text-primary hover:underline">{question.author}</Link></span>
                        </div>
                        <p className="leading-relaxed mb-4 text-text-primary">{question.content}</p>
                        <div className="flex flex-wrap gap-2">
                            {question.tags.map(tag => (
                                <span key={tag} className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                    </div>
                </Card>

                <h2 className="text-2xl font-bold mb-4 text-white">{question.answers.length} Answers</h2>

                <div className="space-y-4 mb-8">
                    {question.answers.map(answer => (
                        <Card key={answer.id} className={answer.isVerified ? 'border-2 border-green-500' : ''}>
                             <div className="p-4 flex gap-4">
                                <div className="text-center flex-shrink-0">
                                    <button className="p-1 rounded-full hover:bg-border"><ArrowUp size={20} className="text-white" /></button>
                                    <p className="text-xl font-bold text-white">{answer.votes}</p>
                                    {answer.isVerified && <CheckCircle size={24} className="text-green-500 mt-2" />}
                                </div>
                                <div className="flex-1">
                                    <p className="mb-2 text-text-primary">{answer.content}</p>
                                    <div className="text-sm text-text-secondary text-right">
                                        Answered by <Link to={`/users/${answer.author}`} className="font-semibold text-text-primary hover:underline">{answer.author}</Link>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card>
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4 text-white">Your Answer</h3>
                        <form>
                            <textarea
                                rows={6}
                                placeholder="Provide a detailed answer..."
                                className="w-full bg-secondary border border-border rounded-lg p-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-colors text-white placeholder-gray-400"
                            />
                            <div className="mt-4 flex justify-end">
                                <Button>
                                    <Send size={16} className="mr-2" />
                                    Post Your Answer
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default QuestionDetailPage;
