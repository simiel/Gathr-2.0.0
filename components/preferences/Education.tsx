import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  GHANA_UNIVERSITIES,
  GHANA_SECONDARY_SCHOOLS,
} from "@/hooks/useOnboardingForm";

interface EducationProps {
  data?: {
    secondarySchool: string;
    university?: string;
  };
  errors: Record<string, string>;
  onUpdate: (data: any) => boolean;
  onNext: () => void;
  onBack: () => void;
}

const SECONDARY_SCHOOLS = GHANA_SECONDARY_SCHOOLS.map((school) => ({
  label: school,
  value: school,
}));

const UNIVERSITIES = GHANA_UNIVERSITIES.map((uni) => ({
  label: uni,
  value: uni,
}));

const Education: React.FC<EducationProps> = ({
  data,
  errors,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [school, setSchool] = useState(data?.secondarySchool || "");
  const [university, setUniversity] = useState(data?.university || "");
  const [openField, setOpenField] = useState<"school" | "university" | "">("");

  const handleNext = () => {
    if (
      onUpdate({
        secondarySchool: school,
        university,
      })
    ) {
      onNext();
    }
  };

  return (
    <View className="flex-1 pb-8">
      <View className="mb-6">
        <Text className="text-gray-700 mb-2">Secondary School</Text>
        <DropDownPicker
          open={openField === "school"}
          value={school}
          items={SECONDARY_SCHOOLS}
          setOpen={() => setOpenField("school")}
          onClose={() => setOpenField("")}
          setValue={setSchool}
          placeholder="Select Secondary School"
          dropDownDirection="TOP"
          style={{
            borderColor: errors.secondarySchool ? "#EF4444" : "#E5E7EB",
            borderRadius: 8,
          }}
          textStyle={{
            fontSize: 16,
          }}
          dropDownContainerStyle={{
            borderColor: "#E5E7EB",
            borderRadius: 8,
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          zIndex={3000}
          zIndexInverse={1000}
        />
        {errors.secondarySchool && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.secondarySchool}
          </Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-2">University (Optional)</Text>
        <DropDownPicker
          open={openField === "university"}
          value={university}
          items={UNIVERSITIES}
          setOpen={() => setOpenField("university")}
          onClose={() => setOpenField("")}
          setValue={setUniversity}
          placeholder="Select University"
          dropDownDirection="TOP"
          style={{
            borderColor: "#E5E7EB",
            borderRadius: 8,
          }}
          textStyle={{
            fontSize: 16,
          }}
          dropDownContainerStyle={{
            borderColor: "#E5E7EB",
            borderRadius: 8,
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          zIndex={4000}
          zIndexInverse={4000}
        />
      </View>

      <View className="flex-row justify-between mt-6">
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

export default Education;
