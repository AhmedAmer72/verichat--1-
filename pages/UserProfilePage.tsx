import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchUserProfile } from '../api/mockApi';
import type { UserProfile } from '../lib/mockData';
import Card from '../components/ui/Card';
import SkeletonLoader from '../components/shared/SkeletonLoader';
import { ChevronLeft, Star, HelpCircle, MessageSquare, Calendar } from 'lucide-react';

const StatCard: React.FC<{ icon: React.ElementType, label: string, value: number | string }> = ({ icon: Icon, label, value }) => (
    <div className="bg-secondary/50 p-4 rounded-lg text-center">
        <Icon className="mx-auto text-accent mb-2" size={24} />
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
    </div>
);

const UserProfilePage: React.FC = () => {
  const { mocaId } = useParams<{ mocaId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!mocaId) return;
      setIsLoading(true);
      const data = await fetchUserProfile(mocaId);
      setProfile(data);
      setIsLoading(false);
    };
    loadProfile();
  }, [mocaId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-accent mb-6 hover:underline">
        <ChevronLeft size={20} />
        Back
      </button>

      {isLoading ? (
        <Card><SkeletonLoader className="h-64" /></Card>
      ) : !profile ? (
        <Card><p className="p-8 text-center">User not found.</p></Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
                <div className="p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <img src={profile.avatar} alt={profile.mocaId} className="w-40 h-40 rounded-full border-4 border-border object-cover flex-shrink-0" />
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold">{profile.mocaId}</h1>
                            <p className="text-text-secondary mt-2 flex items-center justify-center md:justify-start gap-2">
                                <Calendar size={16} />
                                Joined {profile.joinedDate}
                            </p>
                            <p className="mt-4 text-text-primary">{profile.bio}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 border-t border-border pt-6">
                        <StatCard icon={Star} label="Reputation" value={profile.reputation} />
                        <StatCard icon={MessageSquare} label="Answers Provided" value={profile.answersProvided} />
                        <StatCard icon={HelpCircle} label="Questions Asked" value={profile.questionsAsked} />
                    </div>
                </div>
            </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserProfilePage;