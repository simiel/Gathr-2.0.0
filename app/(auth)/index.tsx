import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import CountryFlag from "react-native-country-flag";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import parsePhoneNumber, {
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  phoneNumber: string;
};

const SignInScreen = () => {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const [countryCode, setCountryCode] = useState<CountryCode>("GH"); // Default country code
  const [callingCode, setCallingCode] = useState("+233"); // Default calling code
  const [openCountryPicker, setOpenCountryPicker] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();
  const phoneNumber = watch("phoneNumber");

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(`+${country.callingCode[0]}`);
  };

  const phone = parsePhoneNumber(`${callingCode}${phoneNumber}`);
  const isNumberValid = phoneNumber?.length > 0 && phone?.isValid();

  const onSubmit = async (data: { phoneNumber: string }) => {
    try {
      setIsLoading(true);
      const fullPhoneNumber = `${callingCode}${data.phoneNumber}`;
      console.log("🚀 ~ onSubmit ~ data:", fullPhoneNumber);
      const parsedNumber = parsePhoneNumber(fullPhoneNumber);

      if (!parsedNumber?.isValid()) {
        Alert.alert("Error", "Please enter a valid phone number");
        return;
      }

      // First try to sign in
      try {
        if (!signUp) {
          Alert.alert("Error", "Sign-in service is unavailable.");
          return;
        }
        const signUpResponse = await signUp.create({
          phoneNumber: fullPhoneNumber,
        });

        signUp!.preparePhoneNumberVerification();

        router.push({
          pathname: "/(auth)/otp",
          params: {
            phoneNumber: fullPhoneNumber,
            signInId: signUpResponse.id,
          },
        });
      } catch (err: any) {
        // If sign up fails, try to sign in
        if (err.errors?.[0]?.code === "identifier_not_found") {
          try {
            if (!signIn) {
              Alert.alert("Error", "Sign-in service is unavailable.");
              return;
            }

            await trySignIn();
          } catch (signUpErr: any) {
            Alert.alert(
              "Error",
              signUpErr.errors?.[0]?.message || "Failed to sign up"
            );
          }
        } else {
          Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign in");
        }
      }
    } catch (error: any) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const trySignIn = async () => {
    console.log("trySignIn", phoneNumber);

    const { supportedFirstFactors } = await signIn!.create({
      identifier: phoneNumber,
    });

    const firstPhoneFactor: any = supportedFirstFactors!.find((factor: any) => {
      return factor.strategy === "phone_code";
    });

    const { phoneNumberId } = firstPhoneFactor;

    await signIn!.prepareFirstFactor({
      strategy: "phone_code",
      phoneNumberId,
    });

    router.replace(`/otp?phoneNumber=${phoneNumber}`, {});
    setIsLoading(false);
  };

  if (!isSignInLoaded || !isSignUpLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* Container */}
        <View className="flex-1 p-8">
          <SafeAreaView className="flex-1">
            {/* 1/2 */}
            <View className="flex-1">
              {/* Scrollable Content */}
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
              >
                <View className="flex-1 justify-center gap-8">
                  <View className="flex-1 justify-end gap-2">
                    <Text className="text-center text-[24px] font-[Lato-Bold]">
                      Sign In To Gathr
                    </Text>
                    <Text className="text-center text-[16px] text-black font-[Lato-Regular]">
                      Get started with your mobile number
                    </Text>
                  </View>

                  {/* Phone Number Input */}
                  <View
                    className={`flex-row h-[63px] items-center border ${
                      isNumberValid ? "border-black" : "border-gray-300"
                    } rounded-2xl p-4`}
                  >
                    <TouchableOpacity
                      className="flex-row items-center"
                      onPress={() => setOpenCountryPicker(!openCountryPicker)}
                    >
                      <CountryFlag
                        isoCode={countryCode}
                        size={25}
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 50,
                        }}
                      />
                      <View
                        style={{
                          paddingLeft: 10,
                        }}
                      >
                        <Text className="text-[Lato-Regular] text-[16px]">
                          {callingCode}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/* Divider */}
                    <View
                      className={`w-px h-full mx-3 ${
                        isNumberValid ? "bg-black" : "bg-gray-300"
                      }`}
                    />

                    {/* Phone Number Input Field */}
                    <Controller
                      control={control}
                      name="phoneNumber"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          placeholder="Phone Number"
                          value={value}
                          onChangeText={onChange}
                          keyboardType="phone-pad"
                          className="flex-1 text-[16px]"
                          onBlur={onBlur}
                        />
                      )}
                      rules={{ required: true }}
                    />
                  </View>
                </View>
              </ScrollView>
            </View>

            {/* 2/2 */}
            <View className="flex-1 justify-end">
              {/* Submit Button */}
              <TouchableOpacity
                className={`py-4 rounded-full h-[56px] text-center justify-center ${
                  isNumberValid ? "bg-black" : "bg-gray-300"
                }`}
                disabled={phoneNumber?.length === 0 || loading}
                onPress={handleSubmit(onSubmit)}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={"white"} />
                ) : (
                  <Text
                    className={`text-center text-white
                     font-medium`}
                  >
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
      {/* Country Picker */}
      {openCountryPicker && (
        <CountryPicker
          withFlag={true}
          withCallingCode={true}
          withFilter={true}
          countryCode={countryCode}
          withEmoji={true}
          onSelect={handleCountrySelect}
          visible={openCountryPicker}
          onClose={() => setOpenCountryPicker(false)}
          withFlagButton={true}
          preferredCountries={["GH", "US"]}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
