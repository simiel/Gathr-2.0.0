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
        {/* <View className="h-40 w-full items-center justify-center ">
          <LottieView
                    source={step.animation}
                    autoPlay
                    loop
                    style={{ width: "100%", height: "100%" }}
                  />
        </View> */}

        <Text className="text-2xl font-bold text-center mt-4 mb-2">
          Personalize your experience
        </Text>

        <Text className="text-gray-600 text-center mb-6">
          In order to get the best experience on Gathr. We would like to know a
          little bit more about you.
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <TouchableOpacity
          onPress={onNext}
          className="w-full bg-black rounded-full py-4 mb-4"
        >
          <Text className="text-white text-center font-[Lato-Semibold] text-[16px]">
            Proceed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSkip}
          className="w-full border border-gray-300 rounded-full py-4"
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
