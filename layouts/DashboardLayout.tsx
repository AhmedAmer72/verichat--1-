import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/shared/NavBar';
import Footer from '../components/shared/Footer';
import AnimatedIconBackground from '../components/shared/AnimatedIconBackground';
import MfaSetupModal from '../components/shared/MfaSetupModal';
import { useAuthStore } from '../store/authStore';

const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isMfaSetup, user, mfaModalDismissed, dismissMfaModal } = useAuthStore();
  const [showMfaModal, setShowMfaModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user && !isMfaSetup && !mfaModalDismissed) {
      setShowMfaModal(true);
    } else {
      setShowMfaModal(false);
    }
  }, [isAuthenticated, isMfaSetup, user, mfaModalDismissed]);

  const handleCloseMfaModal = () => {
    dismissMfaModal();
    setShowMfaModal(false);
  };

  return (
    <div className="relative flex flex-col h-screen bg-background overflow-hidden">
      <AnimatedIconBackground />
      <MfaSetupModal isOpen={showMfaModal} onClose={handleCloseMfaModal} />
      <div className="relative z-10 flex flex-col h-full">
        <NavBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
              <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;