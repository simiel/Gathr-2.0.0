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
  StyleSheet,
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

const SignInScreen = () => {
  // const { isLoaded } = useSignIn();
  // const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  // const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const [countryCode, setCountryCode] = useState<CountryCode>("GH"); // Default country code
  const [callingCode, setCallingCode] = useState("+233"); // Default calling code
  const [openCountryPicker, setOpenCountryPicker] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const phoneNumber = watch("phoneNumber");

  const handleCountrySelect = (country: Country) => {
    setCountryCode(country.cca2 as CountryCode);
    setCountryCode(country.cca2);
    setCallingCode(`+${country.callingCode[0]}`);
  };

  const phone = parsePhoneNumber(`${callingCode}${phoneNumber}`);
  const isNumberValid = phoneNumber?.length > 0 && phone?.isValid();

  const testSignUpWithPhoneNumber = async () => {
    console.log("testing phone number");

    try {
      setIsLoading(true);
      console.log("Starting sign-up process with phone number...");

      // await signUp.create({ phoneNumber: phone?.number });
      // await signUp?.create({
      //   phoneNumber: phone?.number,
      // });

      console.log("Sign-up created. Preparing phone number verification...");

      // await signUp?.preparePhoneNumberVerification();
      // setIsLoading(false);
      // router.push({
      //   pathname: "/(auth)/otp",
      //   params: { phoneNumber: phone?.number },
      // });
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsLoading(false);

      Alert.alert(
        "Error",
        "Failed to send OTP. Please check your number and try again."
      );
    }
  };

  const submit = async (data: any) => {
    phone?.isValid ? router.navigate("/(auth)/otp") : console.log("null");
    console.log(phone?.number);
    console.log(data);
  };

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
                onPress={handleSubmit(submit)}
                // onPress={testSignUpWithPhoneNumber}
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
