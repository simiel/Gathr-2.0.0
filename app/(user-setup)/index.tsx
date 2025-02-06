import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Platform,
  SafeAreaView,
  Alert,
  Linking,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "iconsax-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLoadingModal } from "@/hooks/useLoadingModal";
import { TickCircle } from "iconsax-react-native";

interface user {
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
}

const ProfileSetup = () => {
  const {
    firstName: dFirstName,
    lastName: dLastName,
    username: dUsername,
    profileImage: dProfileImage,
  } = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    username: string;
    profileImage: string;
  }>();
  const [focusedField, setFocusedField] = useState("");
  const { saveUserProfile, isUsernameAvailable } = useUserProfile();
  const [isUsernameTaken, setIsUsernameTaken] = useState<boolean | null>(null);
  const usernameCheckTimeout = useRef<NodeJS.Timeout>();
  const abortController = useRef<AbortController>();
  const { showLoading, hideLoading, LoadingModal } = useLoadingModal();
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstName: dFirstName || "",
      lastName: dLastName || "",
      userName: dUsername || "",
      profileImage: dProfileImage || "",
    },
    mode: "onChange",
  });

  // Handle selecting an image
  const pickImage = async (onChange: (value: string) => void) => {
    try {
      // Check permissions first
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to change profile picture.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        base64: true,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        const base64String = result.assets[0].base64 || "";
        // Check file size (base64 string length * 0.75 gives approximate size in bytes)
        const approximateSize = (base64String.length * 0.75) / 1024 / 1024; // Convert to MB

        if (approximateSize > 1) {
          // If larger than 1MB
          Alert.alert(
            "Image Too Large",
            "Please select a smaller image or try again with a different photo."
          );
          return;
        }

        onChange(result.assets[0].base64!);
      } else {
        console.log("Image selection canceled.");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const username = watch("userName");
  const profileImage = watch("profileImage");

  const submitHandler = async (data: any) => {
    try {
      showLoading();
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.userName,
        profileImage: data.profileImage || "",
      };

      await saveUserProfile(userData);

      router.replace({
        pathname: "/(user-setup)/preview",
        params: {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.userName,
          profileImage: data.profileImage || "",
        },
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert(
        "Error",
        "Failed to save profile information. Please try again."
      );
    } finally {
      hideLoading();
    }
  };

  const isFormValid = firstName?.trim() && lastName?.trim() && username?.trim();

  const checkUsername = useCallback(
    async (username: string) => {
      if (!username) {
        setIsUsernameTaken(null);
        return;
      }

      try {
        // Cancel previous request if any
        if (abortController.current) {
          abortController.current.abort();
        }
        abortController.current = new AbortController();

        const isAvailable = await isUsernameAvailable(username);
        setIsUsernameTaken(!isAvailable);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Error checking username:", error);
      }
    },
    [isUsernameAvailable]
  );

  return (
    <>
      <View className="flex-1 p-8 bg-white">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <SafeAreaView className="flex-1">
            <View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={Keyboard?.dismiss}>
                  <View>
                    {/* Title */}
                    <Text
                      style={{
                        fontSize: 24,
                        textAlign: "center",
                        fontFamily: "Lato-Black",
                        lineHeight: 36,
                      }}
                    >
                      Profile Info
                    </Text>

                    {/* Profile Image Upload */}

                    <View style={{ alignItems: "center", marginTop: 48 }}>
                      <Controller
                        control={control}
                        name="profileImage"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <View style={{ position: "relative" }}>
                            <TouchableOpacity
                              onPress={() => pickImage(onChange)}
                            >
                              {value ? (
                                <Image
                                  source={{
                                    uri: `data:image/jpeg;base64,${value}`,
                                  }}
                                  style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                  }}
                                />
                              ) : (
                                <View
                                  style={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: 200,
                                    backgroundColor: "#F5F5F5",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Camera size="26" color="#000000" />
                                </View>
                              )}
                            </TouchableOpacity>

                            <View className="absolute bottom-[0.01px] right-[5px] bg-white rounded-full h-7 w-7 justify-center items-center">
                              <AntDesign
                                name="pluscircle"
                                size={20}
                                color="#292D32"
                              />
                            </View>
                          </View>
                        )}
                        // rules={{
                        //   required: false,
                        // }}
                      />

                      {/* Label */}
                      <View style={{ marginTop: 16 }}>
                        <Text className="text-[16px] text-black font-[Lato-Regular]">
                          Upload profile image
                        </Text>
                      </View>
                    </View>

                    {/* Input Fields */}
                    <View
                      style={{ marginTop: 48, gap: 24, paddingBottom: "20%" }}
                    >
                      {/* First Name */}
                      <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            placeholder="First Name"
                            value={value}
                            onChangeText={onChange}
                            style={{
                              ...styles.inputBox,
                              borderColor:
                                focusedField === "firstName"
                                  ? "black"
                                  : "#E5E5E5",
                            }}
                            returnKeyLabel="Done"
                            onFocus={() => setFocusedField("firstName")}
                            onBlur={() => setFocusedField("")}
                          />
                        )}
                        rules={{
                          required: true,
                          minLength: 1,
                          maxLength: 50,
                          // pattern: /^[A-Za-z]+$/i,
                          pattern: /^(?![\s])[A-Za-z\s]+$/i,
                        }}
                      />
                      {/* last name */}
                      <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <TextInput
                            placeholder="Last Name"
                            value={value}
                            onChangeText={onChange}
                            style={{
                              ...styles.inputBox,
                              borderColor:
                                focusedField === "lastName"
                                  ? "black"
                                  : "#E5E5E5",
                            }}
                            returnKeyLabel="Done"
                            onFocus={() => setFocusedField("lastName")}
                            onBlur={() => setFocusedField("")}
                          />
                        )}
                        rules={{
                          required: true,
                          minLength: 1,
                          maxLength: 50,
                          pattern: /^(?![\s])[A-Za-z\s]+$/i,
                        }}
                      />

                      {/* Username */}
                      <View className="gap-2">
                        <Controller
                          control={control}
                          name="userName"
                          rules={{
                            required: "Username is required",
                            pattern: {
                              value: /^[a-z][a-z0-9]*$/,
                              message:
                                "Username must start with a letter and can only contain lowercase letters and numbers",
                            },
                            validate: async () =>
                              !isUsernameTaken || "Username is already taken",
                          }}
                          render={({ field: { onChange, onBlur, value } }) => (
                            // Last Name
                            <>
                              <TextInput
                                placeholder="Username"
                                value={value}
                                onChangeText={(text) => {
                                  const formattedText = text
                                    ?.replace(/\s+/g, "")
                                    .toLowerCase();
                                  onChange(formattedText);

                                  // Clear previous timeout
                                  if (usernameCheckTimeout.current) {
                                    clearTimeout(usernameCheckTimeout.current);
                                  }

                                  // Debounce username check
                                  usernameCheckTimeout.current = setTimeout(
                                    () => {
                                      checkUsername(formattedText);
                                    },
                                    500
                                  );
                                }}
                                style={{
                                  ...styles.inputBox,
                                  borderColor:
                                    focusedField === "userName"
                                      ? "black"
                                      : "#E5E5E5",
                                }}
                                returnKeyLabel="Done"
                                onFocus={() => setFocusedField("userName")}
                                onBlur={() => setFocusedField("")}
                                autoCapitalize="none"
                              />
                              {value && isUsernameTaken === false && (
                                <View className="absolute right-4 top-3.5">
                                  <TickCircle size="24" color="#4CAF50" />
                                </View>
                              )}
                            </>
                          )}
                        />
                        {errors.userName && (
                          <Text className="text-red-500 font-[Lato-Regular]">
                            {errors.userName.message as string}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </View>
            {/* Submit Button */}
            <TouchableOpacity
              // disabled={isError}
              disabled={!isFormValid}
              style={{
                marginTop: "auto",
                backgroundColor: isFormValid ? "black" : "#E5E5E5",
                paddingVertical: 16,
                borderRadius: 100,
                height: 56,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleSubmit(submitHandler)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 16,
                  fontFamily: "Lato-Bold",
                  lineHeight: 24,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>

      <LoadingModal />
    </>
  );
};

export default ProfileSetup;
// stylesheet
const styles = StyleSheet.create({
  inputBox: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 16,
    fontSize: 14,
    height: 53,
    fontFamily: "Lato-Regular",
    fontWeight: "400",
  },
});
