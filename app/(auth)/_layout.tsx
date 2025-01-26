import { Slot, Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      // If user is already signed in, redirect to main app
      router.replace("/(main)");
    }
  }, [isSignedIn]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_left",
      }}
    >
      <Slot />
    </Stack>
  );
}
