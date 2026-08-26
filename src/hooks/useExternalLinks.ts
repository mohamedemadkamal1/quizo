import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useTranslation } from '@/hooks/useTranslation';
import {
  openExternalUrl,
  SUPPORT_EMAIL_URL,
  TERMS_URL,
} from '@/utils/external-links';

export function useExternalLinks() {
  const { t } = useTranslation();

  const openSupportEmail = useCallback(async () => {
    if (!(await openExternalUrl(SUPPORT_EMAIL_URL))) {
      Alert.alert(
        t('support.unavailableTitle'),
        t('support.unavailableMessage'),
      );
    }
  }, [t]);

  const openTerms = useCallback(async () => {
    if (!(await openExternalUrl(TERMS_URL))) {
      Alert.alert(t('legal.unavailableTitle'), t('legal.unavailableMessage'));
    }
  }, [t]);

  return { openSupportEmail, openTerms };
}
