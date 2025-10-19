import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => internalRef.current!);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!internalRef.current) return;
      const rect = internalRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      internalRef.current.style.setProperty('--mouse-x', `${x}px`);
      internalRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
      <motion.div
        ref={internalRef}
        whileHover={{ 
          y: -5, 
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={cn(
          'group relative rounded-xl border border-border bg-secondary/50 backdrop-blur-sm p-6 shadow-lg overflow-hidden transition-colors duration-300 hover:border-accent/50',
          className
        )}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <div 
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(34, 211, 238, 0.15), transparent 40%)`,
          }}
        />
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;