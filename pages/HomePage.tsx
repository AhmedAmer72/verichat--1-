import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Footer from '../components/shared/Footer';
import AnimatedIconBackground from '../components/shared/AnimatedIconBackground';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
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
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const HomePage: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-background text-text-primary">
       <AnimatedIconBackground />

      <main className="flex-1 flex items-center justify-center">
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-20 text-center p-8"
        >
            <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-cyan-400 text-glow"
            >
            VeriChat
            </motion.h1>
            <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto"
            >
            Secure, Gated, Decentralized Communication.
            </motion.p>
            <motion.div variants={itemVariants} className="flex justify-center items-center gap-10">
                {/* Login Button */}
                <div className="relative">
                    <motion.button
                        onClick={() => login(navigate)}
                        disabled={isLoading}
                        className="relative z-10 inline-flex items-center justify-center px-8 py-4 text-lg font-black text-background transition-all duration-300 bg-gradient-to-br from-cyan-400 to-cyan-200 rounded-2xl group hover:shadow-2xl hover:shadow-accent/30 disabled:opacity-50"
                        whileHover={{ scale: isLoading ? 1 : 1.05, y: -5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Authenticating...
                            </span>
                        ) : (
                            'Login with Moca ID'
                        )}
                    </motion.button>
                    {/* Triangle part */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2 w-5 h-5 bg-cyan-200 rotate-45 z-0"></div>
                </div>

                {/* Docs Button */}
                <div className="relative">
                    <Link to="/docs">
                         <motion.div
                            className="relative z-10 inline-flex items-center justify-center px-8 py-4 text-lg font-black text-background transition-all duration-300 bg-gradient-to-br from-cyan-400 to-cyan-200 rounded-2xl group hover:shadow-2xl hover:shadow-accent/30"
                            whileHover={{ scale: 1.05, y: -5 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            Docs
                        </motion.div>
                    </Link>
                    {/* Triangle part */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full -mt-2 w-5 h-5 bg-cyan-200 rotate-45 z-0"></div>
                </div>
            </motion.div>
        </motion.div>
      </main>
      
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;