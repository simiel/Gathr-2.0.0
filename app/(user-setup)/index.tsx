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
  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [user, setUser] = useState<user>({
    firstName: "",
    lastName: "",
    username: "",
    profileImage: "",
  });

  // Handle selecting an image
  const pickImage = async (onChange: (value: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("valuess,", result.assets[0].uri);
      onChange(result.assets[0].uri);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
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

  // errors if any

  const userDetailsPresent = !!firstName && !!lastName && !!username;

  const isFormValid = firstName?.trim() && lastName?.trim() && username?.trim();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 16,
        // paddingBottom: 32,
      }}
    >
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 16,
        }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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

                        <View style={styles.plusIconView}>
                          <AntDesign
                            name="pluscircle"
                            size={24}
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
                    <Text
                      style={{ marginTop: 8, fontSize: 14, color: "#8E8E8E" }}
                    >
                      Upload profile image
                    </Text>
                  </View>
                </View>

                {/* Input Fields */}
                <View style={{ marginTop: 48, gap: 24, paddingBottom: "20%" }}>
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
                          borderColor: isFirstNameFocused ? "black" : "#E5E5E5",
                        }}
                        returnKeyLabel="Done"
                        onFocus={() => setIsFirstNameFocused(true)}
                        onBlur={() => setIsFirstNameFocused(false)}
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
                          borderColor: isLastNameFocused ? "black" : "#E5E5E5",
                        }}
                        returnKeyLabel="Done"
                        onFocus={() => setIsLastNameFocused(true)}
                        onBlur={() => setIsLastNameFocused(false)}
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
                  <Controller
                    control={control}
                    name="userName"
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
                          borderColor: isUsernameFocused ? "black" : "#E5E5E5",
                        }}
                        returnKeyLabel="Done"
                        onFocus={() => setIsUsernameFocused(true)}
                        onBlur={() => setIsUsernameFocused(false)}
                        autoCapitalize="none"
                      />
                    )}
                    rules={{
                      required: true,
                      minLength: 1,
                      maxLength: 50,
                      // pattern: /^[a-z0-9]+$/,
                      // pattern:/^(?![A-Z])[a-z0-9]+$/i,
                      pattern: /^(?![A-Z])[a-z0-9]+$/,
                    }}
                  />
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
            borderRadius: 12,
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
  plusIconView: {
    alignItems: "center",
    position: "absolute",
    bottom: 0.01,
    right: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    height: 28,
    width: 28,
    justifyContent: "center",
  },
});
