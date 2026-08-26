import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const workspace = process.cwd();

test('all guest and authenticated Support entries use the shared modal', async () => {
  const [authButton, profileActions, profileContent, rootLayout] =
    await Promise.all([
      readFile(
        path.join(workspace, 'src/components/auth/AuthSupportButton.tsx'),
        'utf8',
      ),
      readFile(
        path.join(workspace, 'src/components/profile/ProfileActions.tsx'),
        'utf8',
      ),
      readFile(
        path.join(workspace, 'src/components/profile/ProfileContent.tsx'),
        'utf8',
      ),
      readFile(path.join(workspace, 'app/_layout.tsx'), 'utf8'),
    ]);

  assert.match(authButton, /useSupportModal\(\)/);
  assert.match(authButton, /onPress=\{openSupportModal\}/);
  assert.match(profileActions, /function SupportAction\(\)/);
  assert.match(profileActions, /onPress=\{openSupportModal\}/);
  assert.match(profileActions, /function RegisteredProfileActions/);
  assert.match(profileActions, /<SupportAction \/>/);
  assert.match(profileContent, /<SupportAction \/>/);
  assert.match(rootLayout, /<SupportModalProvider>/);
});

test('support uses the shared API client and never opens an email application', async () => {
  const [service, sourceFiles] = await Promise.all([
    readFile(
      path.join(workspace, 'src/services/support.service.ts'),
      'utf8',
    ),
    Promise.all(
      [
        'src/components/auth/AuthSupportButton.tsx',
        'src/components/profile/ProfileActions.tsx',
        'src/hooks/useExternalLinks.ts',
        'src/utils/external-links.ts',
      ].map((file) => readFile(path.join(workspace, file), 'utf8')),
    ),
  ]);

  assert.match(service, /apiClient\.post\('\/support'/);
  assert.doesNotMatch(sourceFiles.join('\n'), /mailto:|openSupportEmail/);
});
