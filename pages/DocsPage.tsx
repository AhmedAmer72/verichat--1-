import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, MessageSquare, LayoutList, HelpCircle, Award } from 'lucide-react';
import Card from '../components/ui/Card';
import Footer from '../components/shared/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <motion.div variants={itemVariants}>
    <Card className="h-full">
      <div className="flex items-start gap-4">
        <div className="bg-accent/20 p-3 rounded-lg text-accent">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-accent mb-2">{title}</h3>
          <p className="text-text-secondary">{children}</p>
        </div>
      </div>
    </Card>
  </motion.div>
);

const DocsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-background text-text-primary"
    >
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
            <Link
            to="/"
            className="inline-flex items-center gap-2 text-accent mb-8 hover:underline"
            >
            <ChevronLeft size={20} />
            Back to Home
            </Link>

            <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            >
            <motion.div variants={itemVariants} className="text-center mb-12">
                <ShieldCheck className="w-16 h-16 text-accent mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-glow">Welcome to VeriChat</h1>
                <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
                The future of secure, gated, and decentralized community interaction.
                </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10">
                <h2 className="text-3xl font-bold mb-4 border-b border-border pb-2">What is VeriChat?</h2>
                <p className="text-text-secondary leading-relaxed">
                VeriChat is a protocol and playground demonstrating how on-chain credentials can create powerful, permissioned communication experiences. It moves beyond the "one-size-fits-all" public chat model by allowing communities to create spaces exclusively for members who hold specific tokens, NFTs, or attestations. Whether you're a DAO, a development team, or a private group, VeriChat provides the tools to build truly sovereign and context-aware communities.
                </p>
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-6 text-center">Core Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeatureCard icon={<MessageSquare size={24} />} title="Credential-Gated Chat">
                Create and join chat channels that are only accessible to users who hold a specific credential. This is perfect for token-holder lounges, private dev channels, or DAO voter discussions.
                </FeatureCard>
                
                <FeatureCard icon={<LayoutList size={24} />} title="Gated Forums">
                Structure long-form discussions in forums where categories can be restricted. Host sensitive governance debates or technical support channels for verified customers.
                </FeatureCard>
                
                <FeatureCard icon={<HelpCircle size={24} />} title="Reputation-Based Q&A">
                A Web3-native Stack Overflow. Users ask questions, and the community provides answers. The original poster can mark an answer as 'verified'.
                </FeatureCard>

                <FeatureCard icon={<Award size={24} />} title="On-Chain Reputation">
                When an answer in the Q&A is marked as verified, the protocol can mint a non-transferable reputation credential (like a Soulbound Token) for the answer's author. This builds a user's on-chain resume of expertise and helpfulness.
                </FeatureCard>
            </div>
            </motion.div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default DocsPage;