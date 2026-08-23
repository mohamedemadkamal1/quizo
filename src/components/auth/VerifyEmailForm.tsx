import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { OtpInput } from '@/components/auth/OtpInput';
import { AuthScreenLayout } from '@/components/auth/AuthScreenLayout';
import { useTranslation } from '@/hooks/useTranslation';
import type { useVerifyEmailScreen } from '@/hooks/auth/useVerifyEmailScreen';

type VerifyEmailFormProps = {
  screen: ReturnType<typeof useVerifyEmailScreen>;
};

export function VerifyEmailForm({ screen }: VerifyEmailFormProps) {
  const { t } = useTranslation();

  if (!screen.canRender) {
    return null;
  }

  return (
    <AuthScreenLayout
      title={t('auth.verifyEmail.title')}
      subtitle={t('auth.verifyEmail.subtitle')}
    >
      <OtpInput
        value={screen.code}
        onChange={screen.onCodeChange}
        autoFocus
        editable={!screen.isVerifying}
      />

      {screen.error ? (
        <AppText className="text-center font-nunito text-xs font-medium leading-4 text-red-500">
          {screen.error}
        </AppText>
      ) : null}

      <AppButton
        label={t('auth.verifyEmail.submit')}
        disabled={screen.code.length !== 6}
        isLoading={screen.isVerifying}
        onPress={screen.onVerify}
      />
    </AuthScreenLayout>
  );
}
