/**
 * Unit tests for SanityDataService
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock sanityClient before importing service
vi.mock("../../services/sanityClient", () => ({
  getSanityClient: vi.fn(),
  checkSanityHealth: vi.fn(),
}));

import { SanityDataService } from "../../services/SanityDataService";
import { getSanityClient, checkSanityHealth } from "../../services/sanityClient";
import { Profile, Project } from "@domain";

describe("SanityDataService", () => {
  let service: SanityDataService;
  let mockClient: any;

  const mockConfig = {
    projectId: "test-project",
    dataset: "production",
    apiVersion: "2024-01-15",
  };

  const mockSanityProfile = {
    _id: "prof-001",
    name: "Gabi Silva",
    title: "Full-Stack Engineer",
    bio: "Passionate about elegant solutions",
    avatar: {
      asset: {
        url: "https://cdn.sanity.io/avatar.jpg",
        lqip: "data:image/jpeg;base64,...",
      },
      alt: "Profile avatar",
    },
    socialLinks: [
      { platform: "github", url: "https://github.com/gabi" },
      { platform: "linkedin", url: "https://linkedin.com/in/gabi" },
    ],
    resumeUrl: "https://cdn.sanity.io/resume.pdf",
    technologies: ["TypeScript", "React", "Node.js"],
  };

  const mockSanityProject = {
    _id: "proj-001",
    title: "E-Commerce Platform",
    slug: { current: "ecommerce-platform" },
    description: "Full-stack e-commerce solution",
    mainImage: {
      asset: {
        _id: "image-asset-001",
        url: "https://cdn.sanity.io/project.jpg",
        lqip: "data:image/jpeg;base64,...",
      },
      assetRef: "image-asset-ref-001",
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
      alt: "Project screenshot",
    },
    mainImageCrop: "top",
    technologies: [
      { name: "React", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
    ],
    link: "https://example.com/project",
    repository: "https://github.com/gabi/ecommerce",
    featured: true,
    publishedAt: "2024-01-15T10:00:00Z",
  };

  beforeEach(() => {
    mockClient = {
      fetch: vi.fn(),
    };

    vi.mocked(getSanityClient).mockReturnValue(mockClient);
    service = new SanityDataService(mockConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfile()", () => {
    it("should fetch and return Profile model", async () => {
      mockClient.fetch.mockResolvedValue(mockSanityProfile);

      const profile = await service.getProfile();

      expect(profile).toBeInstanceOf(Profile);
      expect(profile?.name).toBe("Gabi Silva");
      expect(profile?.title).toBe("Full-Stack Engineer");
    });

    it("should return null if profile not found", async () => {
      mockClient.fetch.mockResolvedValue(null);

      const profile = await service.getProfile();

      expect(profile).toBeNull();
    });

    it("should handle missing avatar gracefully", async () => {
      mockClient.fetch.mockResolvedValue({
        ...mockSanityProfile,
        avatar: null,
      });

      const profile = await service.getProfile();

      expect(profile).toBeInstanceOf(Profile);
      expect(profile?.avatar).toBeNull();
    });

    it("should return null on fetch error", async () => {
      mockClient.fetch.mockRejectedValue(new Error("Network error"));

      const profile = await service.getProfile();

      expect(profile).toBeNull();
    });

    it("should pass PROFILE_QUERY to client.fetch", async () => {
      mockClient.fetch.mockResolvedValue(mockSanityProfile);

      await service.getProfile();

      expect(mockClient.fetch).toHaveBeenCalled();
      const query = mockClient.fetch.mock.calls[0][0];
      expect(query).toContain("*[_type == \"profile\"]");
    });
  });

  describe("getProjects()", () => {
    it("should fetch and return array of Project models", async () => {
      mockClient.fetch.mockResolvedValue([mockSanityProject]);

      const projects = await service.getProjects();

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(1);
      expect(projects[0]).toBeInstanceOf(Project);
      expect(projects[0].title).toBe("E-Commerce Platform");
      expect(projects[0].mainImage?.assetRef).toBe("image-asset-ref-001");
      expect(projects[0].mainImage?.crop).toEqual({
        top: 0.1,
        bottom: 0.1,
        left: 0.05,
        right: 0.05,
      });
      expect(projects[0].mainImage?.hotspot).toEqual({
        x: 0.5,
        y: 0.5,
        height: 0.8,
        width: 0.8,
      });
      expect(projects[0].mainImageCrop).toBe("top");
    });

    it("should return empty array if no projects found", async () => {
      mockClient.fetch.mockResolvedValue([]);

      const projects = await service.getProjects();

      expect(projects).toEqual([]);
      expect(Array.isArray(projects)).toBe(true);
    });

    it("should apply limit if specified", async () => {
      const projects = [mockSanityProject, mockSanityProject, mockSanityProject];
      mockClient.fetch.mockResolvedValue(projects);

      const result = await service.getProjects({ limit: 2 });

      expect(result.length).toBe(2);
    });

    it("should filter featured only if specified", async () => {
      mockClient.fetch.mockResolvedValue([mockSanityProject]);

      await service.getProjects({ featuredOnly: true });

      const query = mockClient.fetch.mock.calls[0][0];
      expect(query).toContain("featured == true");
    });

    it("should return empty array on fetch error", async () => {
      mockClient.fetch.mockRejectedValue(new Error("Network error"));

      const projects = await service.getProjects();

      expect(projects).toEqual([]);
    });

    it("should return empty array if fetch returns non-array", async () => {
      mockClient.fetch.mockResolvedValue({ error: "invalid" });

      const projects = await service.getProjects();

      expect(projects).toEqual([]);
    });

    it("should handle projects with empty title", async () => {
      const projectWithEmptyTitle = {
        ...mockSanityProject,
        title: "",
      };
      mockClient.fetch.mockResolvedValue([mockSanityProject, projectWithEmptyTitle]);

      const projects = await service.getProjects();

      expect(Array.isArray(projects)).toBe(true);
    });
  });

  describe("getFeaturedProjects()", () => {
    it("should fetch and return featured projects", async () => {
      mockClient.fetch.mockResolvedValue([mockSanityProject]);

      const projects = await service.getFeaturedProjects();

      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBe(1);
      expect(projects[0].featured).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const projects = [mockSanityProject, mockSanityProject, mockSanityProject];
      mockClient.fetch.mockResolvedValue(projects);

      const result = await service.getFeaturedProjects(2);

      expect(result.length).toBe(2);
    });

    it("should use default limit of 3", async () => {
      mockClient.fetch.mockResolvedValue([mockSanityProject]);

      const result = await service.getFeaturedProjects();

      expect(result.length).toBeLessThanOrEqual(3);
    });

    it("should call getProjects with correct options", async () => {
      mockClient.fetch.mockResolvedValue([mockSanityProject]);

      const getProjectsSpy = vi
        .spyOn(service, "getProjects")
        .mockResolvedValue([]);

      await service.getFeaturedProjects(5);

      expect(getProjectsSpy).toHaveBeenCalledWith({
        featuredOnly: true,
        limit: 5,
        sort: "newest",
        locale: "en",
      });
    });
  });

  describe("getProjectBySlug()", () => {
    it("should fetch and return single project by slug", async () => {
      mockClient.fetch.mockResolvedValue(mockSanityProject);

      const project = await service.getProjectBySlug("ecommerce-platform");

      expect(project).toBeInstanceOf(Project);
      expect(project?.slug).toBe("ecommerce-platform");
      expect(project?.title).toBe("E-Commerce Platform");
    });

    it("should pass slug as query parameter", async () => {
      mockClient.fetch.mockResolvedValue(mockSanityProject);

      await service.getProjectBySlug("ecommerce-platform");

      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.any(String),
        { slug: "ecommerce-platform" }
      );
    });

    it("should return null if project not found", async () => {
      mockClient.fetch.mockResolvedValue(null);

      const project = await service.getProjectBySlug("nonexistent");

      expect(project).toBeNull();
    });

    it("should return null for invalid slug", async () => {
      const project = await service.getProjectBySlug("");

      expect(project).toBeNull();
    });

    it("should return null on fetch error", async () => {
      mockClient.fetch.mockRejectedValue(new Error("Network error"));

      const project = await service.getProjectBySlug("ecommerce-platform");

      expect(project).toBeNull();
    });

    it("should return null for non-string slug", async () => {
      const project = await service.getProjectBySlug(123 as any);

      expect(project).toBeNull();
    });
  });

  describe("getAllProjectSlugs()", () => {
    it("should return array of slug strings", async () => {
      mockClient.fetch.mockResolvedValue([
        { slug: { current: "project-1" } },
        { slug: { current: "project-2" } },
      ]);

      const slugs = await service.getAllProjectSlugs();

      expect(Array.isArray(slugs)).toBe(true);
      expect(slugs).toEqual(["project-1", "project-2"]);
    });

    it("should return empty array if no slugs found", async () => {
      mockClient.fetch.mockResolvedValue([]);

      const slugs = await service.getAllProjectSlugs();

      expect(slugs).toEqual([]);
    });

    it("should filter out invalid slugs", async () => {
      mockClient.fetch.mockResolvedValue([
        { slug: { current: "valid-slug" } },
        { slug: { current: null } },
        { slug: {} },
      ]);

      const slugs = await service.getAllProjectSlugs();

      expect(slugs).toEqual(["valid-slug"]);
    });

    it("should return empty array on fetch error", async () => {
      mockClient.fetch.mockRejectedValue(new Error("Network error"));

      const slugs = await service.getAllProjectSlugs();

      expect(slugs).toEqual([]);
    });

    it("should return empty array if fetch returns non-array", async () => {
      mockClient.fetch.mockResolvedValue({ error: "invalid" });

      const slugs = await service.getAllProjectSlugs();

      expect(slugs).toEqual([]);
    });
  });

  describe("isReady()", () => {
    it("should return true if health check passes", async () => {
      vi.mocked(checkSanityHealth).mockResolvedValue(true);

      const ready = await service.isReady();

      expect(ready).toBe(true);
    });

    it("should return false if health check fails", async () => {
      vi.mocked(checkSanityHealth).mockRejectedValue(
        new Error("Connection failed")
      );

      const ready = await service.isReady();

      expect(ready).toBe(false);
    });
  });

  describe("getConfig()", () => {
    it("should return the service configuration", () => {
      const config = service.getConfig();

      expect(config).toEqual(mockConfig);
    });
  });

  describe("graceful degradation", () => {
    it("should handle null mainImage gracefully", async () => {
      mockClient.fetch.mockResolvedValue([
        { ...mockSanityProject, mainImage: null },
      ]);

      const projects = await service.getProjects();

      expect(projects.length).toBe(1);
      expect(projects[0].mainImage).toBeNull();
    });

    it("should handle missing technologies gracefully", async () => {
      mockClient.fetch.mockResolvedValue([
        { ...mockSanityProject, technologies: null },
      ]);

      const projects = await service.getProjects();

      expect(projects.length).toBe(1);
      expect(projects[0].technologies).toEqual([]);
    });

    it("should handle missing socialLinks gracefully", async () => {
      mockClient.fetch.mockResolvedValue({
        ...mockSanityProfile,
        socialLinks: null,
      });

      const profile = await service.getProfile();

      expect(profile?.socialLinks).toEqual([]);
    });
  });

  describe("error logging", () => {
    it("should log fetch errors", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockClient.fetch.mockRejectedValue(new Error("Network error"));

      await service.getProfile();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it("should log warn for missing profile", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      mockClient.fetch.mockResolvedValue(null);

      await service.getProfile();

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });
});
