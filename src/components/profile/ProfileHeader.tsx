import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/common/AppText";
import { ProfileIcon } from "@/components/profile/ProfileIcon";
import { colors } from "@/constants/colors";
import {
  getProfileAvatar,
  PROFILE_AVATAR_ARTWORK_ASPECT_RATIO,
} from "@/constants/profile-avatars";
import { useTranslation } from "@/hooks/useTranslation";
import type { ProfileViewModel } from "@/types/profile.types";

type ProfileHeaderProps = {
  profile: ProfileViewModel;
  onEditProfile: () => void;
};

export function ProfileHeader({ profile, onEditProfile }: ProfileHeaderProps) {
  const { t } = useTranslation();
  const isRegistered = profile.mode === "registered";
  const avatar = getProfileAvatar(profile.avatar);

  return (
    <LinearGradient
      colors={[colors.settings.headerStart, colors.settings.headerEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={[styles.badge, isRegistered && styles.registeredBadge]}>
        {isRegistered ? <AppText style={styles.badgeStar}>⭐</AppText> : null}
        <AppText numberOfLines={1} style={styles.badgeText}>
          {isRegistered
            ? t("profile.badgeRegistered")
            : t("profile.badgeGuest")}
        </AppText>
      </View>

      <View style={styles.identityRow}>
        <View
          accessible
          accessibilityLabel={
            avatar
              ? t("profile.avatarLabel", {
                  name: profile.displayName,
                  avatar: t(avatar.accessibilityLabelKey),
                })
              : t("profile.initialsLabel", { name: profile.displayName })
          }
          style={[styles.avatar, avatar && styles.avatarWithArtwork]}
        >
          <View
            style={[styles.avatarClip, avatar && styles.avatarArtworkContainer]}
          >
            {avatar ? (
              <Image
                resizeMode="contain"
                source={avatar.source}
                style={styles.avatarImage}
              />
            ) : (
              <AppText style={styles.initials}>{profile.initials}</AppText>
            )}
          </View>
        </View>

        <View style={styles.nameColumn}>
          <View style={styles.nameRow}>
            {/* The player's own name is content and is never translated. */}
            <AppText
              accessibilityRole="header"
              numberOfLines={1}
              style={styles.name}
            >
              {profile.displayName}
            </AppText>

            {isRegistered ? (
              <Pressable
                accessibilityLabel={t("profile.editLabel")}
                accessibilityRole="button"
                hitSlop={12}
                onPress={onEditProfile}
                style={styles.editButton}
              >
                <ProfileIcon name="edit" color="#FFFFFF" size={20} />
              </Pressable>
            ) : null}
          </View>
          <View style={styles.nameUnderline} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 144,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 18,
    paddingTop: 20,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  badge: {
    position: "absolute",
    top: 19,
    end: 34,
    maxWidth: 160,
    minWidth: 64,
    height: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  registeredBadge: {
    paddingStart: 12,
    paddingEnd: 10,
  },
  badgeStar: {
    fontSize: 14,
    lineHeight: 17,
  },
  badgeText: {
    color: "#FFFFFF",
    fontFamily: "Nunito",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 15,
  },
  identityRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingTop: 21,
    transform: [{ translateY: -12 }],
  },
  avatar: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#321079",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarWithArtwork: {
    height: 80,
    borderRadius: 0,
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  avatarClip: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  avatarArtworkContainer: {
    overflow: "visible",
    borderRadius: 0,
    backgroundColor: "transparent",
  },
  avatarImage: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 70,
    height: 70 / PROFILE_AVATAR_ARTWORK_ASPECT_RATIO,
  },
  initials: {
    color: "#FFFFFF",
    fontFamily: "Fredoka",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 26,
  },
  nameColumn: {
    minWidth: 0,
    maxWidth: 190,
    flex: 1,
    paddingTop: 8,
  },
  nameRow: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  name: {
    minWidth: 0,
    flexShrink: 1,
    color: "#FFFFFF",
    fontFamily: "Fredoka",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 23,
  },
  editButton: {
    width: 28,
    height: 28,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  nameUnderline: {
    width: "100%",
    height: 1.5,
    marginTop: 5,
    backgroundColor: "rgba(255, 255, 255, 0.34)",
  },
});
