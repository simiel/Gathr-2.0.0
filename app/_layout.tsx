import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "./global.css";

import * as Sentry from "@sentry/react-native";
import CustomSplash from "@/components/onboarding/GathrSplash";
import { useAppBootstrap } from "@/hooks/useAppBootstrap";
import { AppAssets } from "@/constants/AppAssets";
import { View } from "react-native";

Sentry.init({
  dsn: "https://af61dc9a083b6664834f0b848d905fba@o4508658587926528.ingest.de.sentry.io/4508658596511824",

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const { isReady, error } = useAppBootstrap(AppAssets);
  const router = useRouter();

  // useEffect(() => {
  //   if (isReady) {
  //     // Hide splash screen when everything is ready
  //     SplashScreen.hideAsync();
  //   }
  // }, [isReady]);

  // SplashScreen.hideAsync();
  if (true) {
    return (
      <CustomSplash
        onAnimationComplete={() => {
          // router.replace("/saitama");
        }}
      />
    );
  }

  if (false) {
    return (
      // TODO
      // <ErrorScreen
      //   message="Failed to load app resources"
      //   error={error}
      // />
      null
    );
  }

  // start the main App
  return <View></View>;
}
