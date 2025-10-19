// Fix: Added full content for the NotificationPanel component.
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Award } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
    { id: 1, icon: MessageSquare, text: 'alice.moca mentioned you in #general', time: '5m ago' },
    { id: 2, icon: Award, text: 'Your answer was marked as verified!', time: '1h ago' },
    { id: 3, icon: MessageSquare, text: 'bob.moca sent you a message', time: '3h ago' },
];

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full mt-2 w-80 bg-secondary rounded-lg shadow-2xl border border-border overflow-hidden"
        >
          <div className="p-3 border-b border-border">
            <h3 className="font-semibold text-text-primary">Notifications</h3>
          </div>
          <div className="py-1 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
                notifications.map(notif => (
                    <div key={notif.id} className="flex items-start gap-3 p-3 hover:bg-border cursor-pointer transition-colors">
                        <div className="text-accent mt-1">
                           <notif.icon size={18} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-text-primary">{notif.text}</p>
                            <p className="text-xs text-text-secondary">{notif.time}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-sm text-text-secondary p-4">No new notifications</p>
            )}
          </div>
          <div className="p-2 border-t border-border text-center">
            <button onClick={onClose} className="text-sm text-accent hover:underline">
                Mark all as read
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
