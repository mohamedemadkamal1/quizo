import { createStore } from 'zustand/vanilla';
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware';

import { PREFERENCES_STORAGE_KEY } from './storage-keys.ts';

export type PreferencesStoreState = {
  readQuestionsAloud: boolean;
  setReadQuestionsAloud: (enabled: boolean) => void;
};

export function createPreferencesStore(storage: StateStorage) {
  return createStore<PreferencesStoreState>()(
    persist(
      (set) => ({
        readQuestionsAloud: false,
        setReadQuestionsAloud: (readQuestionsAloud) => {
          set({ readQuestionsAloud });
        },
      }),
      {
        name: PREFERENCES_STORAGE_KEY,
        storage: createJSONStorage(() => storage),
        partialize: (state) => ({
          readQuestionsAloud: state.readQuestionsAloud,
        }),
        skipHydration: true,
        merge: (persistedState, currentState) => {
          const persisted = (persistedState ?? {}) as Partial<
            PreferencesStoreState
          >;

          return {
            ...currentState,
            readQuestionsAloud:
              typeof persisted.readQuestionsAloud === 'boolean'
                ? persisted.readQuestionsAloud
                : false,
          };
        },
      },
    ),
  );
}
