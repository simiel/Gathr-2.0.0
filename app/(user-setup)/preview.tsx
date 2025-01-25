import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { User } from "iconsax-react-native";
import LottieView from "lottie-react-native";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// Import step components

const WelcomeScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const {
    currentStep,
    steps,
    formData,
    errors,
    nextStep,
    prevStep,
    updateFormData,
    skipOnboarding,
    isFirstStep,
    isLastStep,
  } = useOnboardingForm();

  const params = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    username: string;
    profileImage: string;
  }>();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
    bottomSheetRef.current?.expand();
  };

  // Render step content based on current step
  const renderStepContent = () => {
    const step = steps[currentStep];

    return (
      <Animated.View
        entering={FadeInRight}
        exiting={FadeOutLeft}
        className="flex-1"
      >
        <View className="h-40 w-full items-center justify-center">
          <LottieView
            source={require(`@/assets/animations/${step.animation}`)}
            autoPlay
            loop
            className="w-full h-full"
          />
        </View>

        <Text className="text-2xl font-bold text-center mt-4 mb-2">
          {step.title}
        </Text>

        <Text className="text-gray-600 text-center mb-6">
          {step.description}
        </Text>

        {step.id === "intro" && (
          <Intro onNext={nextStep} onSkip={skipOnboarding} />
        )}

        {step.id === "education" && (
          <Education
            data={formData.education}
            errors={errors}
            onUpdate={(data) => updateFormData("education", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step.id === "faith" && (
          <Faith
            data={formData.faith}
            errors={errors}
            onUpdate={(data) => updateFormData("faith", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step.id === "industry" && (
          <Industry
            data={formData.industry}
            errors={errors}
            onUpdate={(data) => updateFormData("industry", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {step.id === "location" && (
          <Location
            data={formData.locations}
            errors={errors}
            onUpdate={(data) => updateFormData("locations", data)}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        {/* User Preview Content */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-gray-200 mb-4">
            {params.profileImage ? (
              <Image
                source={{ uri: params.profileImage }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <User size={96} className="text-gray-400" />
            )}
          </View>
          <Text className="text-xl font-bold">
            {params.firstName} {params.lastName}
          </Text>
          <Text className="text-gray-600">@{params.username}</Text>
        </View>

        <TouchableOpacity
          onPress={handleStartOnboarding}
          className="bg-blue-500 rounded-lg py-4 px-6 items-center"
        >
          <Text className="text-white font-semibold">
            Complete Your Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showOnboarding && (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["85%"]}
          backdropComponent={renderBackdrop}
          enablePanDownToClose={false}
        >
          <KeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            extraScrollHeight={20}
            className="flex-1"
          >
            <BottomSheetScrollView
              className="flex-1 px-4"
              showsVerticalScrollIndicator={false}
            >
              {renderStepContent()}
            </BottomSheetScrollView>
          </KeyboardAwareScrollView>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

export default WelcomeScreen;
