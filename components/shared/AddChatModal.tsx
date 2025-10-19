
import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface AddChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (data: { name: string; isGated: boolean }) => void;
}

const AddChatModal: React.FC<AddChatModalProps> = ({ isOpen, onClose, onAddChannel }) => {
  const [name, setName] = useState('');
  const [isGated, setIsGated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddChannel({ name, isGated });
      // Reset fields
      setName('');
      setIsGated(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Create a new channel</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
              Channel Name
            </label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">#</span>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. general-discussion"
                    className="w-full bg-secondary border border-border rounded-lg p-3 pl-7 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-300"
                    required
                />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <label htmlFor="isGated" className="text-sm font-medium text-text-secondary">
              Gated Channel
              <p className="text-xs text-text-secondary/70">Only users with specific credentials can join.</p>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="isGated"
                checked={isGated}
                onChange={(e) => setIsGated(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Channel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddChatModal;
