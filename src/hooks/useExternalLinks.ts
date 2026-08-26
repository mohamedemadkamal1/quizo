import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useTranslation } from '@/hooks/useTranslation';
import { openExternalUrl, TERMS_URL } from '@/utils/external-links';

export function useExternalLinks() {
  const { t } = useTranslation();

  const openTerms = useCallback(async () => {
    if (!(await openExternalUrl(TERMS_URL))) {
      Alert.alert(t('legal.unavailableTitle'), t('legal.unavailableMessage'));
    }
  }, [t]);

  return { openTerms };
}
