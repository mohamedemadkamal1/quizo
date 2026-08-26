import assert from 'node:assert/strict';
import test from 'node:test';

import type { Translate } from '../src/i18n/index.ts';
import { createSupportSchema } from '../src/schemas/support.schema.ts';
import { getSafeSupportErrorMessage } from '../src/utils/get-api-error-message.ts';

const t = ((key: string) => key) as Translate;

function axiosError(status: number, message: unknown) {
  return {
    isAxiosError: true,
    response: {
      status,
      data: { message },
    },
  };
}

test('support payload values are trimmed before submission', () => {
  const result = createSupportSchema(t).parse({
    name: '  Mostafa  ',
    email: '  mostafafawzy471@gmail.com  ',
    message: '  very good app  ',
  });

  assert.deepEqual(result, {
    name: 'Mostafa',
    email: 'mostafafawzy471@gmail.com',
    message: 'very good app',
  });
});

test('support validation reports every required or invalid field inline', () => {
  const result = createSupportSchema(t).safeParse({
    name: '   ',
    email: 'not-an-email',
    message: '   ',
  });

  assert.equal(result.success, false);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    assert.deepEqual(errors.name, ['support.validation.nameRequired']);
    assert.deepEqual(errors.email, ['validation.emailInvalid']);
    assert.deepEqual(errors.message, ['support.validation.messageRequired']);
  }
});

test('support surfaces safe client validation and rate-limit messages', () => {
  assert.equal(
    getSafeSupportErrorMessage(
      axiosError(422, ['Email is invalid.', 'Message is required.']),
      'fallback',
    ),
    'Email is invalid. Message is required.',
  );
  assert.equal(
    getSafeSupportErrorMessage(
      axiosError(429, 'Please wait before sending another message.'),
      'fallback',
    ),
    'Please wait before sending another message.',
  );
});

test('support hides transport, server, authentication, and technical errors', () => {
  const fallback = 'safe fallback';

  assert.equal(getSafeSupportErrorMessage(new Error('offline'), fallback), fallback);
  assert.equal(
    getSafeSupportErrorMessage(axiosError(500, 'Database unavailable'), fallback),
    fallback,
  );
  assert.equal(
    getSafeSupportErrorMessage(axiosError(401, 'Token expired'), fallback),
    fallback,
  );
  assert.equal(
    getSafeSupportErrorMessage(
      axiosError(422, 'TypeError: failed\n at support.ts:12'),
      fallback,
    ),
    fallback,
  );
});
