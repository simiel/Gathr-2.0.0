import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const GettingStarted = () => {
  const router = useRouter();

  const openPolicy = () => {
    try {
      const websiteUrl = "https://www.gathr.online/privacy-policy";
      Linking.openURL(websiteUrl)
        .then(() => console.log(`Opened ${websiteUrl}`))
        .catch((err) => console.error(`Error opening ${websiteUrl}: ${err}`));
    } catch (error) {
      console.log("Error opening privacy policy", error);
    }
  };
  const openTerms = () => {
    try {
      const websiteUrl = "https://www.gathr.online/terms";
      Linking.openURL(websiteUrl)
        .then(() => console.log(`Opened ${websiteUrl}`))
        .catch((err) => console.error(`Error opening ${websiteUrl}: ${err}`));
    } catch (error) {
      console.log("Error opening terms of service", error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="dark" hidden />
      {/* Background Image */}
      <ImageBackground
        source={require("@/assets/backgrounds/people.png")}
        resizeMode="contain"
        className="flex-1"
      >
        {/* Overlay */}
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.0)",
            "rgba(0, 0, 0, 0.0)",
            "rgba(0, 0, 0, 0.2)",
            "rgba(0, 0, 0, 0.2)",
            "rgba(0, 0, 0, .4)",
            "rgba(0, 0, 0, .6)",
            "rgba(0, 0, 0, .6)",
            "rgba(0, 0, 0, .8)",
            "rgba(0, 0, 0, .9)",
            "rgba(0, 0, 0, 1)",
          ]}
          style={{
            flex: 1,
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />

        {/* Content */}

        {/* Banner Logo */}
        <View className="flex-1 justify-end items-center">
          <View className="py-10">
            <View className="items-center gap-2">
              <Image
                source={require("@/assets/blocks/get-started-logo.png")}
                className="h-[50px]"
                resizeMode="contain"
              />
              <Image
                source={require("@/assets/blocks/get-started-text.png")}
                className="h-[24px]"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* Info & Buttons */}
        <View className="flex-1 pb-10 px-8 justify-end">
          <View className="">
            <View className="">
              <Text
                className="text-center text-sm text-gray-300 mb-4 justify-center align-middle text-[14px]"
                style={{ fontFamily: "Lato-Heavy" }}
              >
                By tapping on <Text className="font-bold">“Get Started”</Text>,
                you agree to our
                <Text>{` \n`}</Text>
                <Text
                  onPress={() => {
                    openPolicy();
                  }}
                  className="text-[#B08D57]"
                >
                  Privacy Policy
                </Text>{" "}
                &{" "}
                <Text
                  onPress={() => {
                    openTerms();
                  }}
                  className="text-[#B08D57]"
                >
                  Terms of Service
                </Text>
              </Text>
            </View>

            {/* Buttons */}
            <View className="gap-2">
              <TouchableOpacity
                onPress={() => {
                  router.replace("/(auth)");
                }}
                className="bg-white py-4 rounded-full "
              >
                <Text className="text-center text-black font-[Lato-Heavy] text-lg">
                  Get Started
                </Text>
              </TouchableOpacity>

              {/* Guest Feature Button */}
              {/* <TouchableOpacity className="py-4 rounded-full">
                <Text className="text-center text-white font-semibold text-lg">
                  {" "}
                  Continue as a guest
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default GettingStarted;
