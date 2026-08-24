import { create } from 'zustand';

/**
 * Deliberately in-memory: a signup that was never verified should not survive
 * the app being closed, and there is no session to persist yet either.
 */

type AccountVerificationStore = {
  email: string | null;
  begin: (email: string) => void;
  clear: () => void;
};

export const useAccountVerificationStore = create<AccountVerificationStore>(
  (set) => ({
    email: null,

    begin: (email) => {
      set({ email: email.trim().toLowerCase() });
    },

    clear: () => {
      set({ email: null });
    },
  }),
);
