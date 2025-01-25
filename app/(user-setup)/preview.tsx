import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { User } from "iconsax-react-native";
import LottieView from "lottie-react-native";
import Intro from "@/components/preferences";
import Faith from "@/components/preferences/Faith";
import Industry from "@/components/preferences/Industry";
import Community from "@/components/preferences/Community";
import Education from "@/components/preferences/education";

interface user {
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
}

const WelcomeScreen = () => {
  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const params = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    username: string;
    profileImage: string;
  }>();

  const { username, firstName, lastName, profileImage } = useLocalSearchParams<{
    username: string;
    firstName: string;
    lastName: string;
    profileImage: string;
  }>();
  if (!profileImage || profileImage === undefined) {
    console.log("all params!", username);
  }

  const [currentPage, setCurrentPage] = useState(0);

  // Define the content for each page
  const pages = [
    {
      content: <Intro onNext={() => setCurrentPage(1)} />,
    },
    {
      content: (
        <Education
        //   navigateForward={() => setCurrentPage(2)}
        //   navigateBack={() => setCurrentPage(0)}
        />
      ),
    },
    {
      content: (
        <Faith
        //   navigateBack={() => setCurrentPage(1)}
        //   navigateForward={() => setCurrentPage(3)}
        />
      ),
    },
    {
      content: (
        <Industry
        //   navigateBack={() => {
        //     setCurrentPage(2);
        //   }}
        //   navigateForward={() => {
        //     setCurrentPage(4);
        //   }}
        />
      ),
    },
    {
      content: (
        <Community
        //   navigateBack={() => {
        //     setCurrentPage(3);
        //   }}
        //   navigateForward={() => {
        //     bottomSheetRef.current?.close();
        //     router.navigate("/(main)");
        //   }}
        />
      ),
    },
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "white", padding: 32 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Profile Picture */}

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          autoPlay
          source={require("@/assets/animation/confetti.json")}
        //   ref={animation}
          style={{
            width: 500,
            height: 500,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
          }}
        ></LottieView>

        {!profileImage || profileImage === undefined ? (
          <View
            style={{
              width: 160,
              height: 160,
              borderRadius: 200,
              marginBottom: 32,
              backgroundColor: "#F5F5F5",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={50} variant="Bold" color="#0D0D0E" />
          </View>
        ) : (
          <Image
            source={{ uri: profileImage }}
            style={{
              width: 160,
              height: 160,
              borderRadius: 200,
              marginBottom: 32,
              backgroundColor: "#F5F5F5",
            }}
          />
        )}

        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 8,
            fontFamily: "Lato-Black",
          }}
        >
          Welcome to gathr,
        </Text>
        <Text
          style={{
            fontSize: 24,
            color: "#B08D57",
            fontWeight: "800",
            fontFamily: "Lato-Black",
          }}
        >
          @{username}
        </Text>
      </View>

      {/* Okay Button */}
      <TouchableOpacity
        style={{
          marginTop: "auto",
          backgroundColor: "black",
          paddingVertical: 16,
          borderRadius: 12,
          height: 56,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
        }}
        // onPress={() => console.log("Proceed", username)}
        onPress={() => {
          bottomSheetRef.current?.expand();
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 16,
            fontWeight: "500",
          }}
        >
          Okay
        </Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        // onChange={handleSheetChanges}
        index={-1}
        snapPoints={["80%", "70%"]}
        handleIndicatorStyle={{ backgroundColor: "#5E5E5F", width: 54 }}
        onChange={() => {
          console.log("bottom sheet changed");
        }}
        enableOverDrag
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView
          // keyboardShouldPersistTaps="handled"
          style={{
            flex: 1,
            // padding: 36,
            // backgroundColor: "blue",
            width: "100%",
          }}
        >
          {pages[currentPage].content}
        </BottomSheetScrollView>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    fontSize: 18,
    color: "white",
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    fontSize: 16,
    color: "blue",
    marginTop: 8,
  },
});
