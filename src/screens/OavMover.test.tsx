import { describe, expect, test } from "vitest";
import "@testing-library/jest-dom"; // Import after expect is imported
import { render, screen } from "@testing-library/react";
import {} from "./OavMover";

describe("presetButtons", () => {
  test("Collect button is defined", () => {
    render();
    expect(screen.getByText("Collect Position")).toBeInTheDocument();
  });
});
