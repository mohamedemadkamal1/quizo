import assert from 'node:assert/strict';
import test from 'node:test';

import { AxiosHeaders } from 'axios';

import {
  applyApiRequestHeaders,
  LANGUAGE_HEADER,
} from '../src/services/api/request-headers.ts';

test('English requests keep existing headers and receive lng: en', () => {
  const headers = new AxiosHeaders({
    'Content-Type': 'application/json',
    'X-Request-Id': 'request-1',
  });

  applyApiRequestHeaders(headers, 'en', 'access-token');

  assert.equal(headers.get(LANGUAGE_HEADER), 'en');
  assert.equal(headers.get('Authorization'), 'Bearer access-token');
  assert.equal(headers.get('Content-Type'), 'application/json');
  assert.equal(headers.get('X-Request-Id'), 'request-1');
});

test('the next request replaces English with Arabic without duplicate headers', () => {
  const headers = new AxiosHeaders({ lng: 'en' });

  applyApiRequestHeaders(headers, 'ar', 'access-token');

  assert.equal(headers.get(LANGUAGE_HEADER), 'ar');
  assert.equal(
    Object.keys(headers.toJSON()).filter(
      (key) => key.toLowerCase() === LANGUAGE_HEADER,
    ).length,
    1,
  );
});

test('an explicit Authorization header and all query parameters remain intact', () => {
  const headers = new AxiosHeaders({
    Authorization: 'Bearer reset-token',
    Accept: 'application/json',
  });
  const params = {
    page: 2,
    limit: 10,
    stage: 'BEGINNER',
    subCategoryId: 7,
  };
  const originalParams = { ...params };

  applyApiRequestHeaders(headers, 'ar', 'session-token');

  assert.equal(headers.get('Authorization'), 'Bearer reset-token');
  assert.equal(headers.get('Accept'), 'application/json');
  assert.deepEqual(params, originalParams);
  assert.equal('lang' in params, false);
  assert.equal('lng' in params, false);
});
