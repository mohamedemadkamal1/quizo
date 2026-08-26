import assert from 'node:assert/strict';
import test from 'node:test';

import { QueryClient } from '@tanstack/react-query';

import {
  createLocalizedQueryKey,
  isLocalizedQueryKey,
} from '../src/services/api/localized-query-key.ts';
import { markLocalizedQueriesStale } from '../src/services/api/query-client.ts';

test('localized query keys partition otherwise identical English and Arabic data', () => {
  const english = createLocalizedQueryKey('home', 'en', 'user-1');
  const arabic = createLocalizedQueryKey('home', 'ar', 'user-1');

  assert.notDeepEqual(english, arabic);
  assert.equal(isLocalizedQueryKey(english), true);
  assert.equal(isLocalizedQueryKey(arabic), true);
  assert.equal(isLocalizedQueryKey(['preferences', 'user-1']), false);
});

test('both language partitions can coexist without leaking data', () => {
  const client = new QueryClient();
  const english = createLocalizedQueryKey('home', 'en', 'user-1');
  const arabic = createLocalizedQueryKey('home', 'ar', 'user-1');

  client.setQueryData(english, { title: 'Categories' });
  client.setQueryData(arabic, { title: 'الفئات' });

  assert.deepEqual(client.getQueryData(english), { title: 'Categories' });
  assert.deepEqual(client.getQueryData(arabic), { title: 'الفئات' });
});

test('language switching marks localized caches stale without touching local state', async () => {
  const client = new QueryClient();
  const english = createLocalizedQueryKey('home', 'en', 'user-1');
  const arabic = createLocalizedQueryKey('home', 'ar', 'user-1');
  const preferences = ['preferences', 'user-1'] as const;
  client.setQueryDefaults(['home'], { staleTime: Infinity });
  client.setQueryDefaults(['preferences'], { staleTime: Infinity });
  client.setQueryData(english, { title: 'Categories' });
  client.setQueryData(arabic, { title: 'الفئات' });
  client.setQueryData(preferences, { sound: true });

  await markLocalizedQueriesStale(client);

  assert.equal(client.getQueryState(english)?.isInvalidated, true);
  assert.equal(client.getQueryState(arabic)?.isInvalidated, true);
  assert.equal(client.getQueryState(preferences)?.isInvalidated, false);
});
