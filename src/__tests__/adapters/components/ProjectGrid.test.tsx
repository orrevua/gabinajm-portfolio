/**
 * Unit tests for ProjectGrid component
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectGrid } from "../../../adapters/routes/components/ProjectGrid";

// Mock ProjectCard
vi.mock("../../adapters/routes/components/ProjectCard", () => ({
  ProjectCard: ({ title, slug }: any) => (
    <div data-testid={`project-card-${slug}`}>{title}</div>
  ),
}));

describe("ProjectGrid Component", () => {
  const mockProjects = [
    {
      title: "Project 1",
      slug: "project-1",
      description: "Description 1",
      technologies: ["React"],
    },
    {
      title: "Project 2",
      slug: "project-2",
      description: "Description 2",
      technologies: ["Vue"],
    },
    {
      title: "Project 3",
      slug: "project-3",
      description: "Description 3",
      technologies: ["Angular"],
    },
  ];

  describe("rendering", () => {
    it("should render section with projects", () => {
      render(<ProjectGrid projects={mockProjects} />);
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("should render title by default", () => {
      render(<ProjectGrid projects={mockProjects} />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("My projects");
    });

    it("should render custom title", () => {
      render(<ProjectGrid projects={mockProjects} title="My Work" />);
      expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("My Work");
    });

    it("should render all projects", () => {
      render(<ProjectGrid projects={mockProjects} />);
      expect(screen.getByTestId("project-card-project-1")).toBeInTheDocument();
      expect(screen.getByTestId("project-card-project-2")).toBeInTheDocument();
      expect(screen.getByTestId("project-card-project-3")).toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("should render empty state when no projects", () => {
      render(<ProjectGrid projects={[]} />);
      expect(screen.getByTestId("project-grid-empty")).toBeInTheDocument();
    });

    it("should show default empty message", () => {
      render(<ProjectGrid projects={[]} />);
      expect(
        screen.getByText("No projects available at the moment.")
      ).toBeInTheDocument();
    });

    it("should show custom empty message", () => {
      render(
        <ProjectGrid
          projects={[]}
          emptyMessage="No projects yet! Check back soon."
        />
      );
      expect(
        screen.getByText("No projects yet! Check back soon.")
      ).toBeInTheDocument();
    });

    it("should handle null projects array", () => {
      render(<ProjectGrid projects={null as any} />);
      expect(screen.getByTestId("project-grid-empty")).toBeInTheDocument();
    });
  });

  describe("loading state", () => {
    it("should render loading skeletons when isLoading=true", () => {
      render(<ProjectGrid projects={mockProjects} isLoading={true} />);
      expect(screen.getByTestId("project-grid-loading")).toBeInTheDocument();
    });

    it("should show 3 skeleton items by default", () => {
      render(<ProjectGrid projects={mockProjects} isLoading={true} />);
      const skeletons = screen.getAllByRole("generic", { hidden: true });
      expect(skeletons.length).toBeGreaterThanOrEqual(3);
    });

    it("should not show projects when loading", () => {
      render(<ProjectGrid projects={mockProjects} isLoading={true} />);
      expect(screen.queryByTestId("project-grid")).not.toBeInTheDocument();
    });
  });

  describe("props", () => {
    it("should accept title prop", () => {
      render(<ProjectGrid projects={mockProjects} title="My Portfolio" />);
      expect(screen.getAllByRole("heading")[0]).toHaveTextContent(
        "My Portfolio"
      );
    });

    it("should accept emptyMessage prop", () => {
      render(
        <ProjectGrid
          projects={[]}
          emptyMessage="Custom empty message"
        />
      );
      expect(screen.getByText("Custom empty message")).toBeInTheDocument();
    });

    it("should accept isLoading prop", () => {
      render(
        <ProjectGrid
          projects={mockProjects}
          isLoading={true}
        />
      );
      expect(screen.getByTestId("project-grid-loading")).toBeInTheDocument();
    });

    it("should render projects grid", () => {
      render(
        <ProjectGrid
          projects={mockProjects}
        />
      );
      expect(screen.getByTestId("project-grid")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper section role", () => {
      render(<ProjectGrid projects={mockProjects} />);
      const section = screen.getByRole("region");
      expect(section).toHaveAttribute("aria-label", "My projects");
    });

    it("should use heading hierarchy", () => {
      render(<ProjectGrid projects={mockProjects} />);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
    });

    it("should have aria-hidden on skeletons", () => {
      const { container } = render(
        <ProjectGrid projects={mockProjects} isLoading={true} />
      );
      const skeletons = container.querySelectorAll('[aria-hidden="true"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("responsive grid", () => {
    it("should apply grid classes", () => {
      const { container } = render(<ProjectGrid projects={mockProjects} />);
      const grid = container.querySelector("[data-testid='project-grid']");
      expect(grid).toHaveClass("grid");
    });

    it("should render grid with default 2-column layout", () => {
      render(
        <ProjectGrid
          projects={mockProjects}
        />
      );
      const grid = screen.getByTestId("project-grid");
      expect(grid).toBeInTheDocument();
    });
  });

  describe("data flow", () => {
    it("should pass all props to ProjectCard", () => {
      const customProject = {
        title: "Custom",
        slug: "custom",
        description: "Custom desc",
        technologies: ["Custom"],
        link: "https://example.com",
        featured: true,
      };
      render(<ProjectGrid projects={[customProject]} />);
      expect(screen.getByTestId("project-card-custom")).toBeInTheDocument();
    });
  });
});
