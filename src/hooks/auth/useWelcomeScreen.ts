import { useRouter } from 'expo-router';

export function useWelcomeScreen() {
  const router = useRouter();

  return {
    onContinueWithEmail: () => {
      router.push('/sign-in');
    },
    onContinueAsGuest: () => {
      router.push('/guest-profile');
    },
  };
}
