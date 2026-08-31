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
  assert.match(source, /minWidth: 0/);
  assert.match(source, /flex: 1/);
  assert.equal(source.match(/<AppText\s+alignToLanguage/g)?.length, 1);
});

test('an answer label wraps freely and the pill grows to it', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/components/questions/AnswerOption.tsx'),
    'utf8',
  );

  // The label is neither capped nor shrunk: the pill takes the height the text
  // needs, and `uniformHeight` levels the question's options to the tallest.
  // Matched as JSX props on their own line so the comments explaining why they
  // are gone do not count as usages.
  assert.doesNotMatch(source, /^\s*numberOfLines[=\s]/m);
  assert.doesNotMatch(source, /^\s*adjustsFontSizeToFit[=\s]*$/m);
  assert.match(source, /minHeight: Math\.max\(/);
  assert.match(source, /uniformHeight/);
});

test('the question card grows with its prompt instead of clipping it', async () => {
  const source = await readFile(
    path.join(process.cwd(), 'src/components/questions/QuestionCard.tsx'),
    'utf8',
  );

  // The prompt sits in flow so its height drives the card's, and the card is
  // bounded below rather than pinned, so a long question can extend it.
  assert.match(source, /minHeight: CARD_MIN_HEIGHT \* scale/);
  assert.doesNotMatch(source, /height: 188 \* scale/);
  assert.doesNotMatch(source, /^\s*numberOfLines[=\s]/m);
  assert.match(source, /marginBottom: TIMER_RESERVE \* scale/);
});

