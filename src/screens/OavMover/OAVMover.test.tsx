import { cleanup, render, screen } from "@testing-library/react";
import { it, describe, vi, expect, beforeEach, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { MoveArrows } from "./OAVMoveController";
import { OAVSideBar } from "./OAVSideBar";

vi.mock("blueapi/BlueapiComponents", () => {
  return {
    RunPlanButton: vi.fn((props: { btnLabel: string }) => {
      return <button>{props.btnLabel}</button>;
    }),
  };
});

vi.mock("./OAVDeviceSettings", () => {
  return {
    ZoomControl: vi.fn((props: { label: string }) => {
      return <div>{props.label}</div>;
    }),
    BacklightControl: vi.fn((props: { label: string }) => {
      return <div>{props.label}</div>;
    }),
  };
});

describe("OavMover Components", () => {
  beforeEach(() => {
    render(<OAVSideBar />);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should render moveArrows component", async () => {
    const blockTab = screen.getByRole("tab", { name: "Block" });
    await userEvent.click(blockTab);
    expect(screen.getByRole("button", { name: "Y - Y" })).toBeInTheDocument();
  });

  it("should render zoom control dropdown ", () => {
    expect(screen.getByText("zoom-level")).toBeInTheDocument();
  });

  it("should render backlight control dropdown ", () => {
    expect(screen.getByText("backlight-pos")).toBeInTheDocument();
  });

  it("should render coordinate system component ", () => {
    expect(screen.getByText("Co-ordinate System Setup")).toBeInTheDocument();
  });

  it("should render side drawer", async () => {
    expect(screen.getByText("Preset Positions")).toBeInTheDocument();
    const presetButton = screen.getByRole("button", {
      name: "Preset Positions",
    });
    await userEvent.click(presetButton);
    expect(screen.getByRole("presentation")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Collect Position" }),
    ).toBeInTheDocument();
  });
});

describe("Move Arrows Tab section", () => {
  beforeEach(() => {
    render(<MoveArrows />);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders four movement tabs correctly", () => {
    const tabNames = ["Nudge", "Window", "Block", "Focus"];
    expect(screen.getAllByRole("tab")).toHaveLength(4);
    for (const name of tabNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it("renders Nudge Move buttons when Nudge tab is selected", async () => {
    const nudgeTab = screen.getByRole("tab", { name: "Nudge" });
    await userEvent.click(nudgeTab);
    const nudgeButtons = screen.getAllByRole("button");
    expect(nudgeButtons).toHaveLength(8);
    nudgeButtons.forEach((btn) => expect(btn).toBeEnabled());
  });

  it("renders Window Move buttons when Window tab is selected", async () => {
    const windowTab = screen.getByRole("tab", { name: "Window" });
    await userEvent.click(windowTab);
    const windowButtons = screen.getAllByRole("button");
    expect(windowButtons).toHaveLength(8);
    windowButtons.forEach((btn) => expect(btn).toBeEnabled());
  });

  it("renders Block Move buttons when Block tab is selected", async () => {
    const blockTab = screen.getByRole("tab", { name: "Block" });
    const blockTabButtonNames = ["Y - Y", "X - X", "X + X", "Y + Y"];
    await userEvent.click(blockTab);
    for (const name of blockTabButtonNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(name)).toBeEnabled();
    }
  });

  it("renders Focus Move buttons when Focus tab is selected", async () => {
    const focusTab = screen.getByRole("tab", { name: "Focus" });
    const focusTabButtonNames = ["IN x3", "IN", "OUT", "OUT x3"];
    await userEvent.click(focusTab);
    for (const name of focusTabButtonNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(name)).toBeEnabled();
    }
  });

  it("does not render Focus Move buttons when Block Move is selected", async () => {
    const blockTab = screen.getByRole("tab", { name: "Block" });
    await userEvent.click(blockTab);
    expect(screen.getByText("Y - Y")).toBeInTheDocument();
    expect(screen.queryByText("IN x3")).not.toBeInTheDocument();
  });

  it("ensures buttons have unique labels in each tab", async () => {
    const user = userEvent.setup();

    const tabNames = ["Nudge", "Window", "Block", "Focus"];

    for (const name of tabNames) {
      const tab = screen.getByRole("tab", { name });
      await user.click(tab);
      const buttons = screen.getAllByRole("button").map((btn) => btn.innerHTML);

      const duplicates = buttons.filter((item, index) => {
        return buttons.indexOf(item) !== index;
      });

      expect(duplicates).toEqual([]);
    }
  });
});
