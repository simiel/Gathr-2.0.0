import "react-native-get-random-values";
import { Slot, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "./global.css";
import * as Sentry from "@sentry/react-native";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import { AppAssets } from "@/constants/AppAssets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import { tokenCache } from "@/utils/clerk";

SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: "https://af61dc9a083b6664834f0b848d905fba@o4508658587926528.ingest.de.sentry.io/4508658596511824",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default function RootLayout() {
  const { isReady, error } = useAppBootstrap(AppAssets);

  useEffect(() => {
    if (isReady || error) {
      SplashScreen.hideAsync();
    }
  }, [isReady, error]);

  if (!isReady) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={"pk_live_Y2xlcmsuZ2F0aHIub25saW5lJA"}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mounted) return;

    const checkAuthAndRoute = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");

        if (!isSignedIn) {
          // User is not authenticated
          if (hasLaunched === null) {
            // First launch - show splash screen
            router.replace("/(onboarding)/splash");
            await AsyncStorage.setItem("hasLaunched", "true");
          } else {
            // Not first launch - show get started
            router.replace("/(onboarding)");
          }
        } else {
          // User is authenticated - redirect to main app
          // router.replace("/(main)");
          router.replace("/(user-setup)");
        }
      } catch (error) {
        console.error("Error in auth routing:", error);
        // On error, default to onboarding
        router.replace("/(onboarding)/get-started");
      }
    };

    checkAuthAndRoute();
  }, [isLoaded, mounted]);

  if (!isLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <StatusBar style="dark" />
          <Slot />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
