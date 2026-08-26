import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { getDirectionalTextValues } from '../src/i18n/text-direction.ts';

test('answer prose uses exact Arabic and English alignment values', () => {
  assert.deepEqual(getDirectionalTextValues('ar'), {
    direction: 'ltr',
    textAlign: 'right',
    writingDirection: 'rtl',
  });
  assert.deepEqual(getDirectionalTextValues('en'), {
    direction: 'ltr',
    textAlign: 'left',
    writingDirection: 'ltr',
  });
});

test('every answer visual state shares the same wrapping directional label', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/components/questions/AnswerOption.tsx'),
    'utf8',
  );

  assert.match(source, /<AppText\s+alignToLanguage/);
  assert.match(source, /numberOfLines=\{2\}/);
  assert.match(source, /minWidth: 0/);
  assert.match(source, /flex: 1/);
  assert.equal(source.match(/<AppText\s+alignToLanguage/g)?.length, 1);
});

