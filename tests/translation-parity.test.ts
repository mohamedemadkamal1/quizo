import assert from 'node:assert/strict';
import test from 'node:test';

import { ar } from '../src/i18n/locales/ar.ts';
import { en } from '../src/i18n/locales/en.ts';

function leafKeys(value: object, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return typeof child === 'string'
      ? [path]
      : leafKeys(child as object, path);
  });
}

test('Arabic and English dictionaries have exact leaf-key parity', () => {
  assert.deepEqual(leafKeys(ar).sort(), leafKeys(en).sort());
});

