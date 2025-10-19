import React, { useState } from 'react';
import { X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface UsernameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetUsername: (username: string) => void;
  currentEmail: string;
}

const UsernameSetupModal: React.FC<UsernameSetupModalProps> = ({
  isOpen,
  onClose,
  onSetUsername,
  currentEmail
}) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSetUsername(username.trim());
      onClose();
      setUsername('');
    }
  };

  const handleSkip = () => {
    onSetUsername(currentEmail);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-secondary rounded-lg p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Set Your Username</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X size={24} />
          </button>
        </div>
        
        <p className="text-text-secondary mb-4">
          Choose a username for your profile. This will be displayed in chats and forums.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full bg-background border border-border rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            maxLength={30}
          />
          
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={!username.trim()}>
              Set Username
            </Button>
            <Button type="button" onClick={handleSkip} variant="secondary" className="flex-1">
              Use Email
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UsernameSetupModal;