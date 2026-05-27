import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return React.createElement("img", props);
  },
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};
