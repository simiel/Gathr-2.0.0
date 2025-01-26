import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { INDUSTRY_OPTIONS } from "@/hooks/useOnboardingForm";

interface IndustryProps {
  data?: string[];
  errors: Record<string, string>;
  onUpdate: (data: string[]) => boolean;
  onNext: () => void;
  onBack: () => void;
}

const Industry: React.FC<IndustryProps> = ({
  data = [],
  errors,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(data);

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) => {
      if (prev.includes(industry)) {
        return prev.filter((i) => i !== industry);
      }
      return [...prev, industry];
    });
  };

  const handleNext = () => {
    if (onUpdate(selectedIndustries)) {
      onNext();
    }
  };

  return (
    <View className="flex-1 pb-8">
      {/* <ScrollView className="flex-1 mb-6"> */}
      <View className="flex-row flex-wrap">
        {INDUSTRY_OPTIONS.map((industry) => (
          <TouchableOpacity
            key={industry}
            onPress={() => toggleIndustry(industry)}
            className={`m-1 px-4 py-2 rounded-full border ${
              selectedIndustries.includes(industry)
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300"
            }`}
          >
            <Text
              className={
                selectedIndustries.includes(industry)
                  ? "text-white"
                  : "text-gray-600"
              }
            >
              {industry}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* </ScrollView> */}

      {errors.industry && (
        <Text className="text-red-500 text-sm mb-4">{errors.industry}</Text>
      )}

      <View className="flex-row justify-between">
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
          <Text className="text-white text-center font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Industry;
