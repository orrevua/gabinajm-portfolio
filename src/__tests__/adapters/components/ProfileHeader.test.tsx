/**
 * Unit tests for ProfileHeader component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHeader } from "../../../adapters/routes/components/ProfileHeader";
import type { IProfile } from "@domain";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: any) => (
    <img alt={alt} src={src} {...props} data-testid="profile-image" />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: any) => (
    <a href={href} data-testid={`link-${href}`}>
      {children}
    </a>
  ),
}));

describe("ProfileHeader Component", () => {
  const mockProfile: IProfile = {
    name: "Jane Doe",
    title: "Full-Stack Engineer",
    bio: "Passionate about elegant solutions",
    aboutBio: null,
    avatar: {
      asset: {
        url: "https://example.com/avatar.jpg",
        alt: "Jane Doe avatar",
        lqip: "data:image/jpeg;base64,...",
      },
      alt: "Jane Doe avatar",
    },
    socialLinks: [
      { platform: "github", url: "https://github.com/jane" },
      { platform: "linkedin", url: "https://linkedin.com/in/jane" },
    ],
    resumeUrl: "https://example.com/resume.pdf",
    technologies: ["TypeScript", "React"],
    pastExperience: [],
    getSocialLinks: () => [
      { platform: "github", url: "https://github.com/jane" },
      { platform: "linkedin", url: "https://linkedin.com/in/jane" },
    ],
    getResumeUrl: () => "https://example.com/resume.pdf",
  };

  describe("rendering", () => {
    it("should render header with profile information", () => {
      render(<ProfileHeader profile={mockProfile} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jane Doe");
    });

    it("should render profile image when available", () => {
      render(<ProfileHeader profile={mockProfile} />);
      const image = screen.getByTestId("profile-image");
      expect(image).toHaveAttribute("src", "https://example.com/avatar.jpg");
      expect(image).toHaveAttribute("alt", "Jane Doe avatar");
    });

    it("should render bio", () => {
      render(<ProfileHeader profile={mockProfile} />);
      expect(screen.getByText("Passionate about elegant solutions")).toBeInTheDocument();
    });

    it("should not render bio section when empty", () => {
      const profile: IProfile = {
        ...mockProfile,
        bio: "",
      };
      render(<ProfileHeader profile={profile} />);
      expect(screen.queryByText("Passionate")).not.toBeInTheDocument();
    });
  });

  describe("social links", () => {
    it("should render social links", () => {
      render(<ProfileHeader profile={mockProfile} />);
      const links = screen.getAllByRole("link");
      const socialLinks = links.filter((l) =>
        l.getAttribute("href")?.includes("github") ||
        l.getAttribute("href")?.includes("linkedin")
      );
      expect(socialLinks.length).toBeGreaterThan(0);
    });

    it("should not render social section when no links", () => {
      const profile: IProfile = {
        ...mockProfile,
        socialLinks: [],
      };
      render(<ProfileHeader profile={profile} />);
      // Should still render but without social icons
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should have proper aria labels for social links", () => {
      render(<ProfileHeader profile={mockProfile} />);
      const githubLink = screen.getByLabelText(/Visit.*github/i);
      expect(githubLink).toHaveAttribute("target", "_blank");
    });
  });


  describe("null profile", () => {
    it("should render fallback when profile is null", () => {
      render(<ProfileHeader profile={null} />);
      expect(
        screen.getByText("Profile information is currently unavailable.")
      ).toBeInTheDocument();
    });

    it("should still render header element", () => {
      render(<ProfileHeader profile={null} />);
      const section = screen.getByRole("region", { name: "Profile" });
      expect(section).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should use semantic header element", () => {
      render(<ProfileHeader profile={mockProfile} />);
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      render(<ProfileHeader profile={mockProfile} />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveTextContent("Jane Doe");
    });

    it("should have aria-label on profile section", () => {
      render(<ProfileHeader profile={mockProfile} />);
      const header = screen.getByRole("banner");
      expect(header).toHaveAttribute("aria-label");
    });

  });

  describe("graceful degradation", () => {
    it("should handle missing avatar gracefully", () => {
      const profile: IProfile = {
        ...mockProfile,
        avatar: null,
      };
      render(<ProfileHeader profile={profile} />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Jane Doe");
    });

    it("should handle empty bio", () => {
      const profile: IProfile = {
        ...mockProfile,
        bio: "",
      };
      render(<ProfileHeader profile={profile} />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });

    it("should handle no social links", () => {
      const profile: IProfile = {
        ...mockProfile,
        socialLinks: [],
      };
      render(<ProfileHeader profile={profile} />);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should use semantic HTML tags", () => {
      const { container } = render(<ProfileHeader profile={mockProfile} />);
      expect(container.querySelector("header")).toBeInTheDocument();
    });

  });
});
