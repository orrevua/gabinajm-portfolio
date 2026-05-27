/**
 * Unit tests for Project domain model
 */

import { describe, it, expect, beforeEach } from "vitest";
import { Project, IProject } from "../../domain/models/Project";
import { FetchError } from "../../domain/types";

describe("Project Model", () => {
  let validProject: IProject;

  beforeEach(() => {
    validProject = {
      id: "proj-001",
      title: "E-Commerce Platform",
      subtitle: null,
      slug: "ecommerce-platform",
      description: "Full-stack e-commerce solution with React and Node.js",
      mainImageSize: null,
      mainImage: {
        asset: {
          id: "image-asset-001",
          url: "https://example.com/project.jpg",
          alt: "E-commerce platform screenshot",
          lqip: "data:image/jpeg;base64,/9j/...",
        },
        assetRef: "image-asset-001",
        alt: "E-commerce platform screenshot",
        lqip: "data:image/jpeg;base64,/9j/...",
        crop: {
          top: 0.1,
          bottom: 0.1,
          left: 0.05,
          right: 0.05,
        },
        hotspot: {
          x: 0.5,
          y: 0.5,
          height: 0.8,
          width: 0.8,
        },
      },
      mainImageCrop: "center",
      technologies: [
        { name: "React", category: "Frontend" },
        { name: "Node.js", category: "Backend" },
        { name: "PostgreSQL", category: "Backend" },
      ],
      link: "https://example.com/project",
      repository: "https://github.com/gabi/ecommerce",
      cardColor: null,
      cardStyle: "large",
      heroColor: null,
      contentSections: [],
      isProtected: false,
      featured: true,
      publishedAt: new Date("2024-01-15"),
    };
  });

  describe("constructor", () => {
    it("should create a valid Project instance", () => {
      const project = new Project(validProject);
      expect(project.title).toBe("E-Commerce Platform");
      expect(project.slug).toBe("ecommerce-platform");
      expect(project.featured).toBe(true);
      expect(project.mainImageCrop).toBe("center");
    });

    it("should trim whitespace from title, slug, and description", () => {
      const project = new Project({
        ...validProject,
        title: "  Project  ",
        slug: "  project-slug  ",
        description: "  Description  ",
      });
      expect(project.title).toBe("Project");
      expect(project.slug).toBe("project-slug");
      expect(project.description).toBe("Description");
    });

    it("should convert slug to lowercase", () => {
      const project = new Project({
        ...validProject,
        slug: "MyProject",
      });
      expect(project.slug).toBe("myproject");
    });

    it("should handle null mainImage", () => {
      const project = new Project({
        ...validProject,
        mainImage: null,
      });
      expect(project.mainImage).toBeNull();
    });

    it("should handle null link and repository", () => {
      const project = new Project({
        ...validProject,
        link: null,
        repository: null,
      });
      expect(project.link).toBeNull();
      expect(project.repository).toBeNull();
    });

    it("should throw FetchError when id is missing", () => {
      expect(() => {
        new Project({ ...validProject, id: "" });
      }).toThrow(FetchError);
    });

    it("should throw FetchError when title is missing", () => {
      expect(() => {
        new Project({ ...validProject, title: "" });
      }).toThrow(FetchError);
    });

    it("should throw FetchError when slug is missing", () => {
      expect(() => {
        new Project({ ...validProject, slug: "" });
      }).toThrow(FetchError);
    });

    it("should throw FetchError when technologies is not an array", () => {
      expect(() => {
        new Project({ ...validProject, technologies: {} as any });
      }).toThrow(FetchError);
    });

    it("should accept publishedAt as ISO string", () => {
      const project = new Project({
        ...validProject,
        publishedAt: "2024-01-15T10:00:00Z" as any,
      });
      expect(project.publishedAt).toBeInstanceOf(Date);
    });

    it("should throw FetchError for invalid publishedAt", () => {
      expect(() => {
        new Project({ ...validProject, publishedAt: 123 as any });
      }).toThrow(FetchError);
    });
  });

  describe("instance methods", () => {
    let project: Project;

    beforeEach(() => {
      project = new Project(validProject);
    });

    it("isLive() should return true if link exists", () => {
      expect(project.isLive()).toBe(true);
    });

    it("isLive() should return true if repository exists", () => {
      const projectNoLink = new Project({
        ...validProject,
        link: null,
      });
      expect(projectNoLink.isLive()).toBe(true);
    });

    it("isLive() should return false if neither link nor repository exists", () => {
      const projectNotLive = new Project({
        ...validProject,
        link: null,
        repository: null,
      });
      expect(projectNotLive.isLive()).toBe(false);
    });

    it("getPrimaryUrl() should return link if available", () => {
      expect(project.getPrimaryUrl()).toBe("https://example.com/project");
    });

    it("getPrimaryUrl() should return repository if link is null", () => {
      const projectNoLink = new Project({
        ...validProject,
        link: null,
      });
      expect(projectNoLink.getPrimaryUrl()).toBe(
        "https://github.com/gabi/ecommerce"
      );
    });

    it("getPrimaryUrl() should return null if both are null", () => {
      const projectNotLive = new Project({
        ...validProject,
        link: null,
        repository: null,
      });
      expect(projectNotLive.getPrimaryUrl()).toBeNull();
    });

    it("getFormattedDate() should format date in en-US locale", () => {
      const formatted = project.getFormattedDate("en-US");
      expect(formatted).toBe("January 2024");
    });

    it("getFormattedDate() should use default locale if not specified", () => {
      const formatted = project.getFormattedDate();
      expect(formatted).toContain("2024");
    });

    it("getTechnologyNames() should return array of unique tech names", () => {
      const names = project.getTechnologyNames();
      expect(names).toContain("React");
      expect(names).toContain("Node.js");
      expect(names).toContain("PostgreSQL");
      expect(names.length).toBe(3);
    });

    it("getTechnologyNames() should remove duplicates", () => {
      const projectDuplicate = new Project({
        ...validProject,
        technologies: [
          { name: "React", category: "Frontend" },
          { name: "React", category: "Frontend" },
          { name: "Node.js", category: "Backend" },
        ],
      });
      const names = projectDuplicate.getTechnologyNames();
      expect(names).toEqual(["React", "Node.js"]);
    });

    it("hasTechnology() should return true if technology exists", () => {
      expect(project.hasTechnology("React")).toBe(true);
      expect(project.hasTechnology("react")).toBe(true);
    });

    it("hasTechnology() should return false if technology not found", () => {
      expect(project.hasTechnology("Vue")).toBe(false);
    });

    it("hasTechnology() should be case-insensitive", () => {
      expect(project.hasTechnology("REACT")).toBe(true);
      expect(project.hasTechnology("ReAcT")).toBe(true);
    });
  });

  describe("static tryCreate()", () => {
    it("should return Project instance for valid data", () => {
      const project = Project.tryCreate(validProject);
      expect(project).toBeInstanceOf(Project);
      expect(project?.title).toBe("E-Commerce Platform");
    });

    it("should return null for invalid data", () => {
      const project = Project.tryCreate({
        ...validProject,
        id: "",
      });
      expect(project).toBeNull();
    });

    it("should return null for null input", () => {
      const project = Project.tryCreate(null);
      expect(project).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle empty technologies array", () => {
      const project = new Project({
        ...validProject,
        technologies: [],
      });
      expect(project.getTechnologyNames()).toEqual([]);
      expect(project.hasTechnology("React")).toBe(false);
    });

    it("should handle whitespace in URLs", () => {
      const project = new Project({
        ...validProject,
        link: "  https://example.com  ",
        repository: "  https://github.com/gabi  ",
      });
      expect(project.link).toBe("https://example.com");
      expect(project.repository).toBe("https://github.com/gabi");
    });
  });
});
