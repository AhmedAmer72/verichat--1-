import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (data: { title: string; content: string; tags: string }) => void;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ isOpen, onClose, onAddQuestion }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onAddQuestion({ title, content, tags });
      // Reset fields
      setTitle('');
      setContent('');
      setTags('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Ask a Public Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to handle re-entrancy in Solidity?"
              className="w-full bg-secondary border border-border rounded-lg p-3 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-text-secondary mb-1">
              Body
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Include all the information someone would need to answer your question."
              rows={5}
              className="w-full bg-secondary border border-border rounded-lg p-3 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-text-secondary mb-1">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. solidity, security, smart-contracts (comma-separated)"
              className="w-full bg-secondary border border-border rounded-lg p-3 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-300"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Post Your Question
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddQuestionModal;