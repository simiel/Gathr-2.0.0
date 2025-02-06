import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestPermissions } from "@/utils/permissions";

interface BootstrapState {
  isLoaded: boolean;
  error: Error | null;
}

interface BootstrapAssets {
  fonts?: Record<string, any>;
  // Add other asset types as needed
  // images?: Record<string, any>;
  // database?: any;
}

export function useAppBootstrap(assets: BootstrapAssets) {
  const [state, setState] = useState<BootstrapState>({
    isLoaded: false,
    error: null,
  });

  // Font loading
  const [fontsLoaded] = useFonts(assets.fonts || {});

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        // Add any async initialization here
        await initializeAsyncStorage();
        await requestPermissions();

        setTimeout(() => {
          setState({ isLoaded: true, error: null });
          SplashScreen.hideAsync();
        }, 1000);
      } catch (error) {
        setState({ isLoaded: false, error: error as Error });
      }
    }

    prepare();
  }, []);

  // Combine all loading states
  const isReady = fontsLoaded && state.isLoaded;
  // && imagesLoaded && dbLoaded; // Add more conditions as needed

  return {
    isReady,
    error: state.error,
  };
}

// Utility functions
async function initializeAsyncStorage() {
  try {
    // Add any AsyncStorage initialization here
    await AsyncStorage.getItem("test-key");
  } catch (error) {
    console.error("AsyncStorage initialization failed:", error);
    throw error;
  }
}
