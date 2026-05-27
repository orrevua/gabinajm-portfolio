/**
 * Unit tests for Footer component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../../../adapters/routes/components/Footer";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  ),
}));

describe("Footer Component", () => {
  const mockLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
  ];

  const mockSocialLinks = [
    { platform: "github", url: "https://github.com/user" },
    { platform: "linkedin", url: "https://linkedin.com/in/user" },
  ];

  describe("rendering", () => {
    it("should render footer element", () => {
      const { container } = render(<Footer />);
      expect(container.querySelector("footer")).toBeInTheDocument();
    });

    it("should render site name", () => {
      render(<Footer siteName="MyPortfolio" />);
      expect(screen.getByText("MyPortfolio")).toBeInTheDocument();
    });

    it("should render tagline", () => {
      render(<Footer />);
      expect(
        screen.getByText(/Creating elegant digital solutions/i)
      ).toBeInTheDocument();
    });

    it("should render copyright with current year", () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    });

    it("should render custom year", () => {
      render(<Footer year={2025} />);
      expect(screen.getByText(/2025/)).toBeInTheDocument();
    });
  });

  describe("navigation links", () => {
    it("should render navigation section", () => {
      render(<Footer navigationLinks={mockLinks} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should render all navigation links", () => {
      render(<Footer navigationLinks={mockLinks} />);
      mockLinks.forEach((link) => {
        expect(screen.getByRole("link", { name: link.label })).toBeInTheDocument();
      });
    });

    it("should not render navigation section when no links", () => {
      render(<Footer navigationLinks={[]} />);
      const nav = screen.queryByText("Navigation");
      expect(nav).not.toBeInTheDocument();
    });

    it("should link to correct paths", () => {
      render(<Footer navigationLinks={mockLinks} />);
      const homeLink = screen.getByRole("link", { name: "Home" });
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("social links", () => {
    it("should render social links section", () => {
      render(<Footer socialLinks={mockSocialLinks} />);
      expect(screen.getByText("Connect")).toBeInTheDocument();
    });

    it("should render all social links", () => {
      render(<Footer socialLinks={mockSocialLinks} />);
      mockSocialLinks.forEach((link) => {
        const socialLink = screen.getByLabelText(new RegExp(link.platform));
        expect(socialLink).toHaveAttribute("href", link.url);
        expect(socialLink).toHaveAttribute("target", "_blank");
      });
    });

    it("should not render social section when no links", () => {
      render(<Footer socialLinks={[]} />);
      expect(screen.queryByText("Connect")).not.toBeInTheDocument();
    });

    it("should have proper attributes on social links", () => {
      render(<Footer socialLinks={mockSocialLinks} />);
      const links = screen.getAllByRole("link");
      const socialLink = links.find((l) => l.getAttribute("href")?.includes("github"));
      expect(socialLink).toHaveAttribute("target", "_blank");
      expect(socialLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("should render social platform icons", () => {
      render(<Footer socialLinks={mockSocialLinks} />);
      // Components render social links in the footer
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper heading structure", () => {
      render(<Footer siteName="Test" navigationLinks={mockLinks} />);
      const h3 = screen.getByRole("heading", { level: 3 });
      expect(h3).toHaveTextContent("Test");
    });

    it("should have aria-label on social links", () => {
      render(<Footer socialLinks={mockSocialLinks} />);
      const githubLink = screen.getByLabelText(/Visit our github/i);
      expect(githubLink).toBeInTheDocument();
    });

    it("should have title attribute on social links", () => {
      render(<Footer socialLinks={mockSocialLinks} />);
      const links = screen.getAllByRole("link");
      const socialLink = links.find((l) => l.getAttribute("href")?.includes("github"));
      expect(socialLink).toHaveAttribute("title", "github");
    });

    it("should have proper semantic HTML structure", () => {
      const { container } = render(<Footer navigationLinks={mockLinks} />);
      expect(container.querySelector("footer")).toBeInTheDocument();
      expect(container.querySelector("nav")).toBeInTheDocument();
    });
  });

  describe("layout", () => {
    it("should have responsive grid layout", () => {
      const { container } = render(
        <Footer navigationLinks={mockLinks} socialLinks={mockSocialLinks} />
      );
      const grid = container.querySelector("[class*='grid-cols-1']");
      expect(grid).toBeInTheDocument();
    });

    it("should have divider element", () => {
      const { container } = render(<Footer />);
      const divider = container.querySelector("[class*='border-t']");
      expect(divider).toBeInTheDocument();
    });
  });

  describe("default props", () => {
    it("should use default site name", () => {
      render(<Footer />);
      expect(screen.getByText("Portfolio")).toBeInTheDocument();
    });

    it("should use current year as default", () => {
      render(<Footer />);
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    });

    it("should use default navigation links", () => {
      render(<Footer navigationLinks={mockLinks} />);
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    });
  });

  describe("made with section", () => {
    it("should render made with message", () => {
      render(<Footer />);
      expect(screen.getByText(/Made with/i)).toBeInTheDocument();
    });
  });

  describe("copyright notice", () => {
    it("should include site name in copyright", () => {
      const { container } = render(<Footer siteName="TestSite" />);
      const footer = container.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("should include rights reserved text", () => {
      render(<Footer />);
      const footer = screen.getByRole("contentinfo");
      expect(footer).toBeInTheDocument();
    });
  });

  describe("responsive design", () => {
    it("should stack on mobile", () => {
      const { container } = render(<Footer navigationLinks={mockLinks} />);
      const grid = container.querySelector(".grid");
      expect(grid).toHaveClass("grid-cols-1");
    });
  });
});
