import React, { useState } from "react";
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
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "iconsax-react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";

interface user {
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
}

const ProfileSetup = () => {
  const [focusedField, setFocusedField] = useState("");
  const [user, setUser] = useState<user>({
    firstName: "",
    lastName: "",
    username: "",
    profileImage: "",
  });

  // Handle selecting an image
  const pickImage = async (onChange: (value: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("values,", result.assets[0].uri);
      onChange(result.assets[0].uri);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      profileImage: "",
    },
    mode: "onChange",
  });
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const username = watch("userName");
  const profileImage = watch("profileImage");

  // Handle submit
  const handleSubmitForm = async (data: any) => {
    const newUser: user = {
      firstName,
      lastName,
      username,
      profileImage: profileImage || "",
    };

    setUser(newUser);
    console.log("Profile Info Submitted", data);
    router.setParams({ user: JSON.stringify(user) });

    // Navigate to the next screen
    router.navigate({
      pathname: "/(user-setup)/preview",
      params: {
        firstName: firstName,
        lastName: lastName,
        username: username,
        profileImage: profileImage,
      },
    });
  };

  const isFormValid = firstName?.trim() && lastName?.trim() && username?.trim();

  return (
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
                          <TouchableOpacity onPress={() => pickImage(onChange)}>
                            {value ? (
                              <Image
                                source={{ uri: value }}
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
                              focusedField === "lastName" ? "black" : "#E5E5E5",
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
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                          // Last Name
                          <TextInput
                            placeholder="Username"
                            value={value}
                            // onChangeText={onChange}
                            onChangeText={(text) =>
                              onChange(text?.replace(/\s+/g, "").toLowerCase())
                            } // Force lowercase
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
            onPress={handleSubmit(handleSubmitForm)}
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
