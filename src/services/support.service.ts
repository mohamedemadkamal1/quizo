import { apiClient } from '@/services/api/api-client';
import type { SupportRequest } from '@/types/support.types';

export async function submitSupportRequest(
  payload: SupportRequest,
): Promise<void> {
  // `apiClient` normalizes EXPO_PUBLIC_API_URL to end in `/api`, so this sends
  // POST /api/support without duplicating the prefix. Axios accepts every 2xx
  // response by default, and this endpoint does not require a response body.
  await apiClient.post('/support', {
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
  });
}
