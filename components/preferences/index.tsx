import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";

interface IntroProps {
  onNext: () => void;
  onSkip: () => void;
}

const Intro: React.FC<IntroProps> = ({ onNext, onSkip }) => {
  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600 text-center px-6 mb-8">
          Complete your profile to connect with like-minded individuals and
          unlock the full potential of Gathr!
        </Text>

        <TouchableOpacity
          onPress={onNext}
          className="w-full bg-blue-500 rounded-lg py-4 mb-4"
        >
          <Text className="text-white text-center font-semibold">
            Let's Get Started
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSkip}
          className="w-full border border-gray-300 rounded-lg py-4"
        >
          <Text className="text-gray-600 text-center">Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Intro;
