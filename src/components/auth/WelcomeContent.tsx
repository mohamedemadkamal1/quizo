import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useExternalLinks } from '@/hooks/useExternalLinks';
import { useTranslation } from '@/hooks/useTranslation';
import type { useWelcomeScreen } from '@/hooks/auth/useWelcomeScreen';

function LegalNotice() {
  const { t } = useTranslation();
  const { openTerms } = useExternalLinks();

  return (
    <AppText className="text-center font-nunito text-xs font-medium leading-4 text-slate-500">
      {t('auth.welcome.legalPrefix')}
      <AppText
        accessibilityLabel={t('auth.welcome.legalLinkLabel')}
        accessibilityRole="link"
        className="text-muv-blue-300 underline"
        onPress={() => void openTerms()}
      >
        {t('auth.welcome.legalLink')}
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
    </AuthScreenLayout>
  );
}
