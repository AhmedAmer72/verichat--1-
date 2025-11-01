import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, Award, Shield, User } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { verifyCredential, issueXPCredential, getUserXP } from '../../lib/airkit';

const CredentialTester: React.FC = () => {
  const [isTestingVerification, setIsTestingVerification] = useState(false);
  const [isTestingIssuance, setIsTestingIssuance] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string>('');
  const [issuanceResult, setIssuanceResult] = useState<string>('');
  const [currentXP, setCurrentXP] = useState<number>(0);

  const testCredentialVerification = async (credentialType: string) => {
    setIsTestingVerification(true);
    setVerificationResult('Testing...');
    
    try {
      console.log(`🧪 Testing credential verification for: ${credentialType}`);
      const result = await verifyCredential(credentialType);
      setVerificationResult(result ? `✅ ${credentialType} credential verified successfully!` : `❌ ${credentialType} credential verification failed`);
    } catch (error) {
      setVerificationResult(`❌ Error: ${error.message}`);
    } finally {
      setIsTestingVerification(false);
    }
  };

  const testXPIssuance = async () => {
    setIsTestingIssuance(true);
    setIssuanceResult('Issuing...');
    
    try {
      console.log('🧪 Testing XP credential issuance');
      const result = await issueXPCredential(25, 'Testing XP credential system');
      
      if (result) {
        const newXP = await getUserXP();
        setCurrentXP(newXP);
        setIssuanceResult(`✅ Successfully issued 25 XP! Total: ${newXP}`);
      } else {
        setIssuanceResult('❌ XP issuance failed');
      }
    } catch (error) {
      setIssuanceResult(`❌ Error: ${error.message}`);
    } finally {
      setIsTestingIssuance(false);
    }
  };

  const loadCurrentXP = async () => {
    try {
      const xp = await getUserXP();
      setCurrentXP(xp);
    } catch (error) {
      console.error('Failed to load XP:', error);
    }
  };

  React.useEffect(() => {
    loadCurrentXP();
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <TestTube className="text-accent" size={24} />
        <h2 className="text-xl font-bold text-white">AIR Kit Credential Tester</h2>
      </div>
      
      <div className="space-y-6">
        {/* Current XP Display */}
        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
          <Award className="text-accent" size={20} />
          <span className="text-white">Current XP: <strong className="text-accent">{currentXP}</strong></span>
          <Button onClick={loadCurrentXP} variant="secondary" className="ml-auto">
            Refresh
          </Button>
        </div>

        {/* Credential Verification Tests */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Test Credential Verification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              onClick={() => testCredentialVerification('developer')} 
              disabled={isTestingVerification}
              className="flex items-center gap-2"
            >
              <User size={16} />
              Test Developer
            </Button>
            <Button 
              onClick={() => testCredentialVerification('expert')} 
              disabled={isTestingVerification}
              className="flex items-center gap-2"
            >
              <Shield size={16} />
              Test Expert
            </Button>
            <Button 
              onClick={() => testCredentialVerification('premium')} 
              disabled={isTestingVerification}
              className="flex items-center gap-2"
            >
              <Award size={16} />
              Test Premium
            </Button>
          </div>
          {verificationResult && (
            <div className="mt-3 p-3 bg-secondary rounded-lg">
              <p className="text-white">{verificationResult}</p>
            </div>
          )}
        </div>

        {/* XP Issuance Test */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Test XP Credential Issuance</h3>
          <Button 
            onClick={testXPIssuance} 
            disabled={isTestingIssuance}
            className="flex items-center gap-2"
          >
            <Award size={16} />
            {isTestingIssuance ? 'Issuing XP...' : 'Issue 25 XP Test Credential'}
          </Button>
          {issuanceResult && (
            <div className="mt-3 p-3 bg-secondary rounded-lg">
              <p className="text-white">{issuanceResult}</p>
            </div>
          )}
        </div>

        <div className="text-sm text-text-secondary">
          <p>💡 <strong>How to verify it's working:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Check browser console for detailed AIR Kit logs</li>
            <li>Watch for successful API calls and responses</li>
            <li>XP should increment after successful issuance</li>
            <li>Verification should return true/false based on actual credentials</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default CredentialTester;