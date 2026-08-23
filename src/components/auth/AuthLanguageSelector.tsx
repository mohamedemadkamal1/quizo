import { useCallback, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { useLanguageSelection } from '@/hooks/useLanguageSelection';
import { useTranslation } from '@/hooks/useTranslation';
import type { AppLanguage } from '@/i18n';

const CONTROL_HEIGHT = 44;
const MENU_WIDTH = 116;
const MENU_GAP = 8;
const SCREEN_MARGIN = 12;

type TriggerFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
  const { isRTL, directionStyle } = useLanguageDirection();
  const { choices, selectLanguage } = useLanguageSelection();
  const { width: windowWidth } = useWindowDimensions();
  const triggerRef = useRef<View>(null);
  const [triggerFrame, setTriggerFrame] = useState<TriggerFrame | null>(null);

  const open = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerFrame({ x, y, width, height });
    });
  }, []);

  const close = useCallback(() => {
    setTriggerFrame(null);
  }, []);

  const handleSelect = useCallback(
    (language: AppLanguage) => {
      // Closing first keeps the picked option from flashing behind a reload.
      close();
      void selectLanguage(language);
    },
    [close, selectLanguage],
  );

  const isOpen = triggerFrame !== null;
  // The menu hangs from the control's logical end edge, measured in physical
  // window coordinates so it lands correctly in both writing directions.
  const menuLeft = triggerFrame
    ? Math.min(
        Math.max(
          isRTL
            ? triggerFrame.x
            : triggerFrame.x + triggerFrame.width - MENU_WIDTH,
          SCREEN_MARGIN,
        ),
        windowWidth - MENU_WIDTH - SCREEN_MARGIN,
      )
    : 0;

  return (
    <>
      <Pressable
        ref={triggerRef}
        accessibilityHint={t('language.selectorHint')}
        accessibilityLabel={t('language.selectorLabel')}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        hitSlop={8}
        onPress={open}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <GlobeIcon color={colors.languageSelector.icon} size={22} />
        <ChevronDownIcon color={colors.languageSelector.icon} size={16} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={close}
        statusBarTranslucent
        transparent
        visible={isOpen}
      >
        <View style={[styles.overlay, directionStyle]}>
          <Pressable
            accessibilityLabel={t('common.close')}
            accessibilityRole="button"
            onPress={close}
            style={StyleSheet.absoluteFill}
          />

          {triggerFrame ? (
            <View
              accessibilityRole="menu"
              accessibilityViewIsModal
              style={[
                styles.menu,
                {
                  top: triggerFrame.y + triggerFrame.height + MENU_GAP,
                  left: menuLeft,
                },
              ]}
            >
              {choices.map((choice) => (
                <Pressable
                  accessibilityLabel={choice.compactLabel}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: choice.isSelected }}
                  key={choice.language}
                  onPress={() => handleSelect(choice.language)}
                  style={({ pressed }) => [
                    styles.option,
                    choice.isSelected && styles.optionSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <AppText
                    numberOfLines={1}
                    style={[
                      styles.optionLabel,
                      choice.isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {choice.compactLabel}
                  </AppText>

                  {choice.isSelected ? (
                    <AppText accessible={false} style={styles.optionCheck}>
                      ✓
                    </AppText>
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </Modal>
    </>
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

  pressed: {
    opacity: 0.85,
  },

  overlay: {
    flex: 1,
  },

  menu: {
    position: 'absolute',
    width: MENU_WIDTH,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.languageSelector.menuBorder,
    borderRadius: 16,
    padding: 6,
    backgroundColor: colors.languageSelector.menuSurface,
    shadowColor: '#1E1A4D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
  },

  option: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  optionSelected: {
    backgroundColor: colors.languageSelector.optionSelected,
  },

  optionLabel: {
    minWidth: 0,
    flexShrink: 1,
    color: colors.languageSelector.optionText,
    fontFamily: 'Fredoka',
    fontSize: 15,
    fontWeight: '500',
    includeFontPadding: false,
  },

  optionLabelSelected: {
    color: colors.languageSelector.optionSelectedText,
    fontWeight: '600',
  },

  optionCheck: {
    flexShrink: 0,
    color: colors.languageSelector.optionSelectedText,
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '700',
    includeFontPadding: false,
  },
});
