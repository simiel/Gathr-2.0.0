import React, { useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SlideControlButton from "@/components/Auth/Button";
import OnboardingData, { Data } from "@/components/Auth/data";
import { Pagination } from "@/components/Auth/Pagination";

const RenderItem = ({
  item,
  index,
  x,
}: {
  item: Data;
  index: number;
  x: SharedValue<number>;
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacityAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [100, 0, 100],
      Extrapolate.CLAMP
    );

    return {
      opacity: opacityAnimation,
      transform: [{ translateY: translateYAnimation }],
    };
  });

  const animation = useRef<LottieView>(null);

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 300,
          height: 300,
          marginBottom: -300,
        }}
        source={item.image}
      />

      <Animated.View style={textAnimatedStyle}>
        <Text style={styles.itemTitle}>{item?.title}</Text>
        <Text style={styles.itemText}>{item?.text}</Text>
      </Animated.View>
    </View>
  );
};
const Onboarding = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const flatListRef = useAnimatedRef<FlatList>();

  const flatListIndex = useSharedValue(0);
  const x = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<ViewToken>;
  }) => {
    flatListIndex.value = viewableItems[0].index ?? 0;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={styles.container}>
        <Animated.FlatList
          ref={flatListRef as any}
          data={OnboardingData}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <RenderItem index={index} item={item} x={x} />
          )}
          onScroll={onScroll}
          scrollEventThrottle={16}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged}
        />
        <View
          style={{
            marginTop: -150,
          }}
        >
          <Pagination data={OnboardingData} screenWidth={SCREEN_WIDTH} x={x} />
        </View>

        <View style={styles.footerContainer}>
          <SlideControlButton
            flatListRef={flatListRef}
            flatListIndex={flatListIndex}
            dataLength={OnboardingData?.length}
            // navigateToHome={() => {
            //   // navigation.navigate("AuthNavigation");
            // }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 30,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
  itemTitle: {
    color: "#32324d",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  itemText: {
    color: "#8e8ea9",
    textAlign: "center",
    lineHeight: 20,
    marginHorizontal: 30,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 40,
  },
});

export default Onboarding;
