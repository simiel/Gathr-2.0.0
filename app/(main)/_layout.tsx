import { Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Message, Messages2, ProfileCircle } from "iconsax-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      console.log("🚀 ~ useEffect ~ isSignedIn:", isSignedIn);

      // If user is not signed in, redirect to auth
      router.replace("/(onboarding)/get-started");
    }
  }, [isSignedIn]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Message size={size} color={color} variant="Bold" />
          ),
          title: "",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, size }) => (
            <ProfileCircle size={size} color={color} variant="Bold" />
          ),
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
