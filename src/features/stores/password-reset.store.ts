import { create } from 'zustand';

type PasswordResetStore = {
  email: string | null;
  resetToken: string | null;
  begin: (email: string) => void;
  markVerified: (resetToken: string) => void;
  clear: () => void;
};

export const usePasswordResetStore = create<PasswordResetStore>((set) => ({
  email: null,
  resetToken: null,

  begin: (email) => {
    set({
      email: email.trim().toLowerCase(),
      resetToken: null,
    });
  },

  markVerified: (resetToken) => {
    set({ resetToken });
  },

  clear: () => {
    set({
      email: null,
      resetToken: null,
    });
  },
}));
