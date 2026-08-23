import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/common/AppText";
import { AppTextInput } from "@/components/common/AppTextInput";
import {
  PROFILE_AVATAR_ARTWORK_ASPECT_RATIO,
  PROFILE_AVATARS,
} from "@/constants/profile-avatars";
import { useLanguageDirection } from "@/hooks/useLanguageDirection";
import { useTranslation } from "@/hooks/useTranslation";
import {
  createEditProfileSchema,
  type EditProfileFormValues,
} from "@/schemas/profile.schemas";
import { isAvatarId, type AvatarId } from "@/types/avatar.types";

type EditProfileModalProps = {
  visible: boolean;
  currentUsername: string;
  currentAvatar: AvatarId | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onDismiss: () => void;
  onSubmit: (username: string, avatar: AvatarId) => Promise<boolean>;
};

export function EditProfileModal({
  visible,
  currentUsername,
  currentAvatar,
  isSubmitting,
  errorMessage,
  onDismiss,
  onSubmit,
}: EditProfileModalProps) {
  const { t } = useTranslation();
  const { directionStyle } = useLanguageDirection();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const modalWidth = Math.min(360, windowWidth - 48);
  const horizontalScale = modalWidth / 360;
  const verticalScale = Math.max(0.9, horizontalScale);
  const modalHeight = Math.min(
    Math.round(524 * verticalScale),
    windowHeight - 32,
  );
  const gridGap = Math.max(6, Math.round(8 * horizontalScale));
  const gridInset = Math.max(18, Math.round(28 * horizontalScale));
  const avatarSize = Math.floor((modalWidth - gridInset * 2 - gridGap * 3) / 4);
  const inputWidth = Math.min(
    modalWidth - 32,
    Math.round(304 * horizontalScale),
  );
  const actionWidth = Math.min(
    modalWidth - 32,
    Math.round(312 * horizontalScale),
  );

  const schema = useMemo(() => createEditProfileSchema(t), [t]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      username: currentUsername,
      avatar: currentAvatar,
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        username: currentUsername,
        avatar: currentAvatar,
      });
    }
  }, [currentAvatar, currentUsername, reset, visible]);

  const username = useWatch({ control, name: "username" });
  const selectedAvatar = useWatch({ control, name: "avatar" });
  const normalizedUsername = username.trim();
  const isValid = schema.safeParse({
    username,
    avatar: selectedAvatar,
  }).success;
  const isUnchanged =
    normalizedUsername === currentUsername.trim() &&
    selectedAvatar === currentAvatar;
  const displayedError =
    errors.username?.message ?? errors.avatar?.message ?? errorMessage;

  const submit = handleSubmit(async (values) => {
    if (!isAvatarId(values.avatar)) {
      return;
    }

    const wasSuccessful = await onSubmit(values.username.trim(), values.avatar);

    if (wasSuccessful) {
      reset({
        username: values.username.trim(),
        avatar: values.avatar,
      });
    }
  });

  const dismiss = () => {
    if (!isSubmitting) {
      onDismiss();
    }
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={dismiss}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <SafeAreaView style={[styles.backdrop, directionStyle]}>
        <Pressable
          accessible={false}
          disabled={isSubmitting}
          onPress={dismiss}
          style={styles.dismissArea}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            pointerEvents="box-none"
            style={styles.keyboardView}
          >
            <ScrollView
              bounces={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              pointerEvents="box-none"
              showsVerticalScrollIndicator={false}
            >
              <Pressable
                accessible={false}
                onPress={(event) => event.stopPropagation()}
                style={[
                  styles.shadowContainer,
                  {
                    width: modalWidth,
                    minHeight: modalHeight,
                    borderRadius: Math.round(30 * verticalScale),
                  },
                ]}
              >
                <LinearGradient
                  accessibilityLabel={t('profile.editModal.dialogLabel')}
                  accessibilityViewIsModal
                  colors={["#FFFFFF", "#FAF9FF", "#F1EDFF"]}
                  end={{ x: 0.5, y: 1 }}
                  locations={[0, 0.58, 1]}
                  start={{ x: 0.5, y: 0 }}
                  style={[
                    styles.surface,
                    {
                      minHeight: modalHeight,
                      borderRadius: Math.round(30 * verticalScale),
                      paddingTop: Math.round(12 * verticalScale),
                      paddingBottom: Math.round(23 * verticalScale),
                    },
                  ]}
                >
                  <View
                    pointerEvents="none"
                    style={[
                      styles.dragHandle,
                      {
                        width: Math.round(48 * verticalScale),
                        height: Math.max(4, Math.round(5 * verticalScale)),
                      },
                    ]}
                  />

                  <AppText
                    accessibilityRole="header"
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                    numberOfLines={1}
                    style={[
                      styles.heading,
                      {
                        marginTop: Math.round(29 * verticalScale),
                        fontSize: Math.round(24 * verticalScale),
                        lineHeight: Math.round(29 * verticalScale),
                      },
                    ]}
                  >
                    {t('profile.editModal.heading')}
                  </AppText>

                  <AppText
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                    numberOfLines={1}
                    style={[
                      styles.subtitle,
                      {
                        width: modalWidth - Math.round(32 * horizontalScale),
                        marginTop: Math.max(3, Math.round(5 * verticalScale)),
                        fontSize: Math.max(14, Math.round(15 * verticalScale)),
                        lineHeight: Math.round(20 * verticalScale),
                      },
                    ]}
                  >
                    {t('profile.editModal.subtitle')}
                  </AppText>

                  <Controller
                    control={control}
                    name="avatar"
                    render={({ field: { onChange, value } }) => (
                      <View
                        accessibilityRole="radiogroup"
                        style={[
                          styles.avatarGrid,
                          {
                            width: modalWidth - gridInset * 2,
                            columnGap: gridGap,
                            rowGap: Math.round(19 * verticalScale),
                            marginTop: Math.round(22 * verticalScale),
                          },
                        ]}
                      >
                        {PROFILE_AVATARS.map((option) => {
                          const isSelected = value === option.id;

                          return (
                            <Pressable
                              key={option.id}
                              accessibilityLabel={t(
                                option.accessibilityLabelKey,
                              )}
                              accessibilityRole="radio"
                              accessibilityState={{
                                checked: isSelected,
                                disabled: isSubmitting,
                                selected: isSelected,
                              }}
                              disabled={isSubmitting}
                              onPress={() => onChange(option.id)}
                              style={({ pressed }) => [
                                styles.avatarOption,
                                { width: avatarSize, height: avatarSize },
                                pressed && styles.avatarOptionPressed,
                              ]}
                            >
                              <View
                                style={[
                                  styles.avatarCircle,
                                  {
                                    width: avatarSize,
                                    height: avatarSize,
                                  },
                                ]}
                              >
                                <Image
                                  resizeMode="contain"
                                  source={option.source}
                                  style={[
                                    styles.avatarImage,
                                    {
                                      width: avatarSize,
                                      height:
                                        avatarSize /
                                        PROFILE_AVATAR_ARTWORK_ASPECT_RATIO,
                                    },
                                  ]}
                                />
                              </View>

                              {isSelected ? (
                                <View style={styles.selectedBadge}>
                                  <AppText style={styles.selectedCheck}>
                                    ✓
                                  </AppText>
                                </View>
                              ) : null}
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
                  />

                  <AppText
                    numberOfLines={1}
                    style={[
                      styles.nicknameLabel,
                      {
                        marginTop: Math.round(34 * verticalScale),
                        fontSize: Math.round(18 * verticalScale),
                        lineHeight: Math.round(23 * verticalScale),
                      },
                    ]}
                  >
                    {t('profile.editModal.nicknameLabel')}
                  </AppText>

                  <Controller
                    control={control}
                    name="username"
                    render={({ field: { onBlur, onChange, value } }) => (
                      <AppTextInput
                        accessibilityLabel={t(
                          'profile.editModal.nicknameFieldLabel',
                        )}
                        autoCapitalize="words"
                        autoCorrect={false}
                        editable={!isSubmitting}
                        maxLength={200}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder={t('auth.fields.nickname')}
                        placeholderTextColor="#94A3B8"
                        returnKeyType="done"
                        style={[
                          styles.nicknameInput,
                          {
                            width: inputWidth,
                            height: Math.round(48 * verticalScale),
                            marginTop: Math.round(10 * verticalScale),
                            borderRadius: Math.round(16 * verticalScale),
                          },
                          errors.username && styles.nicknameInputError,
                          isSubmitting && styles.disabledControl,
                        ]}
                        value={value}
                      />
                    )}
                  />

                  {displayedError ? (
                    <AppText
                      accessibilityLiveRegion="polite"
                      accessibilityRole="alert"
                      style={[styles.errorMessage, { width: inputWidth }]}
                    >
                      {displayedError}
                    </AppText>
                  ) : null}

                  <View
                    style={[
                      styles.divider,
                      {
                        width: actionWidth,
                        marginTop: displayedError
                          ? Math.round(10 * verticalScale)
                          : Math.round(22 * verticalScale),
                      },
                    ]}
                  />

                  <Pressable
                    accessibilityLabel={t('profile.editModal.confirmLabel')}
                    accessibilityRole="button"
                    accessibilityState={{
                      busy: isSubmitting,
                      disabled: !isValid || isUnchanged || isSubmitting,
                    }}
                    disabled={!isValid || isUnchanged || isSubmitting}
                    onPress={submit}
                    style={[
                      styles.confirmButton,
                      {
                        width: actionWidth,
                        height: Math.round(54 * verticalScale),
                        marginTop: Math.round(24 * verticalScale),
                        borderRadius: Math.round(17 * verticalScale),
                      },
                      (!isValid || isUnchanged || isSubmitting) &&
                        styles.disabledButton,
                    ]}
                  >
                    <LinearGradient
                      colors={["#8354F5", "#A586F5"]}
                      end={{ x: 1, y: 0.5 }}
                      start={{ x: 0, y: 0.5 }}
                      style={[
                        StyleSheet.absoluteFill,
                        { borderRadius: Math.round(17 * verticalScale) },
                      ]}
                    />

                    {isSubmitting ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <AppText
                        adjustsFontSizeToFit
                        minimumFontScale={0.75}
                        numberOfLines={1}
                        style={[
                          styles.confirmLabel,
                          {
                            fontSize: Math.round(19 * verticalScale),
                            lineHeight: Math.round(24 * verticalScale),
                          },
                        ]}
                      >
                        {t('profile.editModal.confirm')}
                      </AppText>
                    )}
                  </Pressable>
                </LinearGradient>
              </Pressable>
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(30, 26, 77, 0.55)",
  },
  dismissArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  shadowContainer: {
    shadowColor: "#4C3A86",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 12,
  },
  surface: {
    alignItems: "center",
    overflow: "hidden",
  },
  dragHandle: {
    flexShrink: 0,
    alignSelf: "center",
    borderRadius: 999,
    backgroundColor: "#D8DDEA",
  },
  heading: {
    color: "#1E1A4D",
    fontFamily: "Fredoka",
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    fontFamily: "Nunito",
    fontWeight: "500",
    textAlign: "center",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  avatarOption: {
    zIndex: 1,
    flexShrink: 0,
  },
  avatarOptionPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.97 }],
  },
  avatarCircle: {
    overflow: "visible",
  },
  avatarImage: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  selectedBadge: {
    position: "absolute",
    zIndex: 5,
    end: -4,
    bottom: -4,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 13,
    backgroundColor: "#8B5CF6",
  },
  selectedCheck: {
    color: "#FFFFFF",
    fontFamily: "Nunito",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 19,
  },
  nicknameLabel: {
    color: "#1E1A4D",
    fontFamily: "Fredoka",
    fontWeight: "600",
    textAlign: "center",
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: "#A78BFA",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    color: "#475569",
    fontFamily: "Nunito",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    textAlignVertical: "center",
  },
  nicknameInputError: {
    borderColor: "#EF4444",
  },
  disabledControl: {
    opacity: 0.6,
  },
  errorMessage: {
    marginTop: 5,
    color: "#EF4444",
    fontFamily: "Nunito",
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#E6E0FA",
  },
  confirmButton: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 7,
  },
  disabledButton: {
    opacity: 0.45,
  },
  confirmLabel: {
    color: "#FFFFFF",
    fontFamily: "Fredoka",
    fontWeight: "600",
    textAlign: "center",
  },
});
