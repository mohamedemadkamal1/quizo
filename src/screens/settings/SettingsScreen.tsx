import { SettingsContent } from '@/components/settings/SettingsContent';
import { useSettingsScreen } from '@/hooks/settings/useSettingsScreen';

export function SettingsScreen() {
  const screen = useSettingsScreen();

  return <SettingsContent screen={screen} />;
}
