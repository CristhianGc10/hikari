import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// COLORES
export const colors = {
    bg: '#151621',
    surface: '#1E2030',
    surfaceLight: '#262940',

    text: {
        primary: '#FFFFFF',
        secondary: '#8F92A8',
        tertiary: '#5D6080',
    },

    levels: {
        n5: { primary: '#F0A55A', light: 'rgba(240, 165, 90, 0.12)' },
        n4: { primary: '#5AC78B', light: 'rgba(90, 199, 139, 0.12)' },
        n3: { primary: '#E86B8A', light: 'rgba(232, 107, 138, 0.12)' },
        n2: { primary: '#5A9FE8', light: 'rgba(90, 159, 232, 0.12)' },
        n1: { primary: '#A87DE8', light: 'rgba(168, 125, 232, 0.12)' },
    },

    navbar: {
        bg: '#1E2030',
        active: '#F0A55A',
        inactive: '#5D6080',
    },

    streak: '#F07A5A',
};

// TIPOGRAFÍA
export const typography = {
    family: {
        regular: 'NotoSansJP_400Regular',
        bold: 'NotoSansJP_700Bold',
    },

    size: {
        xs: 10,
        sm: 11,
        md: 12,
        base: 13,
        lg: 14,
        xl: 16,
        xxl: 18,
        title: 26,
        display: 28,
        hero: 38,
        giant: 52,
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
    },
};

// ESPACIADO
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    screen: 20,
};

// BORDES
export const radius = {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 28,
    full: 9999,
};

// LAYOUT
export const layout = {
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    contentWidth: SCREEN_WIDTH - spacing.screen * 2,

    get twoColumnGap() {
        return spacing.md;
    },
    get twoColumnWidth() {
        return (this.contentWidth - this.twoColumnGap) / 2;
    },
};

// ANIMACIONES
export const animation = {
    duration: {
        fast: 150,
        normal: 250,
        slow: 400,
    },

    spring: {
        snappy: { damping: 15, stiffness: 180 },
        smooth: { damping: 20, stiffness: 120 },
    },
};

// HELPERS
export const getLevelColors = (level: 'n5' | 'n4' | 'n3' | 'n2' | 'n1') => {
    return colors.levels[level];
};

// EXPORT DEFAULT
const tokens = {
    colors,
    typography,
    spacing,
    radius,
    layout,
    animation,
    getLevelColors,
};

export default tokens;
