/**
 * Unit tests for DataService interface and implementations
 */

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import {
  IDataService,
  NullDataService,
} from "../../domain/interfaces/DataService";

describe("DataService Interface", () => {
  describe("IDataService contract", () => {
    it("should define getProfile() method", () => {
      const service: IDataService = new NullDataService();
      expect(typeof service.getProfile).toBe("function");
    });

    it("should define getProjects() method", () => {
      const service: IDataService = new NullDataService();
      expect(typeof service.getProjects).toBe("function");
    });

    it("should define getFeaturedProjects() method", () => {
      const service: IDataService = new NullDataService();
      expect(typeof service.getFeaturedProjects).toBe("function");
    });

    it("should define getProjectBySlug() method", () => {
      const service: IDataService = new NullDataService();
      expect(typeof service.getProjectBySlug).toBe("function");
    });

    it("should define getSections() method", () => {
      const service: IDataService = new NullDataService();
      expect(typeof service.getSections).toBe("function");
    });

    it("should define getHomePage() method", () => {
      const service: IDataService = new NullDataService();
      expect(typeof service.getHomePage).toBe("function");
    });

    it("should define getAllProjectSlugs() method", () => {
      const service: IDataService = new NullDataService();
      expect(typeof service.getAllProjectSlugs).toBe("function");
    });

    it("should define isReady() method", () => {
      const service: IDataService = new NullDataService();
      expect(typeof service.isReady).toBe("function");
    });
  });
});

describe("NullDataService", () => {
  let service: NullDataService;

  beforeEach(() => {
    service = new NullDataService();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getProfile()", () => {
    it("should return null", async () => {
      const result = await service.getProfile();
      expect(result).toBeNull();
    });

    it("should log warning", async () => {
      await service.getProfile();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("NullDataService: getProfile()")
      );
    });
  });

  describe("getProjects()", () => {
    it("should return empty array", async () => {
      const result = await service.getProjects();
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should accept options parameter", async () => {
      const result = await service.getProjects({
        featuredOnly: true,
        limit: 5,
        sort: "newest",
      });
      expect(result).toEqual([]);
    });

    it("should log warning", async () => {
      await service.getProjects();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("NullDataService: getProjects()")
      );
    });
  });

  describe("getFeaturedProjects()", () => {
    it("should return empty array", async () => {
      const result = await service.getFeaturedProjects();
      expect(result).toEqual([]);
    });

    it("should accept limit parameter", async () => {
      const result = await service.getFeaturedProjects(10);
      expect(result).toEqual([]);
    });

    it("should log warning", async () => {
      await service.getFeaturedProjects();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("NullDataService: getFeaturedProjects()")
      );
    });
  });

  describe("getSections()", () => {
    it("should return empty array", async () => {
      const result = await service.getSections();
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should accept uid parameter", async () => {
      const result = await service.getSections("about");
      expect(result).toEqual([]);
    });

    it("should log warning", async () => {
      await service.getSections();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("NullDataService: getSections()")
      );
    });
  });

  describe("getHomePage()", () => {
    it("should return null", async () => {
      const result = await service.getHomePage();
      expect(result).toBeNull();
    });
  });

  describe("getAllProjectSlugs()", () => {
    it("should return empty array", async () => {
      const result = await service.getAllProjectSlugs();
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should log warning", async () => {
      await service.getAllProjectSlugs();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("NullDataService: getAllProjectSlugs()")
      );
    });
  });

  describe("getProjectBySlug()", () => {
    it("should return null", async () => {
      const result = await service.getProjectBySlug("test-slug");
      expect(result).toBeNull();
    });

    it("should accept slug parameter", async () => {
      const result = await service.getProjectBySlug("any-slug");
      expect(result).toBeNull();
    });

    it("should log warning", async () => {
      await service.getProjectBySlug("test");
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("NullDataService: getProjectBySlug()")
      );
    });
  });

  describe("isReady()", () => {
    it("should return false", async () => {
      const result = await service.isReady();
      expect(result).toBe(false);
    });

    it("should log warning", async () => {
      await service.isReady();
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("NullDataService: isReady()")
      );
    });
  });

  describe("graceful degradation", () => {
    it("all methods should be non-throwing", async () => {
      expect(() => service.getProfile()).not.toThrow();
      expect(() => service.getProjects()).not.toThrow();
      expect(() => service.getFeaturedProjects()).not.toThrow();
      expect(() => service.getProjectBySlug("any")).not.toThrow();
      expect(() => service.getSections()).not.toThrow();
      expect(() => service.getHomePage()).not.toThrow();
      expect(() => service.getAllProjectSlugs()).not.toThrow();
      expect(() => service.isReady()).not.toThrow();
    });

    it("should enable fallback UI rendering", async () => {
      const profile = await service.getProfile();
      const projects = await service.getProjects();
      const featured = await service.getFeaturedProjects();

      const sections = await service.getSections();
      const homePage = await service.getHomePage();
      const slugs = await service.getAllProjectSlugs();

      expect(profile).toBeNull();
      expect(projects.length).toBe(0);
      expect(featured.length).toBe(0);
      expect(sections.length).toBe(0);
      expect(homePage).toBeNull();
      expect(slugs.length).toBe(0);
    });
  });
});
