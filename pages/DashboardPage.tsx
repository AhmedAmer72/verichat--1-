import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import { MessageSquare, LayoutList, HelpCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const features = [
  {
    path: '/chat',
    icon: MessageSquare,
    title: 'Enter Chat',
    description: 'Join public and gated channels for real-time discussions.',
  },
  {
    path: '/forum',
    icon: LayoutList,
    title: 'Browse Forums',
    description: 'Engage in long-form conversations and governance debates.',
  },
  {
    path: '/qa',
    icon: HelpCircle,
    title: 'Ask Questions',
    description: 'Share knowledge and build your on-chain reputation.',
  },
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          <span className="text-cyan-400">Welcome Back,</span> <span className="text-white">{localStorage.getItem(`username_${user?.user.id}`) || user?.airId?.name || user?.user.email || user?.user.id}</span>!
        </h1>
        <p className="text-lg text-text-secondary mb-12">
          What would you like to do today?
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature) => (
          <motion.div key={feature.path} variants={itemVariants}>
            <Link to={feature.path}>
              <Card className="h-full p-8 text-left flex flex-col items-start">
                <div className="bg-accent/10 p-4 rounded-lg mb-4">
                  <feature.icon size={32} className="text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-text-primary">{feature.title}</h2>
                <p className="text-text-secondary flex-1">{feature.description}</p>
                <span className="mt-6 text-accent font-semibold group-hover:underline">
                  Go to {feature.title.split(' ')[1]} &rarr;
                </span>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DashboardPage;
