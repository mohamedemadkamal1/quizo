import { z } from 'zod';

import type { Translate } from '@/i18n';

export function createSupportSchema(t: Translate) {
  return z.object({
    name: z.string().trim().min(1, t('support.validation.nameRequired')),
    email: z
      .string()
      .trim()
      .min(1, t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    message: z.string().trim().min(1, t('support.validation.messageRequired')),
  });
}

export type SupportFormValues = z.infer<
  ReturnType<typeof createSupportSchema>
>;
