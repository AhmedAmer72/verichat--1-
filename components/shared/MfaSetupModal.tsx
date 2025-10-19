import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { Shield, X } from 'lucide-react';
import Button from '../ui/Button';

interface MfaSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MfaSetupModal: React.FC<MfaSetupModalProps> = ({ isOpen, onClose }) => {
  const { setupMfa, logout } = useAuthStore();
  const [isSettingUp, setIsSettingUp] = useState(false);

  const handleSetupMfa = async () => {
    setIsSettingUp(true);
    try {
      await setupMfa();
      onClose();
    } catch (error) {
      console.error('MFA setup failed:', error);
    } finally {
      setIsSettingUp(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-secondary rounded-2xl shadow-xl border border-border w-full max-w-md p-8 text-center"
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-border transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-accent/10 mb-6 border-2 border-accent">
            <Shield className="h-10 w-10 text-accent" />
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-3">Secure Your Account</h2>
          <p className="text-text-secondary mb-6">
            Enable Multi-Factor Authentication (MFA) to add an extra layer of security. This will create a secure Abstract Account for enhanced protection.
          </p>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleSetupMfa} 
              disabled={isSettingUp}
              className="w-full"
            >
              {isSettingUp ? 'Setting up...' : 'Enable MFA Now'}
            </Button>
            <Button 
              onClick={logout} 
              variant="secondary"
              className="w-full"
            >
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default MfaSetupModal;