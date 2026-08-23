import { Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import { LanguageDropdown } from '@/components/common/LanguageDropdown';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

const CONTROL_HEIGHT = 44;

function GlobeIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <Circle cx="12" cy="12" r="8.4" stroke={color} strokeWidth={1.8} />
      <Path
        d="M3.6 12h16.8M12 3.6c2.2 2.3 3.4 5.3 3.4 8.4S14.2 18.1 12 20.4C9.8 18.1 8.6 15.1 8.6 12S9.8 5.9 12 3.6Z"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.8}
      />
    </Svg>
  );
}

function ChevronDownIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <Polyline
        points="6 9.5 12 15.5 18 9.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.2}
      />
    </Svg>
  );
}

/**
 * The rounded lavender globe control shown on the Welcome screen.
 *
 * It renders its menu inside a `Modal` so an outside press and the Android
 * back button both close it, and so the two options are never clipped by the
 * hero's rounded, overflow-hidden frame.
 */
export function AuthLanguageSelector() {
  const { t } = useTranslation();

  return (
    <LanguageDropdown
      renderTrigger={({ triggerRef, isOpen, open }) => (
        <Pressable
          ref={triggerRef}
          accessibilityHint={t('language.selectorHint')}
          accessibilityLabel={t('language.selectorLabel')}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
          android_ripple={{ color: 'rgba(124, 58, 237, 0.12)' }}
          hitSlop={8}
          onPress={open}
          style={styles.trigger}
        >
          <GlobeIcon color={colors.languageSelector.icon} size={22} />
          <ChevronDownIcon color={colors.languageSelector.icon} size={16} />
        </Pressable>
      )}
      variant="compact"
    />
  );
}

const styles = StyleSheet.create({
  trigger: {
    minWidth: 62,
    height: CONTROL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.languageSelector.border,
    borderRadius: CONTROL_HEIGHT / 2,
    paddingHorizontal: 12,
    backgroundColor: colors.languageSelector.surface,
    shadowColor: '#4C1D95',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },

});
