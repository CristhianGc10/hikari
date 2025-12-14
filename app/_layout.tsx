// app/_layout.tsx

import { ActivityIndicator, View } from 'react-native';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import {
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
    useFonts,
} from '@expo-google-fonts/noto-sans-jp';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/src/design/tokens';

// Tema personalizado
const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: colors.navbar.active,
        background: colors.bg,
        surface: colors.surface,
        onSurface: colors.text.primary,
    },
};

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        NotoSansJP_400Regular,
        NotoSansJP_700Bold,
    });

    if (!fontsLoaded) {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.bg,
                }}
            >
                <ActivityIndicator size="large" color={colors.navbar.active} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
            <PaperProvider theme={theme}>
                <StatusBar style="dark" />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: colors.bg },
                        animation: 'default',
                        gestureEnabled: true,
                        fullScreenGestureEnabled: true,
                    }}
                >
                    <Stack.Screen
                        name="index"
                        options={{
                            animation: 'fade',
                        }}
                    />
                    <Stack.Screen
                        name="levels/[id]"
                        options={{
                            animation: 'slide_from_right',
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen
                        name="learn/index"
                        options={{
                            animation: 'fade',
                        }}
                    />
                    <Stack.Screen
                        name="achievements/index"
                        options={{
                            animation: 'fade',
                        }}
                    />
                    <Stack.Screen
                        name="profile/index"
                        options={{
                            animation: 'fade',
                        }}
                    />
                    <Stack.Screen
                        name="modules/kana/index"
                        options={{
                            animation: 'slide_from_right',
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen
                        name="modules/kana/practice/index"
                        options={{
                            animation: 'slide_from_right',
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen
                        name="modules/vocab/index"
                        options={{
                            animation: 'slide_from_right',
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen
                        name="modules/vocab/category/[id]"
                        options={{
                            animation: 'slide_from_right',
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen
                        name="modules/vocab/practice/[category]"
                        options={{
                            animation: 'slide_from_right',
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen
                        name="modules/vocab/word/[id]"
                        options={{
                            animation: 'slide_from_right',
                            animationTypeForReplace: 'pop',
                        }}
                    />
                    <Stack.Screen
                        name="stats/streak"
                        options={{
                            animation: 'slide_from_bottom',
                            animationTypeForReplace: 'pop',
                        }}
                    />
                </Stack>
            </PaperProvider>
        </GestureHandlerRootView>
    );
}
