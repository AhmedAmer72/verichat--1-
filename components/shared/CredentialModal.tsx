
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import { verifyCredential } from '../../lib/airkit';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  credentialType: string;
  title?: string;
}

const CredentialModal: React.FC<CredentialModalProps> = ({ 
  isOpen, 
  onClose, 
  onVerified, 
  credentialType, 
  title = 'Verifying Credential' 
}) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    if (isOpen) {
      setStatus('verifying');
      
      const performVerification = async () => {
        try {
          const isValid = await verifyCredential(credentialType);
          
          setTimeout(() => {
            if (isValid) {
              setStatus('success');
              setTimeout(() => {
                onVerified();
                onClose();
              }, 1500);
            } else {
              setStatus('failed');
              setTimeout(() => {
                onClose();
              }, 3000);
            }
          }, 1500); // Show verification process
        } catch (error) {
          setStatus('failed');
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      };
      
      performVerification();
    }
  }, [isOpen, credentialType, onVerified, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center justify-center p-8 text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 text-accent animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-white">{title}...</h2>
            <p className="text-text-secondary">Checking your {credentialType} credential...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-white">Verification Successful!</h2>
            <p className="text-text-secondary">Access granted. Redirecting...</p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-white">Verification Failed</h2>
            <p className="text-text-secondary">You don't have the required {credentialType} credential.</p>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CredentialModal;
