import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {
  GHANA_UNIVERSITIES,
  GHANA_SECONDARY_SCHOOLS,
} from "@/hooks/useOnboardingForm";
import { ArrowLeft } from "iconsax-react-native";

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
        <Text className="text-[#0D0D0E] font-[Lato-Regular] text-[16px] mb-2">
          Secondary School
        </Text>
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
            borderColor: errors.secondarySchool
              ? "#EF4444"
              : openField == "school"
              ? "black"
              : "#A0A1A1",
            borderRadius: 8,
          }}
          placeholderStyle={{
            color: "#A0A1A1",
            fontFamily: "Lato-Regular",
          }}
          textStyle={{
            fontSize: 16,
            fontFamily: "Lato-Regular",
            color: "white",
          }}
          dropDownContainerStyle={{
            borderColor: "#E5E7EB",
            borderRadius: 20,
            backgroundColor: "#2E2E2F",
          }}
          labelStyle={{
            color: "#A0A1A1",
            fontFamily: "Lato-Regular",
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          zIndex={3000}
          zIndexInverse={1000}
        />
        {errors.secondarySchool && (
          <Text className="text-red-500 text-sm mt-1 font-[Lato-Regular]">
            {errors.secondarySchool}
          </Text>
        )}
      </View>

      <View className="mb-6">
        <Text className="text-[#0D0D0E] font-[Lato-Regular] text-[16px] mb-2">
          University institution (Optional)
        </Text>
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
            borderColor: openField == "university" ? "black" : "#A0A1A1",
            borderRadius: 8,
          }}
          placeholderStyle={{
            color: "#A0A1A1",
            fontFamily: "Lato-Regular",
          }}
          textStyle={{
            fontSize: 16,
            color: "white",
            fontFamily: "Lato-Regular",
          }}
          dropDownContainerStyle={{
            borderColor: "#A0A1A1",
            borderRadius: 20,
            backgroundColor: "#2E2E2F",
          }}
          labelStyle={{
            color: "#A0A1A1",
            fontFamily: "Lato-Regular",
          }}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          zIndex={4000}
          zIndexInverse={4000}
        />
      </View>

      <View className="flex-row justify-between mt-16">
        <TouchableOpacity
          onPress={handleNext}
          className="w-full bg-black rounded-full py-5 mb-4"
        >
          <Text className="text-white text-center leading-6 font-[Lato-Semibold] text-[16px]">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Education;
