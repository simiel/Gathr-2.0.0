import { render } from "@testing-library/react-native";
import Onboarding from "../../app/(onboarding)/onboarding";

describe("Onboarding Screen", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Onboarding />);
    expect(getByText("onboarding")).toBeTruthy();
  });

  it("has correct className", () => {
    const { getByTestId } = render(<Onboarding />);
    const container = getByTestId("onboarding-container");
    expect(container.props.className).toBe(
      "flex-1 items-center justify-center"
    );
  });
});
