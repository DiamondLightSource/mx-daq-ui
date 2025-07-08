import { it, expect, describe } from "vitest";
import { OavMover } from "./OavMover";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@diamondlightsource/cs-web-lib";
import "@testing-library/jest-dom/vitest";

describe("OavMover Components", () => {
  it("should display all of the various components ", () => {
    render(
      <Provider store={store}>
        <OavMover />
      </Provider>
    );
    expect(
      screen.getByRole("textbox", { name: "Pixels per micron" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Backlight")).toBeInTheDocument();
    expect(screen.getByLabelText("ZoomControl")).toBeInTheDocument();
  });
});
