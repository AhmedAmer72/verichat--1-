import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import { User, Mail, Smile, Camera } from 'lucide-react';
import UsernameSetupModal from '../components/shared/UsernameSetupModal';

const ProfilePage: React.FC = () => {
  const { user, needsUsernameSetup, setUsername } = useAuth();
  const [showUsernameModal, setShowUsernameModal] = useState(needsUsernameSetup);

  if (!user) {
    return <div>Loading Profile...</div>;
  }

  const { id: mocaId, email } = user.user;
  const storedUsername = localStorage.getItem(`username_${mocaId}`);
  const name = storedUsername || user.airId?.name || user.user.name || email || mocaId;
  const storedAvatar = localStorage.getItem(`avatar_${mocaId}`);
  const avatar = storedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=150&background=6366f1&color=ffffff`;

  const handleSetUsername = (username: string) => {
    setUsername(username);
    setShowUsernameModal(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        localStorage.setItem(`avatar_${mocaId}`, result);
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <UsernameSetupModal 
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onSetUsername={handleSetUsername}
        currentEmail={email || mocaId}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">{name}</h1>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row items-center gap-8 p-4">
          {/* Avatar */}
          <div className="relative group flex-shrink-0">
            <img src={avatar} alt="User Avatar" className="w-40 h-40 rounded-full border-4 border-border object-cover" />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera className="text-white" size={24} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          {/* Details */}
          <div className="flex-1 w-full space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                Name
              </label>
              <div className="relative">
                <Smile className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input type="text" id="name" value={name} disabled className="w-full bg-secondary border border-border rounded-lg p-3 pl-10 disabled:opacity-70 text-white" />
              </div>
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input type="email" id="email" value={email || 'N/A'} disabled className="w-full bg-secondary border border-border rounded-lg p-3 pl-10 disabled:opacity-70 text-white" />
              </div>
            </div>
            {/* Moca ID */}
            <div>
              <label htmlFor="mocaId" className="block text-sm font-medium text-text-secondary mb-1">
                Moca ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input type="text" id="mocaId" value={mocaId} disabled className="w-full bg-secondary border border-border rounded-lg p-3 pl-10 disabled:opacity-70 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
    </>
  );
};

export default ProfilePage;