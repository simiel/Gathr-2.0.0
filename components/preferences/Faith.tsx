import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { FAITH_OPTIONS } from "@/hooks/useOnboardingForm";

interface FaithProps {
  data?: {
    religion: string;
    denomination?: string;
  };
  errors: Record<string, string>;
  onUpdate: (data: any) => boolean;
  onNext: () => void;
  onBack: () => void;
}

const FAITH_ITEMS = Object.entries(FAITH_OPTIONS).map(([key, value]) => ({
  label: value.label,
  value: key,
}));

const Faith: React.FC<FaithProps> = ({
  data,
  errors,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [religion, setReligion] = useState(data?.religion || "");
  const [denomination, setDenomination] = useState(data?.denomination || "");
  const [openField, setOpenField] = useState<"religion" | "denomination" | "">(
    ""
  );

  const denominationItems = useMemo(() => {
    if (!religion) return [];
    return FAITH_OPTIONS[
      religion as keyof typeof FAITH_OPTIONS
    ].denominations.map((denom) => ({
      label: denom,
      value: denom,
    }));
  }, [religion]);

  const handleNext = () => {
    if (
      onUpdate({
        religion,
        denomination,
      })
    ) {
      onNext();
    }
  };

  return (
    <View className="flex-1 pb-8">
      <View className="mb-6">
        <Text className="text-[#0D0D0E] font-[Lato-Regular] text-[16px] mb-2">
          Faith
        </Text>
        <DropDownPicker
          open={openField === "religion"}
          value={religion}
          items={FAITH_ITEMS}
          setOpen={() => setOpenField("religion")}
          onClose={() => setOpenField("")}
          setValue={(value) => {
            setReligion(value);
            setDenomination("");
          }}
          placeholder="Select Faith"
          style={{
            borderColor: errors.religion
              ? "#EF4444"
              : openField == "religion"
              ? "black"
              : "#A0A1A1",
            borderRadius: 8,
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
          placeholderStyle={{
            color: "#A0A1A1",
            fontFamily: "Lato-Regular",
          }}
          listMode="SCROLLVIEW"
          dropDownDirection="TOP"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          zIndex={3000}
          zIndexInverse={1000}
        />
        {errors.religion && (
          <Text className="text-red-500 text-sm mt-1">{errors.religion}</Text>
        )}
      </View>

      {religion && (
        <View className="mb-6">
          <Text className="text-[#0D0D0E] font-[Lato-Regular] text-[16px] mb-2">
            Denomination
          </Text>
          <DropDownPicker
            open={openField === "denomination"}
            value={denomination}
            items={denominationItems}
            setOpen={() => setOpenField("denomination")}
            onClose={() => setOpenField("")}
            setValue={setDenomination}
            placeholder="Select Denomination"
            style={{
              borderColor: errors.denomination
                ? "#EF4444"
                : openField == "denomination"
                ? "black"
                : "#A0A1A1",
              borderRadius: 8,
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
            placeholderStyle={{
              color: "#A0A1A1",
              fontFamily: "Lato-Regular",
            }}
            dropDownDirection="TOP"
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            zIndex={4000}
            zIndexInverse={4000}
          />
        </View>
      )}

      <View className="flex-row justify-between mt-6">
        <TouchableOpacity
          onPress={handleNext}
          className="w-full bg-black rounded-full py-5 mb-4"
        >
          <Text className="text-white text-center font-[Lato-Semibold] text-[16px]">
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Faith;
