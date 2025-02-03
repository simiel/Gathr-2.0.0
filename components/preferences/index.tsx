import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import Swiper from "react-native-swiper";

interface IntroProps {
  onNext: () => void;
  onSkip: () => void;
}

const Intro: React.FC<IntroProps> = ({ onNext, onSkip }) => {
  return (
    <View className="flex-1 pb-8">
      <View>
        <Swiper
          autoplay
          loop
          loadMinimal
          containerStyle={{
            backgroundColor: "#FFEABE",
            borderRadius: 20,
            width: "100%",
            marginBottom: 12,
            height: 180,
          }}
          // style={styles.swiper}
          style={{
            height: 200,
          }}
          showsButtons={false}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LottieView
              style={{
                width: "100%",
                height: 120,
                borderRadius: 20,
                marginBottom: 30,
              }}
              source={require("@/assets/animation/education.json")}
              autoPlay
              loop
            />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LottieView
              style={{
                width: "100%",
                height: 120,
                borderRadius: 20,
                marginBottom: 30,
              }}
              source={require("@/assets/animation/faith.json")}
              autoPlay
              loop
            />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LottieView
              style={{
                width: "100%",
                height: 120,
                borderRadius: 20,
                marginBottom: 30,
              }}
              source={require("@/assets/animation/industry.json")}
              autoPlay
              loop
            />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <LottieView
              style={{
                width: "100%",
                height: 150,
                borderRadius: 20,
                marginBottom: 30,
              }}
              source={require("@/assets/animation/location.json")}
              autoPlay
              loop
            />
          </View>
        </Swiper>

        <Text className="text-2xl font-bold text-center mt-2 mb-2">
          Personalize your experience
        </Text>

        <Text className="text-gray-600 text-center mb-6">
          In order to get the best experience on Gathr. We would like to know a
          little bit more about you.
        </Text>
      </View>
      <View className="flex-1 items-center justify-center mt-20">
        <TouchableOpacity
          onPress={onNext}
          className="w-full bg-black rounded-full py-5 mb-4"
        >
          <Text className="text-white text-center font-[Lato-Semibold] text-[16px]">
            Proceed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSkip}
          className="w-full border border-gray-300 rounded-full py-5"
        >
          <Text className="text-black text-center font-[Lato-Semibold] text-[16px]">
            Skip
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Intro;
