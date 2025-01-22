import { render, waitFor } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import RootLayout from "../app/_layout";
import * as SplashScreen from "expo-splash-screen";

// Mock AsyncStorage before importing the component
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock the required modules
jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Slot: "Slot",
  Stack: "Stack",
}));

jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
}));

jest.mock("expo-splash-screen", () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock("@/hooks/useAppBootstrap", () => ({
  useAppBootstrap: jest.fn().mockReturnValue({ isReady: true, error: null }),
}));

describe("RootLayout", () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("should redirect to onboarding on first launch", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockResolvedValue(null);

    render(<RootLayout />);

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("hasLaunched");
      expect(mockRouter.replace).toHaveBeenCalledWith(
        "/(onboarding)/onboarding"
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("hasLaunched", "true");
    });
  });

  it("should redirect to auth screen on subsequent launches", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    AsyncStorage.getItem.mockResolvedValue("true");

    render(<RootLayout />);

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("hasLaunched");
      expect(mockRouter.replace).toHaveBeenCalledWith("/(auth)");
    });
  });

  it("should handle AsyncStorage errors", async () => {
    const AsyncStorage = require("@react-native-async-storage/async-storage");
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    AsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));

    render(<RootLayout />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error checking first launch:",
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });
});
