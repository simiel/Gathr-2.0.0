import React, { RefObject } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonProps = {
  flatListRef: RefObject<FlatList>;
  flatListIndex: SharedValue<number>;
  dataLength: number;
};

export default function SlideControlButton({
  dataLength,
  flatListIndex,
  flatListRef,
}: ButtonProps) {
  const buttonAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      width: isLastScreen ? withSpring(126) : withSpring(126),
      height: 56,
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    const isSecondLastScreen = flatListIndex.value === dataLength - 2;
    const isLastScreen = flatListIndex.value === dataLength - 1;

    return {
      opacity:
        !isLastScreen && !isSecondLastScreen ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            !isLastScreen && !isSecondLastScreen
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    };
  });

  const secondArrowAnimationStyle = useAnimatedStyle(() => {
    const isSecondLastScreen = flatListIndex.value === dataLength - 2;

    return {
      opacity: isSecondLastScreen ? withTiming(1) : withTiming(0),
      transform: [
        { translateX: isSecondLastScreen ? withTiming(0) : withTiming(100) },
      ],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      opacity: isLastScreen ? withTiming(1) : withTiming(0),
      transform: [
        { translateX: isLastScreen ? withTiming(0) : withTiming(-100) },
      ],
    };
  });

  const handleNextScreen = () => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    if (!isLastScreen) {
      flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
    }
  };

  const handlePress = () => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    const isSecondLastScreen = flatListIndex.value === dataLength - 2;

    if (isLastScreen) {
      console.log("Navigating to the next screen...");
      //   router.navigate("/(Signup)/UserAuth/PhoneInput/page");
      // navigate using router
    } else if (isSecondLastScreen) {
      handleNextScreen(); // Move to the next slide
    } else {
      handleNextScreen(); // Default action for "Let's go"
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row justify-between items-center mt-5 w-full px-5"
    >
      {/* Skip Button */}
      <Pressable
        onPress={() => {
          //   router.navigate("/UserAuth/GettingStarted/page");
        }}
        className="h-14 w-24 justify-center items-center bg-white border-[1px] border-black rounded-[30px]"
      >
        <Text className="text-black text-[16px] font-semibold">Skip</Text>
      </Pressable>
      <AnimatedPressable
        onPress={handleNextScreen}
        style={[buttonAnimationStyle]}
        className={
          "bg-[#0D0D0E] p-[10px] items-center justify-center overflow-hidden rounded-[35px]"
        }
      >
        <Pressable
          className="justify-center items-center"
          onPress={handlePress}
        >
          <Animated.Text
            style={[textAnimationStyle]}
            className={"text-white text-[16px] font-bold absolute"}
          >
            Get Started
          </Animated.Text>
        </Pressable>

        <Animated.View
          style={[arrowAnimationStyle]}
          className={"text-white text-[16px] font-bold absolute"}
        >
          <Pressable
            onPress={handlePress}
            className="justify-center items-center"
          >
            <Animated.Text
              className={"text-white text-[16px] font-bold absolute"}
            >
              Let's go
            </Animated.Text>
          </Pressable>
        </Animated.View>
        <Animated.View
          style={[secondArrowAnimationStyle]}
          className={"text-white text-[16px] font-bold absolute"}
        >
          <Pressable
            onPress={handlePress}
            className="justify-center items-center"
          >
            <Animated.Text
              className={"text-white text-[16px] font-bold absolute"}
            >
              Keep Going
            </Animated.Text>
          </Pressable>
        </Animated.View>
      </AnimatedPressable>
    </Pressable>
  );
}
