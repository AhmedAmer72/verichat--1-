import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageSquare, Lock, Users, Share2, BadgeCheck } from 'lucide-react';

const AnimatedIcon: React.FC<{ icon: React.ElementType; className: string; duration?: number; delay?: number }> = ({ icon: Icon, className, duration = 5, delay = 0 }) => {
    return (
        <motion.div
            className={className}
            initial={{ y: 0, rotate: 0, scale: 1 }}
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
            transition={{
                duration,
                ease: 'easeInOut',
                repeat: Infinity,
                delay,
            }}
        >
            <Icon className="w-full h-full" />
        </motion.div>
    );
};

const AnimatedIconBackground: React.FC = () => {
    return (
        <>
            {/* Background Icons Illustration */}
            <div className="absolute inset-0 z-0 opacity-20 text-accent">
                <AnimatedIcon icon={ShieldCheck} className="absolute top-[10%] left-[15%] w-24 h-24" duration={6} delay={0.5} />
                <AnimatedIcon icon={MessageSquare} className="absolute top-[20%] right-[10%] w-32 h-32" duration={8} delay={1} />
                <AnimatedIcon icon={Lock} className="absolute bottom-[15%] left-[20%] w-20 h-20" duration={5} />
                <AnimatedIcon icon={Users} className="absolute bottom-[25%] right-[22%] w-28 h-28" duration={7} delay={1.5} />
                <AnimatedIcon icon={Share2} className="absolute top-[50%] left-[5%] w-24 h-24" duration={9} />
                <AnimatedIcon icon={BadgeCheck} className="absolute bottom-[10%] right-[5%] w-20 h-20" duration={6} delay={0.8} />
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        </>
    );
};

export default AnimatedIconBackground;