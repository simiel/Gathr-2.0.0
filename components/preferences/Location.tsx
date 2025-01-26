import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

interface LocationProps {
  data?: string[];
  errors: Record<string, string>;
  onUpdate: (data: string[]) => boolean;
  onNext: () => void;
  onBack: () => void;
}

const Location: React.FC<LocationProps> = ({
  data = [],
  errors,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [locations, setLocations] = useState<string[]>(data);

  const addLocation = (location: string) => {
    if (locations.length < 5) {
      setLocations((prev) => [...prev, location]);
    }
  };

  const removeLocation = (index: number) => {
    setLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (onUpdate(locations)) {
      onNext();
    }
  };

  return (
    <View className="flex-1">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="mb-8">
          <View className="mb-6">
            <BottomSheetTextInput
              placeholder="Search for a location"
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 8,
                padding: 16,
              }}
            />
          </View>

          <View className="mb-6">
            {locations.map((location, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between bg-gray-50 p-4 rounded-lg mb-2"
              >
                <Text className="flex-1 text-gray-700">{location}</Text>
                <TouchableOpacity
                  onPress={() => removeLocation(index)}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {errors.locations && (
            <Text className="text-red-500 text-sm mb-4">
              {errors.locations}
            </Text>
          )}

          <View className="flex-row justify-between mt-auto">
            <TouchableOpacity
              onPress={onBack}
              className="flex-1 mr-2 border border-gray-300 rounded-lg py-4"
            >
              <Text className="text-gray-600 text-center">Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              className="flex-1 ml-2 bg-blue-500 rounded-lg py-4"
            >
              <Text className="text-white text-center font-semibold">
                Finish
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Location;
