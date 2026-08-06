import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';

type NotificationBellIconProps = {
  color?: string;
  size?: number;
};

export function NotificationBellIcon({
  color = '#8B5CF6',
  size = 40,
}: NotificationBellIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <G clipPath="url(#notificationBellClip)">
        <Path
          d="M28.4274 20.0457L28.758 19.2294C30.573 14.747 28.5433 9.69564 24.2247 7.94694C19.906 6.19822 14.9337 8.4143 13.1187 12.8967L12.7881 13.7131C12.3914 14.6928 11.7242 15.5374 10.8705 16.1406L8.77851 17.6186C6.86771 18.9686 6.75817 21.8111 8.56291 23.2134C13.2841 26.8821 18.9087 29.1596 24.8522 29.8093C27.1243 30.0577 29.0233 27.9399 28.59 25.6407L28.1158 23.1236C27.9223 22.0964 28.0307 21.0255 28.4274 20.0457Z"
          stroke={color}
          strokeWidth={2}
        />

        <Path
          d="M11.0354 25.5322C10.9743 27.8646 12.4347 30.1446 14.8417 31.1193C17.2488 32.0939 19.8841 31.4723 21.463 29.7546"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </G>

      <Defs>
        <ClipPath id="notificationBellClip">
          <Rect
            width={30}
            height={30}
            fill="#FFFFFF"
            transform="translate(11.2596 0) rotate(22.044)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}
