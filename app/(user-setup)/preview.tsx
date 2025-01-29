import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ArrowLeft, User } from "iconsax-react-native";
import LottieView from "lottie-react-native";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Intro from "@/components/preferences";
import Education from "@/components/preferences/Education";
import Faith from "@/components/preferences/Faith";
import Industry from "@/components/preferences/Industry";
import Location from "@/components/preferences/Location";

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
    submitForm,
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

  const submit = async () => {
    const isFormValid = await submitForm();
    if (isFormValid) {
      // Navigate to the next screen
      console.log("submit");
      router.navigate({
        pathname: "/(main)",
        params: {},
      });
    }
  };

  const skipPreferences = () => {
    // Navigate to the next screen
    router.navigate({
      pathname: "/(main)",
      params: {},
    });
  };

  // Render step content based on current step
  const renderStepContent = () => {
    const step = steps[currentStep];

    return (
      <Animated.View
        entering={FadeInRight}
        exiting={FadeOutLeft}
        className="flex-1 px-2"
      >
        {currentStep > 0 && (
          <>
            {/* Header */}
            <View className="flex-row mt-8 mb-4 gap-4 items-center">
              <TouchableOpacity className="" onPress={prevStep}>
                <ArrowLeft size={24} color="#000" />
              </TouchableOpacity>
              <View className="bg-[#FFEABE] h-[24px] px-[12px] items-center justify-center rounded-full">
                <Text className="text-[16px] font-[Lato-Semibold] text-black">
                  {currentStep}/{steps.length - 1}
                </Text>
              </View>
              <View className="">
                <Text className="text-black font-[Lato-Black] text-[20px]">
                  {step.title}
                </Text>
              </View>
              <TouchableOpacity className="ml-auto" onPress={skipPreferences}>
                <Text className="text-black font-[Lato-Regular] text-[16px]">
                  Skip
                </Text>
              </TouchableOpacity>
            </View>

            <View
              className={`h-40 w-full items-center justify-center bg-[${step.bg}] rounded-[20px]`}
            >
              <LottieView
                source={step.animation}
                autoPlay
                loop
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            <Text className="text-[#A6A6A7] text-[16px] font-[Lato-Regular] text-center mb-6">
              {step.description}
            </Text>
          </>
        )}

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
            onNext={submit}
            onBack={prevStep}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-8">
      <View className="flex-1">
        <LottieView
          source={require("@/assets/animation/confetti.json")}
          autoPlay
          loop={true}
          style={{ width: "100%", height: "100%", position: "absolute" }}
        />
        {/* User Preview Content */}
        <View className="items-center flex-1 justify-center">
          <View className="">
            {!params.profileImage ? (
              <View className="w-[160px] h-[160px] rounded-full mb-[32px] items-center justify-center bg-[#f5f5f5]">
                <User size={100} variant="Bold" color="#0D0D0E" />
              </View>
            ) : (
              <Image
                source={{ uri: params.profileImage }}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 200,
                  marginBottom: 32,
                  backgroundColor: "#F5F5F5",
                }}
              />
            )}
          </View>

          <View>
            <Text className="text-[24px] font-[Lato-Black] text-center mb-[8px]">
              Welcome to gathr,
            </Text>
            <Text className="text-[24px] text-[#B08D57] font-[Lato-Black] text-center mb-[8px]">
              @{params.username}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleStartOnboarding}
          className="bg-black rounded-full py-6 px-6 items-center"
        >
          <Text className="text-white font-semibold">Okay</Text>
        </TouchableOpacity>
      </View>
      {/* </ScrollView> */}

      {showOnboarding && (
        <BottomSheet
          ref={bottomSheetRef}
          //   snapPoints={[200]}
          enableDynamicSizing
          backdropComponent={renderBackdrop}
          enablePanDownToClose={false}
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
        >
          {/* <KeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            extraScrollHeight={20}
            className="flex-1"
          > */}
          <BottomSheetScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
          >
            {renderStepContent()}
          </BottomSheetScrollView>
          {/* </KeyboardAwareScrollView> */}
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

export default WelcomeScreen;
