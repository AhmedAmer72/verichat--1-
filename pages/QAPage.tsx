
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockQuestions } from '../lib/mockData';
import type { QAQuestion } from '../lib/mockData';
import { ArrowUp, MessageSquare, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import AddQuestionModal from '../components/shared/AddQuestionModal';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const QAPage: React.FC = () => {
    const [questions, setQuestions] = useState<QAQuestion[]>(mockQuestions);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddQuestion = (data: { title: string; content: string; tags: string }) => {
        const newQuestion: QAQuestion = {
            id: `q${questions.length + 1}`,
            title: data.title,
            author: 'vitalik.moca', // Assuming current user
            votes: 0,
            answers: 0,
            tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        };
        setQuestions(prev => [newQuestion, ...prev]);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <AddQuestionModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAddQuestion={handleAddQuestion} 
            />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Q&A</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} className="mr-2" />
                    Ask Question
                </Button>
            </div>
            
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                {questions.map((q) => (
                    <motion.div key={q.id} variants={itemVariants}>
                        <Link to={`/qa/${q.id}`}>
                            <Card className="p-4">
                                <div className="flex items-start gap-6">
                                    <div className="text-center flex-shrink-0 w-20">
                                        <div className="flex items-center justify-center gap-1">
                                            <ArrowUp size={16} />
                                            <span className="text-lg font-bold text-white">{q.votes}</span>
                                        </div>
                                        <p className="text-xs text-white">votes</p>
                                        <div className="flex items-center justify-center gap-1 mt-2">
                                            <MessageSquare size={16} />
                                            <span className="text-lg font-bold text-white">{q.answers}</span>
                                        </div>
                                        <p className="text-xs text-white">answers</p>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-accent mb-2">{q.title}</h2>
                                        <p className="text-sm text-text-secondary mb-3">
                                            asked by <span className="font-medium text-text-primary">{q.author}</span>
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {q.tags.map(tag => (
                                                <span key={tag} className="bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default QAPage;
