import { AirService, BUILD_ENV } from '@mocanetwork/airkit';

let airService: AirService | null = null;

export const initAirService = async (): Promise<void> => {
  try {
    const partnerId = import.meta.env.VITE_AIRKIT_PARTNER_ID;

    if (!partnerId || partnerId === 'YOUR_PARTNER_ID') {
      console.error('AIR Kit Partner ID is not set. Please set VITE_AIRKIT_PARTNER_ID in your .env.local file and restart the development server.');
      return;
    }

    const service = new AirService({
      partnerId: partnerId
    });

    await service.init({
      buildEnv: BUILD_ENV.SANDBOX,
      enableLogging: import.meta.env.DEV,
      skipRehydration: false,
    });
    
    airService = service;
    console.log('AIR Kit Service Initialized Successfully');
  } catch (error) {
    console.error('Failed to initialize AIR Kit Service:', error);
  }
};

export const getAirService = (): AirService => {
  if (!airService) {
    throw new Error('AIR Kit Service has not been initialized. Call initAirService() on app startup.');
  }
  return airService;
};

// Credential Services
export const verifyCredential = async (credentialType: string): Promise<boolean> => {
  console.log(`🔍 Starting credential verification for type: ${credentialType}`);
  
  try {
    const service = getAirService();
    console.log('✅ AIR Service obtained');
    
    // Generate Partner JWT for credential operations
    console.log('🔑 Fetching Partner JWT...');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/generate-jwt`);
    if (!response.ok) throw new Error('Failed to get auth token');
    const { token: authToken } = await response.json();
    console.log('✅ Partner JWT obtained');
    
    // Use AIR Kit credential verification
    const programId = `verichat-${credentialType}-verification`;
    console.log(`🚀 Calling AIR Kit verifyCredential with programId: ${programId}`);
    
    const verificationRequest = {
      authToken,
      programId,
      redirectUrl: window.location.origin
    };
    console.log('📋 Verification request:', verificationRequest);
    
    const result = await service.verifyCredential(verificationRequest);
    console.log('✅ AIR Kit verification result:', result);
    
    return true; // If no error thrown, verification succeeded
    
  } catch (error) {
    console.error('❌ Credential verification failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      credentialType
    });
    return false;
  }
};

export const issueXPCredential = async (points: number, reason: string): Promise<boolean> => {
  console.log(`🏆 Starting XP credential issuance: ${points} points for "${reason}"`);
  
  try {
    const service = getAirService();
    const issuerDID = import.meta.env.VITE_AIRKIT_ISSUER_DID;
    console.log('✅ AIR Service obtained, Issuer DID:', issuerDID);
    
    // Generate Partner JWT for credential operations
    console.log('🔑 Fetching Partner JWT for credential issuance...');
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/generate-jwt`);
    if (!response.ok) throw new Error('Failed to get auth token');
    const { token: authToken } = await response.json();
    console.log('✅ Partner JWT obtained for issuance');
    
    const userInfo = await service.getUserInfo();
    if (!userInfo) {
      console.error('❌ No user info available');
      return false;
    }
    console.log('✅ User info obtained:', userInfo.user.id);

    // Issue XP credential using AIR Kit
    const credentialId = `xp-${Date.now()}-${userInfo.user.id}`;
    console.log('📋 Generated credential ID:', credentialId);
    
    const credentialData = {
      authToken,
      issuerDid: issuerDID,
      credentialId,
      credentialSubject: {
        id: userInfo.user.id,
        points,
        reason,
        timestamp: Date.now(),
        issuedBy: 'VeriChat'
      }
    };
    console.log('📋 Credential data:', credentialData);
    
    console.log('🚀 Calling AIR Kit issueCredential...');
    const result = await service.issueCredential(credentialData);
    console.log('✅ AIR Kit issuance result:', result);
    
    // Update local XP for immediate UI feedback
    const currentXP = parseInt(localStorage.getItem(`xp_${userInfo.user.id}`) || '0');
    const newXP = currentXP + points;
    localStorage.setItem(`xp_${userInfo.user.id}`, newXP.toString());
    
    console.log(`🎉 Successfully issued ${points} XP credential! Total XP: ${newXP}`);
    return true;
    
  } catch (error) {
    console.error('❌ XP credential issuance failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      points,
      reason
    });
    return false;
  }
};

export const getUserXP = async (): Promise<number> => {
  try {
    const service = getAirService();
    const userInfo = await service.getUserInfo();
    if (!userInfo) return 0;
    
    // TODO: Query actual XP credentials from AIR Kit
    // For now, use localStorage until we have credential querying methods
    return parseInt(localStorage.getItem(`xp_${userInfo.user.id}`) || '0');
  } catch (error) {
    console.error('Failed to get user XP:', error);
    return 0;
  }
};