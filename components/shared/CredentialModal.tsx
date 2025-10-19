
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Modal from '../ui/Modal';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

const CredentialModal: React.FC<CredentialModalProps> = ({ isOpen, onClose, onVerified }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onVerified();
      }, 2000); // Simulate verification
      return () => clearTimeout(timer);
    }
  }, [isOpen, onVerified]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-16 h-16 text-accent animate-spin mb-6" />
        <h2 className="text-2xl font-bold mb-2">Verifying Credential...</h2>
        <p className="text-text-secondary">Please wait while we securely verify your access rights.</p>
      </div>
    </Modal>
  );
};

export default CredentialModal;
