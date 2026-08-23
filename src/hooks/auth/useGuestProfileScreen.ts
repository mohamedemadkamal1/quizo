import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useTranslation } from '@/hooks/useTranslation';
import {
  createGuestProfileSchema,
  type GuestProfileFormValues,
} from '@/schemas/auth.schemas';
import { useAuthStore } from '@/store/auth.store';
import { getApiErrorMessage } from '@/utils/get-api-error-message';

export function useGuestProfileScreen() {
  const { t } = useTranslation();
  const session = useAuthStore((state) => state.session);
  const completeAccountProfile = useAuthStore(
    (state) => state.completeAccountProfile,
  );
  const continueAsGuest = useAuthStore((state) => state.continueAsGuest);
  const isAccountFlow = Boolean(session);
  const schema = useMemo(() => createGuestProfileSchema(t), [t]);
  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GuestProfileFormValues>({
    resolver: zodResolver(schema),
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
            ? t('profile.errors.completeProfile')
            : t('auth.errors.guestSessionFailed'),
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
