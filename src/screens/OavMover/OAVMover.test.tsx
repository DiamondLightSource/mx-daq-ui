import { render, screen } from "@testing-library/react";
import { it, describe, vi, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { MoveArrows } from "./OAVMoveController";
import userEvent from "@testing-library/user-event";

vi.mock("blueapi/BlueapiComponents", async () => {
  return {
    RunPlanButton: vi.fn((props: { btnLabel: string }) => {
      return <button>{props.btnLabel}</button>;
    }),
  };
});

// vi.mock("./OAVDeviceSettings");

// describe("OavMover Components", () => {
//   beforeEach(() => {
//     render(<OAVSideBar />);
//   });

//   it("should render moveArrows component", async () => {
//     const blockTab = screen.getByRole("tab", { name: "Block" });
//     await userEvent.click(blockTab);
//     expect(screen.getByText("Y - Y")).toBeInTheDocument();
//   });

//   it("should display backlight control dropdown ", () => {
//     render(<BacklightControl label={""} pv={""} />);
//     expect(screen.getByLabelText("BacklightControl")).toBeInTheDocument();
//   });
//   it("should display zoom control dropdown ", () => {
//     render(<ZoomControl label={""} pv={""} />);
//     expect(screen.getByLabelText("ZoomControl")).toBeInTheDocument();
//   });
// });

describe("Move Arrows Tab section", () => {
  render(<MoveArrows />);

  const nudgeTab = screen.getByRole("tab", { name: "Nudge" });
  const windowTab = screen.getByRole("tab", { name: "Window" });
  const blockTab = screen.getByRole("tab", { name: "Block" });
  const focusTab = screen.getByRole("tab", { name: "Focus" });

  it("renders four movement tabs correctly", () => {
    const tabNames = ["Nudge", "Window", "Block", "Focus"];
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    for (const name of tabNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders Nudge Move buttons when Nudge tab is selected", async () => {
    await userEvent.click(nudgeTab);
    expect(screen.getAllByRole("button")).toHaveLength(8);
  });

  it("renders Window Move buttons when Window tab is selected", async () => {
    await userEvent.click(windowTab);
    expect(screen.getAllByRole("button")).toHaveLength(8);
  });

  it("renders Block Move buttons when Block tab is selected", async () => {
    const blockTabButtonNames = ["Y - Y", "X - X", "X + X", "Y + Y"];
    await userEvent.click(blockTab);
    for (const name of blockTabButtonNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders Focus Move buttons when Focus tab is selected", async () => {
    const focusTabButtonNames = ["IN x3", "IN", "OUT", "OUT x3"];
    await userEvent.click(focusTab);
    for (const name of focusTabButtonNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("does not render Focus Move buttons when Block Move is selected", async () => {
    await userEvent.click(blockTab);
    expect(screen.getByText("Y - Y")).toBeInTheDocument();
    expect(screen.queryByText("IN x3")).not.toBeInTheDocument();
  });
});
