import "@testing-library/jest-native/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Silence the warning: Animated: `useNativeDriver` is not supported
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock expo-constants
jest.mock("expo-constants", () => ({
  Constants: { manifest: { extra: { sentryDsn: "test-dsn" } } },
}));

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Add type declaration for globalThis
declare global {
  interface Global {
    [key: string]: any;
  }
}

// add sample test
test("sample test", () => {
  expect(1).toBe(1);
});
