import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@diamondlightsource/cs-web-lib";
import "@testing-library/jest-dom/vitest";
import { OAVSideBar } from "./OAVSideBar";

describe("OavMover Components", () => {
  it("should display all of the various components ", () => {
    render(
      <Provider store={store}>
        <OAVSideBar />
      </Provider>,
    );
    expect(screen.getByLabelText("Backlight")).toBeInTheDocument();
    expect(screen.getByLabelText("ZoomControl")).toBeInTheDocument();
  });
});
