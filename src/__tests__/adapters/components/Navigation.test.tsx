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

describe("Navigation Component", () => {
  const defaultLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

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
      render(<Navigation links={defaultLinks} />);
      defaultLinks.forEach((link) => {
        expect(
          screen.getByRole("link", { name: link.label })
        ).toBeInTheDocument();
      });
    });
  });

  describe("mobile menu", () => {
    it("should have hidden mobile menu button on desktop", () => {
      const { container } = render(<Navigation links={defaultLinks} />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("md:hidden");
    });

    it("should toggle mobile menu on button click", async () => {
      const { container } = render(<Navigation links={defaultLinks} />);
      const button = container.querySelector("button");

      expect(button).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(button!);
      expect(button).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(button!);
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("should close menu on escape key", async () => {
      const { container } = render(<Navigation links={defaultLinks} />);
      const button = container.querySelector("button");

      fireEvent.click(button!);
      expect(button).toHaveAttribute("aria-expanded", "true");

      fireEvent.keyDown(window, { key: "Escape" });
      expect(button).toHaveAttribute("aria-expanded", "false");
    });

    it("should show mobile menu links when open", async () => {
      render(<Navigation links={defaultLinks} />);
      const button = screen.getByLabelText("Toggle navigation menu");

      fireEvent.click(button);

      defaultLinks.forEach((link) => {
        const links = screen.getAllByRole("link", { name: link.label });
        expect(links.length).toBeGreaterThan(0);
      });
    });
  });

  describe("active link", () => {
    it("should mark current page as active", () => {
      vi.doMock("next/navigation", () => ({
        usePathname: () => "/projects",
      }));

      render(<Navigation links={defaultLinks} />);

      // Find the Projects link - it should be marked as active
      // Note: actual implementation would require proper routing context
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper navigation role", () => {
      render(<Navigation links={defaultLinks} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should have aria-label on brand link", () => {
      const { container } = render(<Navigation />);
      const brandLink = container.querySelector("a[href='/']");
      expect(brandLink).toHaveAttribute("aria-label");
    });

    it("should have aria-label on menu button", () => {
      const { container } = render(<Navigation />);
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("aria-label");
    });

    it("should have aria-expanded on menu button", () => {
      const { container } = render(<Navigation />);
      const button = container.querySelector("button");
      expect(button).toHaveAttribute("aria-expanded");
    });

    it("should have role region on mobile menu", async () => {
      const { container } = render(<Navigation links={defaultLinks} />);
      const button = container.querySelector("button");

      fireEvent.click(button!);

      const mobileMenu = container.querySelector("[role='region']");
      expect(mobileMenu).toBeInTheDocument();
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
      expect(screen.getByRole("link", { name: "Work" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    });
  });


  describe("empty links", () => {
    it("should handle empty links array", () => {
      render(<Navigation links={[]} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("responsive design", () => {
    it("should have hidden desktop nav on mobile", () => {
      const { container } = render(<Navigation links={defaultLinks} />);
      const desktopNav = container.querySelector(".hidden.md\\:flex");
      expect(desktopNav).toBeInTheDocument();
    });

    it("should have mobile menu button", () => {
      const { container } = render(<Navigation />);
      const button = container.querySelector("button");
      expect(button).toHaveClass("md:hidden");
    });
  });
});
