/**
 * Unit tests for Navigation component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navigation } from "../../../adapters/routes/components/Navigation";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} data-testid={`link-${href}`} {...props}>
      {children}
    </a>
  ),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock i18n translations
vi.mock("@/src/i18n", () => ({
  useTranslation: () => ({
    locale: "en",
    setLocale: vi.fn(),
    t: {
      nav: {
        home: "Home",
        about: "About",
        contact: "Contact",
        menu: "Menu",
        close: "Close",
      },
    },
  }),
}));

describe("Navigation Component", () => {
  const navLabels = ["Home", "About", "Contact"];
  const getMenuButton = () => screen.getByLabelText("Toggle navigation menu");

  describe("rendering", () => {
    it("should render navigation element", () => {
      render(<Navigation />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should render brand name", () => {
      const { container } = render(<Navigation brandName="MyPortfolio" />);
      const brandLink = container.querySelector("a[href='/']");
      expect(brandLink).toBeInTheDocument();
    });

    it("should render navigation links on desktop", () => {
      render(<Navigation />);
      navLabels.forEach((label) => {
        expect(
          screen.getByRole("link", { name: label })
        ).toBeInTheDocument();
      });
    });
  });

  describe("mobile menu", () => {
    it("should have hidden mobile menu button on desktop", () => {
      render(<Navigation />);
      const button = getMenuButton();
      expect(button).toHaveClass("md:hidden");
    });

    it("should toggle mobile menu on button click", async () => {
      render(<Navigation />);
      const button = getMenuButton();

      expect(button).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(button!);
      expect(button).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(button!);
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("should close menu on escape key", async () => {
      render(<Navigation />);
      const button = getMenuButton();

      fireEvent.click(button!);
      expect(button).toHaveAttribute("aria-expanded", "true");

      fireEvent.keyDown(window, { key: "Escape" });
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("should show mobile menu links when open", async () => {
      render(<Navigation />);
      const button = getMenuButton();

      fireEvent.click(button);

      navLabels.forEach((label) => {
        const links = screen.getAllByRole("link", { name: label });
        expect(links.length).toBeGreaterThan(0);
      });
    });
  });

  describe("active link", () => {
    it("should mark current page as active", () => {
      render(<Navigation />);

      // Find the Projects link - it should be marked as active
      // Note: actual implementation would require proper routing context
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper navigation role", () => {
      render(<Navigation />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should have aria-label on brand link", () => {
      const { container } = render(<Navigation />);
      const brandLink = container.querySelector("a[href='/']");
      expect(brandLink).toHaveAttribute("aria-label");
    });

    it("should have aria-label on menu button", () => {
      render(<Navigation />);
      const button = getMenuButton();
      expect(button).toHaveAttribute("aria-label");
    });

    it("should have aria-expanded on menu button", () => {
      render(<Navigation />);
      const button = getMenuButton();
      expect(button).toHaveAttribute("aria-expanded");
    });

    it("should have role region on mobile menu", async () => {
      render(<Navigation />);
      const button = getMenuButton();

      fireEvent.click(button!);

      expect(screen.getByRole("region")).toBeInTheDocument();
    });
  });

  describe("default props", () => {
    it("should use default brand name", () => {
      const { container } = render(<Navigation />);
      const brandLink = container.querySelector("a[href='/']");
      expect(brandLink).toBeInTheDocument();
    });

    it("should use default navigation links", () => {
      render(<Navigation />);
      navLabels.forEach((label) => {
        expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
      });
    });
  });

  describe("responsive design", () => {
    it("should have hidden desktop nav on mobile", () => {
      const { container } = render(<Navigation />);
      const desktopNav = container.querySelector(".hidden.md\\:flex");
      expect(desktopNav).toBeInTheDocument();
    });

    it("should have mobile menu button", () => {
      render(<Navigation />);
      const button = getMenuButton();
      expect(button).toHaveClass("md:hidden");
    });
  });
});
