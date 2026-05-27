/**
 * Unit tests for ProjectCard component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard, type ProjectCardProps } from "../../../adapters/routes/components/ProjectCard";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: any) => (
    <img alt={alt} src={src} {...props} data-testid="project-image" />
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

describe("ProjectCard Component", () => {
  const defaultProps: ProjectCardProps = {
    title: "Test Project",
    slug: "test-project",
    description: "A test project description",
    mainImage: {
      url: "https://example.com/project.jpg",
      lqip: "data:image/jpeg;base64,...",
      alt: "Project screenshot",
    },
    technologies: ["React", "TypeScript", "Tailwind"],
    link: "https://example.com",
    featured: false,
  };

  describe("rendering", () => {
    it("should use semantic HTML (article element)", () => {
      const { container } = render(<ProjectCard {...defaultProps} />);
      const article = container.querySelector("article");
      expect(article).toBeInTheDocument();
    });

    it("should render image with blur placeholder when available", () => {
      render(<ProjectCard {...defaultProps} />);
      const image = screen.getByTestId("project-image");
      expect(image).toHaveAttribute("src", "https://example.com/project.jpg");
      expect(image).toHaveAttribute("alt", "Project screenshot");
    });

    it("should default to object-cover for images", () => {
      render(<ProjectCard {...defaultProps} />);
      const image = screen.getByTestId("project-image");
      expect(image).toHaveClass("object-cover");
    });

    it("should use object-contain when imageFit is contain", () => {
      render(<ProjectCard {...defaultProps} imageFit="contain" />);
      const image = screen.getByTestId("project-image");
      expect(image).toHaveClass("object-contain");
    });

    it("should not display featured badge when featured is false", () => {
      render(<ProjectCard {...defaultProps} featured={false} />);
      expect(screen.queryByText("Featured")).not.toBeInTheDocument();
    });
  });

  describe("technologies display", () => {
    it("should not render technologies section when empty", () => {
      render(<ProjectCard {...defaultProps} technologies={[]} />);
      expect(screen.queryByText("Technologies")).not.toBeInTheDocument();
    });
  });

  describe("links and actions", () => {
    it("should render View Project link when link provided", () => {
      render(<ProjectCard {...defaultProps} link="https://example.com" />);
      const link = screen.getByRole("link", { name: /View/i });
      expect(link).toHaveAttribute("href", "https://example.com");
    });

    it("should not render View Project link when no link provided", () => {
      render(<ProjectCard {...defaultProps} link={null} />);
      expect(
        screen.queryByRole("link", { name: /View Project/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have descriptive alt text for image", () => {
      render(<ProjectCard {...defaultProps} />);
      const image = screen.getByTestId("project-image");
      expect(image).toHaveAttribute("alt", "Project screenshot");
    });

    it("should have test ID for query", () => {
      const { container } = render(
        <ProjectCard {...defaultProps} slug="test-project" />
      );
      expect(container.querySelector('[data-testid="project-card-test-project"]')).toBeInTheDocument();
    });
  });

  describe("graceful degradation", () => {
    it("should render with all null/missing optional fields", () => {
      render(
        <ProjectCard
          title="Title Only"
          slug="title-only"
          description="Desc"
          technologies={[]}
        />
      );
      expect(screen.getByText("Title Only")).toBeInTheDocument();
    });

    it("should handle empty link string", () => {
      render(<ProjectCard {...defaultProps} link="" />);
      expect(
        screen.queryByRole("link", { name: /View Project/i })
      ).not.toBeInTheDocument();
    });
  });

});
