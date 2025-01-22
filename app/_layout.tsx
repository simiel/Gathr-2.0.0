import { Slot, Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "./global.css";

import * as Sentry from "@sentry/react-native";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import { AppAssets } from "@/constants/AppAssets";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: "https://af61dc9a083b6664834f0b848d905fba@o4508658587926528.ingest.de.sentry.io/4508658596511824",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default function RootLayout() {
  const { isReady, error } = useAppBootstrap(AppAssets);
  const router = useRouter();

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        router.replace("/(onboarding)/onboarding");
        console.log("first launch");
        await AsyncStorage.setItem("hasLaunched", "true");
      } else {
        router.replace("/(auth)");
        console.log("not first launch");
      }
    } catch (error) {
      console.error("Error checking first launch:", error);
    }
  };

  useEffect(() => {
    if (isReady || error) {
      SplashScreen.hideAsync();
      checkFirstLaunch();
    }
  }, [isReady, error]);

  if (!isReady) {
    return null;
  }

  return <Slot />;
}
