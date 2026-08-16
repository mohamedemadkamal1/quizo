import type { ImageSourcePropType } from "react-native";

import type { AvatarId } from "@/types/avatar.types";

export type ProfileAvatarOption = {
  id: AvatarId;
  source: ImageSourcePropType;
  accessibilityLabel: string;
};

// The replacement artwork is exported at 70 x 80: a 70 px circular backdrop
// with up to 10 px of character detail extending above it.
export const PROFILE_AVATAR_ARTWORK_ASPECT_RATIO = 70 / 80;

export const PROFILE_AVATARS: readonly ProfileAvatarOption[] = [
  {
    id: "avatar-1",
    source: require("../assets/images/avatars/avatar-1.png"),
    accessibilityLabel: "Red hoodie avatar",
  },
  {
    id: "avatar-2",
    source: require("../assets/images/avatars/avatar-2.png"),
    accessibilityLabel: "Blue-haired black hoodie avatar",
  },
  {
    id: "avatar-3",
    source: require("../assets/images/avatars/avatar-3.png"),
    accessibilityLabel: "Cream hoodie peace sign avatar",
  },
  {
    id: "avatar-4",
    source: require("../assets/images/avatars/avatar-4.png"),
    accessibilityLabel: "Blonde pink hoodie avatar",
  },
  {
    id: "avatar-5",
    source: require("../assets/images/avatars/avatar-5.png"),
    accessibilityLabel: "Backward cap and headphones avatar",
  },
  {
    id: "avatar-6",
    source: require("../assets/images/avatars/avatar-6.png"),
    accessibilityLabel: "Curly-haired green hoodie avatar",
  },
  {
    id: "avatar-7",
    source: require("../assets/images/avatars/avatar-7.png"),
    accessibilityLabel: "Brunette black hoodie avatar",
  },
  {
    id: "avatar-8",
    source: require("../assets/images/avatars/avatar-8.png"),
    accessibilityLabel: "Navy hoodie crossed-arms avatar",
  },
];

export function getProfileAvatar(
  avatar: AvatarId | null | undefined,
): ProfileAvatarOption | undefined {
  return PROFILE_AVATARS.find((option) => option.id === avatar);
}
