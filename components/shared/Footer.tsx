import React from 'react';
import { motion } from 'framer-motion';

const footerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
};

const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.8, ease: 'circOut', delay: 0.2 } },
};

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.5,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <motion.a
        href={href}
        variants={itemVariants}
        whileHover={{ y: -3, color: '#58A6FF' }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="text-text-secondary"
    >
        {children}
    </motion.a>
);

const Footer: React.FC = () => {
    return (
        <motion.footer
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full bg-secondary/20 p-4 text-sm z-10"
        >
            {/* Animated top border line */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-px bg-border origin-left"
                variants={lineVariants}
            />
            
            <motion.div
                variants={containerVariants}
                className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
            >
                <div className="flex items-center gap-4 sm:gap-6">
                    <FooterLink href="#">Privacy Policy</FooterLink>
                    <FooterLink href="#">Terms of Service</FooterLink>
                    <FooterLink href="#">Support</FooterLink>
                </div>
                <motion.span
                    variants={itemVariants}
                    className="text-text-secondary text-xs sm:text-sm"
                >
                    © 2025 VeriChat. All rights reserved.
                </motion.span>
            </motion.div>
        </motion.footer>
    );
};

export default Footer;
