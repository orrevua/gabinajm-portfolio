/**
 * Unit tests for Profile domain model
 */

import { describe, it, expect, beforeEach } from "vitest";
import { Profile, IProfile } from "../../domain/models/Profile";
import { FetchError } from "../../domain/types";

describe("Profile Model", () => {
  let validProfile: IProfile;

  beforeEach(() => {
    validProfile = {
      name: "Gabi Silva",
      title: "Full-Stack Engineer",
      bio: "Passionate about building elegant solutions",
      avatar: {
        asset: {
          url: "https://example.com/avatar.jpg",
          alt: "Profile avatar",
          lqip: "data:image/jpeg;base64,/9j/...",
        },
        alt: "Profile avatar",
      },
      socialLinks: [{ platform: "github", url: "https://github.com/gabi" }],
      resumeUrl: null,
      technologies: [{ name: "React" }],
      pastExperience: [],
    };
  });

  describe("constructor", () => {
    it("should create a valid Profile instance", () => {
      const profile = new Profile(validProfile);
      expect(profile.name).toBe("Gabi Silva");
      expect(profile.title).toBe("Full-Stack Engineer");
      expect(profile.bio).toBe("Passionate about building elegant solutions");
    });

    it("should trim whitespace from name, title, and bio", () => {
      const profile = new Profile({
        ...validProfile,
        name: "  Gabi  ",
        title: "  Engineer  ",
        bio: "  Bio  ",
      });
      expect(profile.name).toBe("Gabi");
      expect(profile.title).toBe("Engineer");
      expect(profile.bio).toBe("Bio");
    });

    it("should handle null avatar gracefully", () => {
      const profile = new Profile({ ...validProfile, avatar: null });
      expect(profile.avatar).toBeNull();
    });

    it("should throw FetchError when name is missing", () => {
      expect(() => {
        new Profile({ ...validProfile, name: "" });
      }).toThrow(FetchError);
    });

    it("should throw FetchError when title is missing", () => {
      expect(() => {
        new Profile({ ...validProfile, title: "" });
      }).toThrow(FetchError);
    });

    it("should throw FetchError when bio is missing", () => {
      expect(() => {
        new Profile({ ...validProfile, bio: "" });
      }).toThrow(FetchError);
    });

    it("should throw FetchError when data is null", () => {
      expect(() => {
        new Profile(null as any);
      }).toThrow(FetchError);
    });
  });

  describe("static tryCreate()", () => {
    it("should return Profile instance for valid data", () => {
      const profile = Profile.tryCreate(validProfile);
      expect(profile).toBeInstanceOf(Profile);
      expect(profile?.name).toBe("Gabi Silva");
    });

    it("should return null for invalid data", () => {
      const profile = Profile.tryCreate({
        ...validProfile,
        name: "",
      });
      expect(profile).toBeNull();
    });

    it("should return null for null input", () => {
      const profile = Profile.tryCreate(null);
      expect(profile).toBeNull();
    });
  });

  describe("immutability", () => {
    it("should not allow name reassignment", () => {
      const profile = new Profile(validProfile);
      expect(profile.name).toBe("Gabi Silva");
    });
  });
});
