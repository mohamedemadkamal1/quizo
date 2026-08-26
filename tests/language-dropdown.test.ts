import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

test('Welcome and Profile render the compact and full shared dropdown variants', async () => {
  const [welcome, profile, dropdown] = await Promise.all([
    readFile(
      path.join(process.cwd(), 'src/components/auth/AuthLanguageSelector.tsx'),
      'utf8',
    ),
    readFile(
      path.join(process.cwd(), 'src/components/profile/ProfileActions.tsx'),
      'utf8',
    ),
    readFile(
      path.join(process.cwd(), 'src/components/common/LanguageDropdown.tsx'),
      'utf8',
    ),
  ]);

  assert.match(welcome, /variant="compact"/);
  assert.match(profile, /variant="full"/);
  assert.match(dropdown, /accessibilityRole="menu"/);
  assert.match(dropdown, /accessibilityState=\{\{ selected:/);
  assert.match(dropdown, /onPress=\{close\}/);
  assert.match(dropdown, /useFocusEffect/);
});

