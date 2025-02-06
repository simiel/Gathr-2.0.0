import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import {
  Location as LocationIcon,
  CloseCircle,
  Trash,
} from "iconsax-react-native";

interface LocationProps {
  data?: string[];
  errors: Record<string, string>;
  onUpdate: (data: string[]) => boolean;
  onNext: () => void;
  onBack: () => void;
  maxLocations?: number;
}

const Location: React.FC<LocationProps> = ({
  data = [],
  errors,
  onUpdate,
  onNext,
  onBack,
  maxLocations = 5,
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const locations = data.length > 0 ? data : [""];

  const handleLocationChange = (text: string, index: number) => {
    const newLocations = [...locations];
    newLocations[index] = text;

    // If this is the last input and it's not empty, add a new empty input
    if (
      index === locations.length - 1 &&
      text.trim() !== "" &&
      locations.length < maxLocations
    ) {
      newLocations.push("");
    }
    onUpdate(newLocations);
  };

  const removeLocation = (index: number) => {
    // Don't remove if it's the last empty input
    if (locations.length === 1 && locations[0] === "") {
      return;
    }

    const newLocations = locations.filter((_, i) => i !== index);
    // Ensure there's always at least one input
    if (newLocations.length === 0) {
      newLocations.push("");
    }
    onUpdate(newLocations);
  };

  const handleNext = () => {
    // Filter out empty locations before updating
    const filteredLocations = locations.filter((loc) => loc.trim() !== "");

    if (filteredLocations.length === 0) {
      Alert.alert("Error", "Please add at least one location");
      return;
    }

    onUpdate(filteredLocations);
    onNext();
  };

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1">
          <View className="mb-6">
            <Text className="text-[16px] font-[Lato-Regular] text-black">
              Where do you live?
            </Text>
          </View>

          <View className="gap-4">
            {locations.map((location, index) => (
              <View key={index} className="relative">
                <View className="flex-row items-center">
                  <View className="flex-1 relative">
                    <BottomSheetTextInput
                      className={`rounded-[12px] h-[48px] p-4 pr-12 font-[Lato-Regular] ${
                        focusedIndex === index
                          ? "border border-black"
                          : "border border-[#868685]"
                      }`}
                      placeholder="Enter location"
                      value={location}
                      onChangeText={(text) => handleLocationChange(text, index)}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      placeholderClassName="text-[#868685] font-[Lato-Regular]"
                    />
                    <View className="absolute right-3 top-3">
                      <LocationIcon size={24} color="black" />
                    </View>
                  </View>
                  {(locations.length > 1 || location !== "") && (
                    <TouchableOpacity
                      onPress={() => removeLocation(index)}
                      className="ml-2 p-2"
                    >
                      <Trash size={24} color="#FF4D4F" />
                    </TouchableOpacity>
                  )}
                </View>
                {errors[`location${index}`] && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors[`location${index}`]}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View className="h-6" />
        </ScrollView>

        <View className="py-4 border-t border-gray-200">
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={handleNext}
              className="py-5 flex-1 items-center justify-center rounded-full bg-black"
            >
              <Text className="text-center text-[16px] font-[Lato-Bold] text-white">
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Location;
