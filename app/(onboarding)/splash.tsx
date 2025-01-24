import React, { useEffect } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const Frame = require("@/assets/blocks/splash-logo.png");
const Tag = require("@/assets/blocks/splash-text.png");

const { height } = Dimensions.get("window");

const duration = 2000;

const splash = () => {
  const translateY = useSharedValue(height);
  const showTag = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY?.value }],
  }));

  const tagAnimatedStyle = useAnimatedStyle(() => ({
    opacity: showTag.value,
  }));

  useEffect(() => {
    // Animate the frame image
    translateY.value = withTiming(
      0,
      {
        duration,
        easing: Easing.out(Easing.cubic),
      },
      () => {
        // Once the frame animation completes, show the tag image
        showTag.value = withTiming(1, { duration: 1000 });
      }
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(onboarding)");
    }, 5000);

    return () => clearTimeout(timer); // Clear timer on unmount
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-black w-full">
      <Animated.View style={[animatedStyles]} className="rounded-[20px]">
        <Image
          source={Frame}
          className="w-[120px]"
          style={{ objectFit: "contain" }}
        />
      </Animated.View>
      <Animated.View
        className="w-full items-center justify-end absolute bottom-5"
        style={[tagAnimatedStyle]}
      >
        <Image
          source={Tag}
          className="w-[137px] h-6"
          style={{ objectFit: "contain" }}
        />
      </Animated.View>
    </View>
  );
};

export default splash;
