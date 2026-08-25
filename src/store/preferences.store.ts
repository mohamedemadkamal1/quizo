import * as SecureStore from 'expo-secure-store';
import { useStore } from 'zustand';
import type { StateStorage } from 'zustand/middleware';

import {
  createPreferencesStore,
  type PreferencesStoreState,
} from '@/store/preferences-state';

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

const preferencesStore = createPreferencesStore(secureStorage);

export function usePreferencesStore<T>(
  selector: (state: PreferencesStoreState) => T,
): T {
  return useStore(preferencesStore, selector);
}

let hydrationPromise: Promise<void> | null = null;

export function hydratePreferences(): Promise<void> {
  if (!hydrationPromise) {
    hydrationPromise = Promise.resolve(preferencesStore.persist.rehydrate()).catch(
      (error) => {
        hydrationPromise = null;
        throw error;
      },
    );
  }

  return hydrationPromise;
}
