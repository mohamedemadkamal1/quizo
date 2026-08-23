import { useFocusEffect } from 'expo-router';
import {
  type RefObject,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { colors } from '@/constants/colors';
import { useLanguageDirection } from '@/hooks/useLanguageDirection';
import { useLanguageSelection } from '@/hooks/useLanguageSelection';
import { useTranslation } from '@/hooks/useTranslation';
import type { AppLanguage } from '@/i18n';

const SCREEN_MARGIN = 12;
const MENU_GAP = 6;
const COMPACT_MENU_WIDTH = 126;
const COMPACT_ROW_HEIGHT = 50;
const FULL_ROW_HEIGHT = 58;

type TriggerFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LanguageDropdownTriggerProps = {
  triggerRef: RefObject<View | null>;
  isOpen: boolean;
  open: () => void;
};

type LanguageDropdownProps = {
  variant: 'compact' | 'full';
  renderTrigger: (props: LanguageDropdownTriggerProps) => ReactNode;
};

let activeDropdown: { id: symbol; close: () => void } | null = null;

/**
 * Shared language menu used by Welcome and Profile.
 *
 * The menu lives in a transparent native modal, so rounded heroes, ScrollViews
 * and parent Pressables cannot clip it. The modal also supplies Android-back
 * handling and a reliable full-screen outside-press target.
 */
export function LanguageDropdown({
  variant,
  renderTrigger,
}: LanguageDropdownProps) {
  const { t } = useTranslation();
  const { directionStyle, isRTL } = useLanguageDirection();
  const { choices, selectLanguage } = useLanguageSelection();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const triggerRef = useRef<View>(null);
  const dropdownIdRef = useRef(Symbol('language-dropdown'));
  const [triggerFrame, setTriggerFrame] = useState<TriggerFrame | null>(null);
  const selectingRef = useRef(false);

  const close = useCallback(() => {
    setTriggerFrame(null);

    if (activeDropdown?.id === dropdownIdRef.current) {
      activeDropdown = null;
    }
  }, []);

  const open = useCallback(() => {
    if (selectingRef.current) {
      return;
    }

    triggerRef.current?.measureInWindow((x, y, width, height) => {
      activeDropdown?.close();
      activeDropdown = { id: dropdownIdRef.current, close };
      setTriggerFrame({ x, y, width, height });
    });
  }, [close]);

  useFocusEffect(
    useCallback(() => {
      return close;
    }, [close]),
  );

  useEffect(() => {
    return close;
  }, [close]);

  const handleSelect = useCallback(
    async (language: AppLanguage) => {
      if (selectingRef.current) {
        return;
      }

      selectingRef.current = true;
      close();

      try {
        await selectLanguage(language);
      } finally {
        selectingRef.current = false;
      }
    },
    [close, selectLanguage],
  );

  const isOpen = triggerFrame !== null;
  const menuWidth = triggerFrame
    ? variant === 'compact'
      ? COMPACT_MENU_WIDTH
      : Math.min(triggerFrame.width, windowWidth - SCREEN_MARGIN * 2)
    : 0;
  const menuHeight =
    choices.length *
      (variant === 'compact' ? COMPACT_ROW_HEIGHT : FULL_ROW_HEIGHT) +
    2;
  const menuLeft = triggerFrame
    ? Math.min(
        Math.max(
          variant === 'compact'
            ? isRTL
              ? triggerFrame.x
              : triggerFrame.x + triggerFrame.width - menuWidth
            : triggerFrame.x,
          SCREEN_MARGIN,
        ),
        windowWidth - menuWidth - SCREEN_MARGIN,
      )
    : 0;
  const menuTop = triggerFrame
    ? triggerFrame.y + triggerFrame.height + MENU_GAP + menuHeight <=
      windowHeight - insets.bottom - SCREEN_MARGIN
      ? triggerFrame.y + triggerFrame.height + MENU_GAP
      : Math.max(
          insets.top + SCREEN_MARGIN,
          triggerFrame.y - menuHeight - MENU_GAP,
        )
    : 0;

  return (
    <>
      {renderTrigger({ triggerRef, isOpen, open })}

      <Modal
        animationType="fade"
        navigationBarTranslucent
        onRequestClose={close}
        presentationStyle="overFullScreen"
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
                variant === 'compact' ? styles.compactMenu : styles.fullMenu,
                { left: menuLeft, top: menuTop, width: menuWidth },
              ]}
            >
              {choices.map((choice, index) => {
                const label =
                  variant === 'compact'
                    ? choice.compactLabel
                    : choice.fullLabel;

                return (
                  <Pressable
                    accessibilityLabel={label}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: choice.isSelected }}
                    android_ripple={{ color: 'rgba(124, 58, 237, 0.1)' }}
                    key={choice.language}
                    onPress={() => void handleSelect(choice.language)}
                    style={[
                      styles.option,
                      variant === 'compact'
                        ? styles.compactOption
                        : styles.fullOption,
                      index < choices.length - 1 && styles.optionSeparator,
                      choice.isSelected && styles.optionSelected,
                    ]}
                  >
                    <View style={styles.optionCopy}>
                      <AppText ltrContent style={styles.flag}>
                        {choice.flag}
                      </AppText>
                      <AppText
                        ltrContent={variant === 'compact'}
                        numberOfLines={1}
                        style={[
                          styles.optionLabel,
                          variant === 'compact'
                            ? styles.compactOptionLabel
                            : styles.fullOptionLabel,
                          choice.isSelected && styles.optionLabelSelected,
                        ]}
                      >
                        {variant === 'compact' ? choice.shortCode : label}
                      </AppText>
                    </View>

                    {choice.isSelected ? (
                      <AppText
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                        style={styles.optionCheck}
                      >
                        ✓
                      </AppText>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C9D6FF',
    backgroundColor: colors.languageSelector.menuSurface,
    shadowColor: '#1E1A4D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 12,
  },
  compactMenu: {
    borderRadius: 16,
  },
  fullMenu: {
    borderRadius: 18,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  compactOption: {
    minHeight: COMPACT_ROW_HEIGHT,
    paddingHorizontal: 14,
  },
  fullOption: {
    minHeight: FULL_ROW_HEIGHT,
    paddingHorizontal: 22,
  },
  optionSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#B8CAFF',
  },
  optionSelected: {
    backgroundColor: colors.languageSelector.optionSelected,
  },
  optionCopy: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  flag: {
    flexShrink: 0,
    fontSize: 17,
    lineHeight: 22,
  },
  optionLabel: {
    minWidth: 0,
    flexShrink: 1,
    color: '#5E5E66',
    fontWeight: '500',
    includeFontPadding: false,
  },
  compactOptionLabel: {
    fontFamily: 'Nunito',
    fontSize: 16,
    lineHeight: 21,
  },
  fullOptionLabel: {
    fontFamily: 'Nunito',
    fontSize: 18,
    lineHeight: 25,
  },
  optionLabelSelected: {
    color: colors.languageSelector.optionSelectedText,
    fontWeight: '600',
  },
  optionCheck: {
    flexShrink: 0,
    marginStart: 6,
    color: colors.languageSelector.optionSelectedText,
    fontFamily: 'Nunito',
    fontSize: 15,
    fontWeight: '700',
    includeFontPadding: false,
  },
});
