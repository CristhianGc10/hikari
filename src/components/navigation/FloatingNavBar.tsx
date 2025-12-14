// src/components/navigation/FloatingNavBar.tsx
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, BookOpen, Trophy, User } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { pressScale, releaseScale } from '@/src/core/animations';

const colors = {
  navbar: {
    bg: '#1E2030',
    active: '#F0A55A',
    inactive: '#5D6080',
  },
};

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, screen: 20 };
const radius = { sm: 10, md: 14, lg: 18, xl: 28 };

const NAV_ITEMS = [
  { id: 'home', icon: Home, route: '/' },
  { id: 'learn', icon: BookOpen, route: '/learn' },
  { id: 'achievements', icon: Trophy, route: '/achievements' },
  { id: 'profile', icon: User, route: '/profile' },
];

type FloatingNavBarProps = {
  activeTab?: string;
};

const NavButton = ({
  item,
  isActive,
  onPress
}: {
  item: typeof NAV_ITEMS[0];
  isActive: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const Icon = item.icon;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = pressScale(0.85);
  };

  const handlePressOut = () => {
    scale.value = releaseScale();
  };

  return (
    <Animated.View style={[styles.navItem, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.navButton}
        android_ripple={{ color: 'transparent' }}
      >
        <Icon
          size={25}
          color={isActive ? colors.navbar.active : colors.navbar.inactive}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </Pressable>
    </Animated.View>
  );
};

export const FloatingNavBar = ({ activeTab }: FloatingNavBarProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveTab = () => {
    if (activeTab) return activeTab;

    if (pathname === '/') return 'home';
    if (pathname.startsWith('/achievements')) return 'achievements';
    if (pathname.startsWith('/profile')) return 'profile';
    if (pathname.startsWith('/learn') || pathname.startsWith('/modules')) return 'learn';

    return 'home';
  };

  const currentTab = getActiveTab();

  const handleTabPress = (item: typeof NAV_ITEMS[0]) => {
    router.push(item.route as any);
  };

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <NavButton
              key={item.id}
              item={item}
              isActive={isActive}
              onPress={() => handleTabPress(item)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.lg,
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: colors.navbar.bg,
    borderRadius: radius.lg,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
});
