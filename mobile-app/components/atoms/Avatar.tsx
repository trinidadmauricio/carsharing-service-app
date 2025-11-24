/**
 * Avatar Component
 * User profile image with fallback initials
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import { useThemeColors } from '@/theme';
import { textStyles } from '@/theme/typography';
import { borderRadius } from '@/theme/spacing';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: AvatarSize;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  showBorder?: boolean;
  borderColor?: string;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'md',
  style,
  imageStyle,
  showBorder = false,
  borderColor,
  backgroundColor,
}) => {
  const colors = useThemeColors();

  const getSizeValue = (): number => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 48;
      case 'xl':
        return 64;
      case '2xl':
        return 80;
      default:
        return 40;
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'xs':
        return 10;
      case 'sm':
        return 12;
      case 'md':
        return 14;
      case 'lg':
        return 18;
      case 'xl':
        return 24;
      case '2xl':
        return 32;
      default:
        return 14;
    }
  };

  const getInitials = (): string => {
    if (!name) return '?';

    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeValue = getSizeValue();
  const fontSize = getFontSize();
  const initials = getInitials();

  const containerStyle: ViewStyle = {
    width: sizeValue,
    height: sizeValue,
    borderRadius: sizeValue / 2,
    backgroundColor: backgroundColor ?? colors.interactive.primary,
    ...(showBorder && {
      borderWidth: 2,
      borderColor: borderColor ?? colors.background.primary,
    }),
  };

  if (source) {
    return (
      <View style={[styles.container, containerStyle, style]}>
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              width: sizeValue,
              height: sizeValue,
              borderRadius: sizeValue / 2,
            },
            imageStyle,
          ]}
          contentFit="cover"
          transition={200}
          accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, containerStyle, style]}
      accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
      accessibilityRole="image"
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize,
            color: colors.text.inverse,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

// Avatar Group component for showing multiple avatars
interface AvatarGroupProps {
  avatars: Array<{ source?: string; name?: string }>;
  max?: number;
  size?: AvatarSize;
  style?: ViewStyle;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'md',
  style,
}) => {
  const colors = useThemeColors();
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const getSizeValue = (): number => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'md':
        return 40;
      case 'lg':
        return 48;
      case 'xl':
        return 64;
      case '2xl':
        return 80;
      default:
        return 40;
    }
  };

  const sizeValue = getSizeValue();
  const overlap = sizeValue * 0.3;

  return (
    <View style={[styles.groupContainer, style]}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupAvatar,
            { marginLeft: index === 0 ? 0 : -overlap, zIndex: displayAvatars.length - index },
          ]}
        >
          <Avatar
            source={avatar.source}
            name={avatar.name}
            size={size}
            showBorder
          />
        </View>
      ))}
      {remaining > 0 && (
        <View
          style={[
            styles.groupAvatar,
            styles.remainingBadge,
            {
              marginLeft: -overlap,
              width: sizeValue,
              height: sizeValue,
              borderRadius: sizeValue / 2,
              backgroundColor: colors.background.tertiary,
              borderWidth: 2,
              borderColor: colors.background.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.remainingText,
              { color: colors.text.secondary },
            ]}
          >
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  initials: {
    ...textStyles.labelMedium,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    position: 'relative',
  },
  remainingBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  remainingText: {
    ...textStyles.labelSmall,
  },
});
