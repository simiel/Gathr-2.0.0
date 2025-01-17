import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const NotFound = () => {
  return (
    <View>
      <Text>+not-found</Text>
      <Link href="/">
        <Text>Go to home screen!</Text>
      </Link>
    </View>
  );
};

export default NotFound;
