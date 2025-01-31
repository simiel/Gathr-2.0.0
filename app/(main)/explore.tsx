import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";

const explore = () => {
  const { signOut } = useAuth();
  return (
    <View className="flex-1 justify-center items-center">
      <Text>explore</Text>

      <TouchableOpacity
        onPress={() => {
          signOut();
        }}
      >
        <Text>jkfekj</Text>
      </TouchableOpacity>
    </View>
  );
};

export default explore;
