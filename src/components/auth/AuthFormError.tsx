import { AppText } from '@/components/common/AppText';

type AuthFormErrorProps = {
  message?: string;
};

export function AuthFormError({ message }: AuthFormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <AppText
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className="text-center font-nunito text-xs font-medium leading-4 text-red-500"
    >
      {message}
    </AppText>
  );
}
