import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import { translate } from '@/i18n';
import {
  AuthUser,
  AuthSession,
  GuestProfilePayload,
  SignInPayload,
  VerifyAccountPayload,
  VerifyCompleteProfilePayload,
} from '@/types/auth.types';
import { setApiAccessToken } from '@/services/api/api-client';
import { AUTH_STORAGE_KEY } from '@/store/storage-keys';
import { normalizeAvatarId } from '@/types/avatar.types';

import {
  completeAccountProfile as completeAccountProfileRequest,
  createGuestSession,
  signIn as signInRequest,
  verifyAccount as verifyAccountRequest,
  verifyCompleteProfile as verifyCompleteProfileRequest,
} from '@/services/auth.service';

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

type AuthStore = {
  session: AuthSession | null;
  signIn: (payload: SignInPayload) => Promise<void>;
  verifyAccount: (payload: VerifyAccountPayload) => Promise<void>;
  verifyCompleteProfile: (
    payload: VerifyCompleteProfilePayload,
  ) => Promise<void>;
  completeAccountProfile: (payload: GuestProfilePayload) => Promise<void>;
  continueAsGuest: (payload: GuestProfilePayload) => Promise<void>;
  replaceSessionUser: (user: AuthUser) => void;
  signOut: () => void;
};

function normalizePersistedSession(
  session: AuthSession | null | undefined,
): AuthSession | null {
  if (!session) {
    return null;
  }

  return {
    ...session,
    user: {
      ...session.user,
      avatar: normalizeAvatarId(session.user.avatar),
    },
  };
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,

      signIn: async (payload) => {
        const session = await signInRequest(payload);

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      verifyAccount: async (payload) => {
        const session = await verifyAccountRequest(payload);

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      // Replaces the whole session rather than just the user: converting a
      // guest issues a new token, so keeping the old one would leave every
      // later request authenticated as the guest that no longer exists.
      verifyCompleteProfile: async (payload) => {
        const session = await verifyCompleteProfileRequest(payload);

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      completeAccountProfile: async (payload) => {
        const currentSession = get().session;

        if (!currentSession) {
          throw new Error(
            translate('profile.errors.accountSessionRequired'),
          );
        }

        const user = await completeAccountProfileRequest(payload);
        const session = {
          accessToken: currentSession.accessToken,
          user,
        };

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      continueAsGuest: async (payload) => {
        const session = await createGuestSession(payload);

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      replaceSessionUser: (user) => {
        const currentSession = get().session;

        if (!currentSession) {
          throw new Error(translate('profile.errors.sessionRequired'));
        }

        const session = {
          accessToken: currentSession.accessToken,
          user,
        };

        setApiAccessToken(session.accessToken);
        set({ session });
      },

      signOut: () => {
        setApiAccessToken(null);
        set({ session: null });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        session: state.session,
      }),
      skipHydration: true,
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<AuthStore>;

        return {
          ...currentState,
          ...persisted,
          session: normalizePersistedSession(persisted.session),
        };
      },
    },
  ),
);
