
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchForumThreads } from '../api/mockApi';
import type { ForumThread } from '../lib/mockData';
import SkeletonLoader from '../components/shared/SkeletonLoader';
import { ChevronLeft, MessageSquare, Clock } from 'lucide-react';
import Card from '../components/ui/Card';

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
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const ForumCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadThreads = async () => {
      if (!categoryId) return;
      setIsLoading(true);
      const data = await fetchForumThreads(categoryId);
      setThreads(data);
      setIsLoading(false);
    };
    loadThreads();
  }, [categoryId]);

  const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : "Forum";

  return (
    <div>
      <button onClick={() => navigate('/forum')} className="flex items-center gap-2 text-accent mb-6 hover:underline">
        <ChevronLeft size={20} />
        Back to Forums
      </button>
      <h1 className="text-3xl font-bold mb-6 capitalize text-white">{categoryName} Threads</h1>
      
      {isLoading ? (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="h-20" />)}
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          {threads.map((thread) => (
            <motion.div key={thread.id} variants={itemVariants}>
              <Link to={`/forum/${categoryId}/${thread.id}`}>
                <Card className="p-4 hover:border-accent transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-white">{thread.title}</h2>
                      <p className="text-sm text-text-secondary">by {thread.author.mocaId}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-text-secondary text-right">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={16} className="text-white" />
                            <span className="text-white">{thread.replies}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-white" />
                            <span className="text-white">{thread.lastActivity}</span>
                        </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ForumCategoryPage;
