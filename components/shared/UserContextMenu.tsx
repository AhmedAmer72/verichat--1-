
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  user: { mocaId: string };
}

const UserContextMenu: React.FC<UserContextMenuProps> = ({ isOpen, onClose, position, user }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop to close menu on outside click */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              top: position.y,
              left: position.x,
            }}
            className="fixed z-50 w-48 bg-secondary rounded-lg shadow-2xl border border-border overflow-hidden"
          >
            <div className="p-2 border-b border-border">
                <p className="font-semibold text-sm truncate">{user.mocaId}</p>
            </div>
            <ul className="py-1">
              <li>
                <Link
                  to={`/users/${user.mocaId}`}
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-text-primary hover:bg-secondary/80 transition-colors"
                >
                  <User size={16} />
                  <span>View Profile</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={onClose}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-text-primary hover:bg-secondary/80 transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Message</span>
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserContextMenu;
