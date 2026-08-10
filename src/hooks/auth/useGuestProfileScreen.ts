import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  type GuestProfileFormValues,
  guestProfileSchema,
} from '@/schemas/auth.schemas';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useGuestProfileScreen() {
  const session = useAuthStore((state) => state.session);
  const completeAccountProfile = useAuthStore(
    (state) => state.completeAccountProfile,
  );
  const continueAsGuest = useAuthStore((state) => state.continueAsGuest);
  const isAccountFlow = Boolean(session);
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GuestProfileFormValues>({
    resolver: zodResolver(guestProfileSchema),
    defaultValues: { nickname: '', age: '' },
  });

  async function submit(values: GuestProfileFormValues) {
    const payload = {
      nickname: values.nickname.trim(),
      age: Number(values.age),
    };

    try {
      if (isAccountFlow) {
        await completeAccountProfile(payload);
      } else {
        await continueAsGuest(payload);
      }
    } catch (error) {
      setError('root', {
        message: getApiErrorMessage(
          error,
          isAccountFlow
            ? 'Unable to complete your profile.'
            : 'Unable to start the guest session.',
        ),
      });
    }
  }

  return {
    control,
    errors,
    isSubmitting,
    onAgeChange: (value: string) => {
      setValue('age', value.replace(/\D/g, '').slice(0, 3), {
        shouldDirty: true,
        shouldValidate: false,
      });
    },
    onSubmit: () => {
      void handleSubmit(submit)();
    },
  };
}
