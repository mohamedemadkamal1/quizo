import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import {
  AuthSession,
  GuestProfilePayload,
  SignInPayload,
  SignUpPayload,
} from '@/features/auth/types/auth.types';
import { setApiAccessToken } from '@/lib/api/api-client';

import {
  createGuestSession,
  signIn as signInRequest,
  signUp as signUpRequest,
} from '../services/auth.service';

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

type AuthStore = {
  session: AuthSession | null;
  signIn: (payload: SignInPayload) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  continueAsGuest: (payload: GuestProfilePayload) => Promise<void>;
  signOut: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,

      signIn: async (payload) => {
        const session = await signInRequest(payload);

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      signUp: async (payload) => {
        const session = await signUpRequest(payload);

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      continueAsGuest: async (payload) => {
        const session = await createGuestSession(payload);

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      signOut: () => {
        setApiAccessToken(null);
        set({ session: null });
      },
    }),
    {
      name: 'quizo-auth-session',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        session: state.session,
      }),
      skipHydration: true,
    },
  ),
);
