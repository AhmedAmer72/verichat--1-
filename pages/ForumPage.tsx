import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchForumCategories } from '../api/mockApi';
import type { ForumCategory } from '../lib/mockData';
import SkeletonLoader from '../components/shared/SkeletonLoader';
import { Lock, MessageSquare, Files } from 'lucide-react';
import Card from '../components/ui/Card';
import CredentialModal from '../components/shared/CredentialModal';

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


const ForumPage: React.FC = () => {
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [targetCategory, setTargetCategory] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            const data = await fetchForumCategories();
            setCategories(data);
            setIsLoading(false);
        };
        loadCategories();
    }, []);

    const handleCategoryClick = (e: React.MouseEvent, category: ForumCategory) => {
        if (category.isGated) {
            e.preventDefault();
            setTargetCategory(category.id);
            setIsVerifying(true);
        }
    };
    
    const handleVerificationComplete = () => {
        setIsVerifying(false);
        if (targetCategory) {
            navigate(`/forum/${targetCategory}`);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <CredentialModal isOpen={isVerifying} onClose={() => setIsVerifying(false)} onVerified={handleVerificationComplete} />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Forums</h1>
            </div>
            
            {isLoading ? (
                 <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <SkeletonLoader key={i} className="h-28" />)}
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                    {categories.map((category) => (
                        <motion.div key={category.id} variants={itemVariants}>
                            <Link to={`/forum/${category.id}`} onClick={(e) => handleCategoryClick(e, category)}>
                                <Card>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {category.isGated && <Lock className="text-accent" size={24} />}
                                            <div>
                                                <h2 className="text-xl font-semibold text-white">{category.name}</h2>
                                                <p className="text-sm text-text-secondary mt-1">{category.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-text-secondary text-right">
                                            <div className="flex items-center gap-2">
                                                <Files size={16} />
                                                <span>{category.threads} threads</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MessageSquare size={16} />
                                                <span>{category.messages} messages</span>
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

export default ForumPage;