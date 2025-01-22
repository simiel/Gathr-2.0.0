import { render } from "@testing-library/react-native";
import AuthIndex from "../../app/(auth)/index";

describe("Auth Index Screen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<AuthIndex />);
    expect(getByText("index")).toBeTruthy();
  });

  it("has correct className", () => {
    const { getByTestId } = render(<AuthIndex />);
    const container = getByTestId("auth-container");
    expect(container.props.className).toBe(
      "flex-1 items-center justify-center"
    );
  });
});
