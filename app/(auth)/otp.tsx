import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ArrowLeft2 } from "iconsax-react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const OTPScreen = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (otp.every((d) => d !== "")) {
      console.log("Filled");
    } else {
      console.log("Unfilled");
    }
  }, [otp]);

  const [code, setCode] = useState("");
  const CELL_COUNT = 6;

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const verifyCode = () => {
    console.log("code", code);
    // router.navigate("/(user-setup)");
  };

  useEffect(() => {
    if (code.length === CELL_COUNT) {
      verifyCode();
    }
  }, [code]);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView className="flex-1 ">
        {/* Container */}
        <View className="flex-1 ">
          <View className="flex-1 justify-end">
            <TouchableOpacity
              className="absolute top-0 left-0"
              onPress={() => {
                router.back();
              }}
            >
              <ArrowLeft2 size="44" color="#141B34" />
            </TouchableOpacity>
            {/* Title */}
            <View className="gap-2">
              <Text className="text-[24px] font-[Lato-Heavy] text-center">
                Verify Your Gathr Account
              </Text>
              <Text className="text-[16px] font-[Lato-Thin] text-black text-center">
                We have sent you an OTP. Please check your email {`\n`} to
                complete this process.
              </Text>
            </View>

            {/* OTP Input Boxes */}
            <View>
              <CodeField
                ref={ref}
                {...props}
                value={code}
                onChangeText={setCode}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                // autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
                autoComplete="one-time-code"
                testID="my-code-input"
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    onLayout={getCellOnLayoutHandler(index)}
                    key={index}
                    style={[styles.cellRoot, isFocused && styles.focusCell]}
                  >
                    <Text style={styles.cellText}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>

          <View className="flex-1">
            {/* Countdown Timer */}
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <Text className="text-[16px] font-[Lato-Medium] text-[#B2B3B3]">
                Didn't receive OTP code?{" "}
                {timer > 0 ? (
                  <Text className="text-[16px] font-[Lato-Bold] text-black">
                    00:{timer.toString().padStart(2, "0")}
                  </Text>
                ) : (
                  <Text className="text-[16px] font-[Lato-Medium] text-black">
                    Resend OTP
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default OTPScreen;
// styles
const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  codeFieldRoot: {
    marginTop: 20,
    minWidth: 300,
    alignSelf: "center",
    marginBottom: 20,
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 1,
    borderColor: "#00000030",
    textAlign: "center",
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    fontFamily: "Lato-Regular",
  },
  cellText: {
    fontSize: 28,
    textAlign: "center",
    color: "#000",
  },
  focusCell: {
    borderColor: "#000",
    borderWidth: 1,
  },
});
