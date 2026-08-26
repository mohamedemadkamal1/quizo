import { createStore } from 'zustand/vanilla';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import { PREFERENCES_STORAGE_KEY } from './storage-keys.ts';

export type PreferencesStoreState = {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
};

export function createPreferencesStore(storage: StateStorage) {
  return createStore<PreferencesStoreState>()(
    persist(
      (set) => ({
        soundEnabled: true,
        setSoundEnabled: (soundEnabled) => {
          set({ soundEnabled });
        },
      }),
      {
        name: PREFERENCES_STORAGE_KEY,
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          soundEnabled: state.soundEnabled,
        }),
        skipHydration: true,
        merge: (persistedState, currentState) => {
          const persisted = (persistedState ?? {}) as {
            soundEnabled?: unknown;
            readQuestionsAloud?: unknown;
          };
          let restoredSoundEnabled = true;

          if (typeof persisted.soundEnabled === 'boolean') {
            restoredSoundEnabled = persisted.soundEnabled;
          } else if (typeof persisted.readQuestionsAloud === 'boolean') {
            // Migrate the previous narration-only preference into the new
            // app-wide sound switch without losing the user's choice.
            restoredSoundEnabled = persisted.readQuestionsAloud;
          }

          return {
            ...currentState,
            soundEnabled: restoredSoundEnabled,
          };
        },
      },
    ),
  );
}
