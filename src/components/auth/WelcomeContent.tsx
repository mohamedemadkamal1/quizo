import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { SocialOptionButtons } from '@/components/auth/SocialOptionButtons';
import { useTranslation } from '@/hooks/useTranslation';
import type { useWelcomeScreen } from '@/hooks/auth/useWelcomeScreen';

function LegalNotice() {
  const { t } = useTranslation();

  return (
    <AppText className="text-center font-nunito text-xs font-medium leading-4 text-slate-500">
      {t('auth.welcome.legalPrefix')}
      <AppText className="text-muv-blue-300 underline">
        {t('auth.welcome.legalTerms')}
      </AppText>
      {t('auth.welcome.legalSeparator')}
      <AppText className="text-muv-blue-300 underline">
        {t('auth.welcome.legalPrivacy')}
      </AppText>
      {t('auth.welcome.legalSuffix')}
    </AppText>
  );
}

type WelcomeContentProps = {
  screen: ReturnType<typeof useWelcomeScreen>;
};

export function WelcomeContent({ screen }: WelcomeContentProps) {
  const { t } = useTranslation();

  return (
    <AuthScreenLayout
      title={t('auth.welcome.title')}
      subtitle={t('auth.welcome.subtitle')}
      footer={<LegalNotice />}
      showLanguageSelector
    >
      <AppButton
        label={t('auth.welcome.continueWithEmail')}
        onPress={screen.onContinueWithEmail}
      />

      <AppButton
        label={t('auth.welcome.continueAsGuest')}
        variant="secondary"
        onPress={screen.onContinueAsGuest}
      />

      <View pointerEvents="none" style={styles.divider} />

      <SocialOptionButtons />
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  divider: {
    width: 150,
    height: 1,
    marginVertical: -1,
    backgroundColor: '#777777',
  },
});
