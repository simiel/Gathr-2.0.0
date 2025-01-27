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
  Alert,
} from "react-native";
import { ArrowLeft2 } from "iconsax-react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";

const CELL_COUNT = 6;
const RESEND_COOLDOWN = 30;

const OTPScreen = () => {
  const params = useLocalSearchParams<{
    phoneNumber: string;
    signInId?: string;
    signUpId?: string;
  }>();

  const { signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setTimer(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      if (params.signInId) {
        await signIn?.create({
          identifier: params.phoneNumber,
          strategy: "phone_code",
        });
      } else if (params.signUpId) {
        const signUpAttempt = await signUp?.create({
          phoneNumber: params.phoneNumber,
        });
        await signUpAttempt?.preparePhoneNumberVerification();
      }
      startTimer();
      Alert.alert("Success", "Code resent successfully");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.errors?.[0]?.message || "Failed to resend code"
      );
    } finally {
      setIsResending(false);
    }
  };

  const verifyCode = async () => {
    try {
      setLoading(true);
      if (params.signInId) {
        const signInAttempt = await signIn?.attemptFirstFactor({
          strategy: "phone_code",
          code,
        });

        if (signInAttempt?.status === "complete") {
          await setActive?.({ session: signInAttempt.createdSessionId });
          router.replace("/(main)");
        }
      } else if (params.signUpId) {
        const signUpAttempt = await signUp?.attemptPhoneNumberVerification({
          code,
        });

        if (signUpAttempt?.status === "complete") {
          const signInAttempt = await signIn?.create({
            identifier: params.phoneNumber,
            strategy: "phone_code",
          });

          await signInAttempt?.attemptFirstFactor({
            strategy: "phone_code",
            code,
          });

          router.replace("/(main)");
        }
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.errors?.[0]?.message || "Invalid verification code"
      );
      setCode("");
    } finally {
      setLoading(false);
    }
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
      <SafeAreaView className="flex-1">
        {/* Container */}
        <View className="flex-1 ">
          <View className="flex-1 justify-end">
            <TouchableOpacity
              className="absolute top-0 left-[20px] p-3 bg-[#ECECED] rounded-full"
              onPress={() => {
                router.back();
              }}
            >
              <ArrowLeft2 size="24" color="#141B34" />
            </TouchableOpacity>
            {/* Title */}
            <View className="gap-2">
              <Text className="text-[24px] font-[Lato-Heavy] text-center">
                Verify Your Gathr Account
              </Text>
              <Text className="text-[16px] font-[Lato-Regular] text-black text-center">
                Enter the code sent to {params.phoneNumber}
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
            <Text className="text-[16px] font-[Lato-Medium] text-[#B2B3B3]">
              Didn't receive the code?{" "}
            </Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={timer > 0 || isResending}
            >
              <Text className="text-[16px] font-[Lato-Medium] text-black">
                {isResending
                  ? "Resending..."
                  : timer > 0
                  ? `Resend in ${timer}s`
                  : "Resend Code"}
              </Text>
            </TouchableOpacity>
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
