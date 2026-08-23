import type { ImageSourcePropType } from "react-native";

import type { TranslationKey } from "@/i18n";
import type { AvatarId } from "@/types/avatar.types";

export type ProfileAvatarOption = {
  id: AvatarId;
  source: ImageSourcePropType;
  /** Translation key for the artwork's accessibility description. */
  accessibilityLabelKey: TranslationKey;
};

// The replacement artwork is exported at 70 x 80: a 70 px circular backdrop
// with up to 10 px of character detail extending above it.
export const PROFILE_AVATAR_ARTWORK_ASPECT_RATIO = 70 / 80;

export const PROFILE_AVATARS: readonly ProfileAvatarOption[] = [
  {
    id: "avatar-1",
    source: require("../assets/images/avatars/avatar-1.png"),
    accessibilityLabelKey: "avatars.avatar-1",
  },
  {
    id: "avatar-2",
    source: require("../assets/images/avatars/avatar-2.png"),
    accessibilityLabelKey: "avatars.avatar-2",
  },
  {
    id: "avatar-3",
    source: require("../assets/images/avatars/avatar-3.png"),
    accessibilityLabelKey: "avatars.avatar-3",
  },
  {
    id: "avatar-4",
    source: require("../assets/images/avatars/avatar-4.png"),
    accessibilityLabelKey: "avatars.avatar-4",
  },
  {
    id: "avatar-5",
    source: require("../assets/images/avatars/avatar-5.png"),
    accessibilityLabelKey: "avatars.avatar-5",
  },
  {
    id: "avatar-6",
    source: require("../assets/images/avatars/avatar-6.png"),
    accessibilityLabelKey: "avatars.avatar-6",
  },
  {
    id: "avatar-7",
    source: require("../assets/images/avatars/avatar-7.png"),
    accessibilityLabelKey: "avatars.avatar-7",
  },
  {
    id: "avatar-8",
    source: require("../assets/images/avatars/avatar-8.png"),
    accessibilityLabelKey: "avatars.avatar-8",
  },
];

export function getProfileAvatar(
  avatar: AvatarId | null | undefined,
): ProfileAvatarOption | undefined {
  return PROFILE_AVATARS.find((option) => option.id === avatar);
}
