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