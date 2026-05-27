import { describe, it, expect, beforeEach } from "vitest";
import { Section, ISection } from "../../domain/models/Section";
import { FetchError } from "../../domain/types";

describe("Section Model", () => {
  let validSection: ISection;

  beforeEach(() => {
    validSection = {
      id: "sec-001",
      uid: "about",
      title: "About Me",
      subtitle: "Get to know me",
      content: [{ _type: "block", children: [] }],
      background: null,
      overlay: "none",
      padding: "medium",
      order: 1,
    };
  });

  describe("constructor", () => {
    it("should create a valid Section instance", () => {
      const section = new Section(validSection);
      expect(section.id).toBe("sec-001");
      expect(section.uid).toBe("about");
      expect(section.title).toBe("About Me");
      expect(section.subtitle).toBe("Get to know me");
      expect(section.order).toBe(1);
    });

    it("should trim and lowercase uid", () => {
      const section = new Section({ ...validSection, uid: "  ABOUT  " });
      expect(section.uid).toBe("about");
    });

    it("should trim title", () => {
      const section = new Section({ ...validSection, title: "  Title  " });
      expect(section.title).toBe("Title");
    });

    it("should handle null subtitle", () => {
      const section = new Section({ ...validSection, subtitle: null });
      expect(section.subtitle).toBeNull();
    });

    it("should handle empty subtitle as null", () => {
      const section = new Section({ ...validSection, subtitle: "   " });
      expect(section.subtitle).toBeNull();
    });

    it("should throw FetchError when id is missing", () => {
      expect(() => new Section({ ...validSection, id: "" })).toThrow(FetchError);
    });

    it("should throw FetchError when uid is missing", () => {
      expect(() => new Section({ ...validSection, uid: "" })).toThrow(FetchError);
    });

    it("should throw FetchError when title is missing", () => {
      expect(() => new Section({ ...validSection, title: "" })).toThrow(FetchError);
    });

    it("should throw FetchError when content is not an array", () => {
      expect(() => new Section({ ...validSection, content: {} as any })).toThrow(FetchError);
    });

    it("should throw FetchError when data is null", () => {
      expect(() => new Section(null as any)).toThrow(FetchError);
    });
  });

  describe("tryCreate", () => {
    it("should return Section for valid data", () => {
      const section = Section.tryCreate(validSection);
      expect(section).toBeInstanceOf(Section);
    });

    it("should return null for invalid data", () => {
      const section = Section.tryCreate({ ...validSection, id: "" });
      expect(section).toBeNull();
    });

    it("should return null for null input", () => {
      expect(Section.tryCreate(null)).toBeNull();
    });
  });

  describe("background methods", () => {
    it("hasBackground() should return false when background is null", () => {
      const section = new Section(validSection);
      expect(section.hasBackground()).toBe(false);
    });

    it("hasBackground() should return true when background exists", () => {
      const section = new Section({
        ...validSection,
        background: { type: "color", color: "#ff0000" },
      });
      expect(section.hasBackground()).toBe(true);
    });

    it("hasColorBackground() should return true for color background", () => {
      const section = new Section({
        ...validSection,
        background: { type: "color", color: "#ff0000" },
      });
      expect(section.hasColorBackground()).toBe(true);
      expect(section.hasImageBackground()).toBe(false);
    });

    it("hasImageBackground() should return true for image background", () => {
      const section = new Section({
        ...validSection,
        background: {
          type: "image",
          imageUrl: "https://example.com/bg.jpg",
          imageLqip: "",
          imageAlt: "Background",
        },
      });
      expect(section.hasImageBackground()).toBe(true);
      expect(section.hasColorBackground()).toBe(false);
    });

    it("hasColorBackground() should return false when no background", () => {
      const section = new Section(validSection);
      expect(section.hasColorBackground()).toBe(false);
    });

    it("hasImageBackground() should return false when no background", () => {
      const section = new Section(validSection);
      expect(section.hasImageBackground()).toBe(false);
    });
  });
});
