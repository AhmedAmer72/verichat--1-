import { create } from 'zustand';
import { getAirService } from '../lib/airkit';
import { AirLoginResult, AirUserDetails } from '@mocanetwork/airkit';

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  isMfaSetup: boolean;
  user: AirUserDetails | null;
  token: string | null;
  isLoading: boolean;
  needsUsernameSetup: boolean;
  mfaModalDismissed: boolean;
  checkLogin: () => Promise<void>;
  login: (navigate: (path: string) => void) => Promise<void>;
  logout: () => void;
  setupMfa: () => Promise<void>;
  updateUser: (data: Partial<AirUserDetails>) => void;
  setUsername: (username: string) => void;
  dismissMfaModal: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isInitializing: true,
  isMfaSetup: false,
  user: null,
  token: null,
  isLoading: false,
  needsUsernameSetup: false,
  mfaModalDismissed: false,
  checkLogin: async () => {
    const airService = getAirService();
    try {
      const userInfo = await airService.getUserInfo();
      if (userInfo) {
        const token = await airService.getAccessToken();
        const hasCustomUsername = localStorage.getItem(`username_${userInfo.user.id}`);
        const mfaDismissed = localStorage.getItem(`mfa_dismissed_${userInfo.user.id}`) === 'true';
        set({
          isAuthenticated: true,
          user: userInfo,
          token: token.token,
          isInitializing: false,
          isMfaSetup: userInfo.user.isMFASetup || false,
          needsUsernameSetup: !hasCustomUsername && !userInfo.airId?.name,
          mfaModalDismissed: mfaDismissed,
        });
        console.log('User is already logged in.');
      } else {
        set({ isInitializing: false });
        console.log('User is not logged in.');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      set({ isInitializing: false });
    }
  },
  login: async (navigate) => {
    set({ isLoading: true });
    try {
      // Step 1: Fetch the Partner JWT from the backend
      console.log('Fetching Partner JWT from backend...');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/generate-jwt`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to fetch JWT: ${errorData.error || response.statusText}`);
      }
      const { token: authToken } = await response.json();
      console.log('Successfully fetched Partner JWT.');

      // Step 2: Call AIR Kit login with the fetched token
      const airService = getAirService();
      const result: AirLoginResult = await airService.login({ authToken: authToken });

      // Step 3: Check if login was truly successful
      if (result && result.token) {
        console.log('AIR Kit login successful!');
        
        // Fetch user info after successful login
        const userInfo = await airService.getUserInfo();
        
        if (userInfo) {
          const hasCustomUsername = localStorage.getItem(`username_${userInfo.user.id}`);
          const mfaDismissed = localStorage.getItem(`mfa_dismissed_${userInfo.user.id}`) === 'true';
          set({
            isAuthenticated: true,
            user: userInfo,
            token: result.token,
            isLoading: false,
            isMfaSetup: userInfo.user.isMFASetup || false,
            needsUsernameSetup: !hasCustomUsername && !userInfo.airId?.name,
            mfaModalDismissed: mfaDismissed,
          });
          navigate('/dashboard');
        } else {
          // Login succeeded but couldn't get user info - this is an error state
          console.error('Login succeeded but could not fetch user info');
          set({ isLoading: false });
        }
      } else {
        // Login failed, result.token will be null or undefined
        console.error('AIR Kit Login failed: Unknown error');
        set({ isLoading: false });
        
        // Don't call checkLogin() here - it creates confusion
        // If login failed, it failed. Show an error to the user instead.
      }
    } catch (error) {
      console.error('Error during login process:', error);
      set({ isLoading: false });
      // Don't call checkLogin() here either
    }
  },
  logout: () => {
    const airService = getAirService();
    airService.logout();
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      isMfaSetup: false,
      needsUsernameSetup: false,
      mfaModalDismissed: false,
    });
  },
  setupMfa: async () => {
    const airService = getAirService();
    try {
      await airService.setupOrUpdateMfa();
      console.log('MFA setup completed!');
      
      // Refresh user info to get updated MFA status
      const userInfo = await airService.getUserInfo();
      set({ 
        user: userInfo, 
        isMfaSetup: userInfo.user.isMFASetup || false 
      });
    } catch (error) {
      console.error('MFA setup failed:', error);
      throw error;
    }
  },
  updateUser: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
  setUsername: (username) => {
    const state = get();
    if (state.user) {
      localStorage.setItem(`username_${state.user.user.id}`, username);
      set({ needsUsernameSetup: false });
    }
  },
  dismissMfaModal: () => {
    const state = get();
    if (state.user) {
      localStorage.setItem(`mfa_dismissed_${state.user.user.id}`, 'true');
      set({ mfaModalDismissed: true });
    }
  },
}));