import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

interface CustomSplashProps {
  onAnimationComplete: () => void;
}

export default function CustomSplash({
  onAnimationComplete,
}: CustomSplashProps) {
  const animation = useRef<LottieView>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      if (hasLaunched === null) {
        await AsyncStorage.setItem("hasLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(true);
        onAnimationComplete();
      }
    } catch (error) {
      console.error("Error checking first launch:", error);
      onAnimationComplete();
    }
  };

  if (!isFirstLaunch) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LottieView
        ref={animation}
        source={require("@/assets/animation/logo.json")}
        autoPlay
        loop={true}
        style={styles.animation}
        onAnimationFinish={onAnimationComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width,
    height,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  animation: {
    width: width * 0.7,
    height: width * 0.7,
  },
});
