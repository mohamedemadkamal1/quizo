import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { SupportModal } from '@/components/support/SupportModal';
import { useAuthStore } from '@/store/auth.store';

type SupportModalContextValue = {
  openSupportModal: () => void;
};

const SupportModalContext = createContext<SupportModalContextValue | null>(
  null,
);

export function SupportModalProvider({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.session?.user ?? null);
  const [visible, setVisible] = useState(false);
  const openSupportModal = useCallback(() => setVisible(true), []);
  const closeSupportModal = useCallback(() => setVisible(false), []);
  const contextValue = useMemo(
    () => ({ openSupportModal }),
    [openSupportModal],
  );

  return (
    <SupportModalContext.Provider value={contextValue}>
      {children}
      {visible ? (
        <SupportModal
          initialEmail={user?.email ?? ''}
          initialName={user?.displayName ?? ''}
          onDismiss={closeSupportModal}
        />
      ) : null}
    </SupportModalContext.Provider>
  );
}

export function useSupportModal(): SupportModalContextValue {
  const context = useContext(SupportModalContext);

  if (!context) {
    throw new Error('useSupportModal must be used within SupportModalProvider.');
  }

  return context;
}
