/**
 * Domain Model: Profile
 * Represents the portfolio owner's professional profile.
 * Validated and immutable at runtime.
 */

import { SocialLink, ProfileAvatar, ExperienceCompany, PortableTextBlock, SkillTag, FetchError, FetchErrorCode } from "../types";

export interface IProfile {
  name: string;
  title: string;
  bio: string;
  aboutBio: PortableTextBlock[] | null;
  avatar: ProfileAvatar | null;
  aboutHeroImage?: ProfileAvatar | null;
  socialLinks: SocialLink[];
  resumeUrl: string | null;
  technologies: SkillTag[];
  pastExperience: ExperienceCompany[];
  getResumeUrl?: () => string | null;
  getSocialLinks?: () => SocialLink[];
}

/**
 * Profile domain model with validation logic
 */
export class Profile implements IProfile {
  readonly name: string;
  readonly title: string;
  readonly bio: string;
  readonly aboutBio: PortableTextBlock[] | null;
  readonly avatar: ProfileAvatar | null;
  readonly aboutHeroImage: ProfileAvatar | null;
  readonly socialLinks: SocialLink[];
  readonly resumeUrl: string | null;
  readonly technologies: SkillTag[];
  readonly pastExperience: ExperienceCompany[];

  constructor(data: IProfile) {
    Profile.validate(data);
    this.name = data.name.trim();
    this.title = data.title.trim();
    this.bio = data.bio.trim();
    this.aboutBio = Array.isArray(data.aboutBio) && data.aboutBio.length > 0
      ? data.aboutBio
      : null;
    this.avatar = data.avatar;
    this.aboutHeroImage = data.aboutHeroImage ?? null;
    this.socialLinks = data.socialLinks;
    this.resumeUrl = data.resumeUrl;
    this.technologies = data.technologies;
    this.pastExperience = data.pastExperience || [];
  }

  /**
   * Validates profile data structure and constraints
   * @throws FetchError if validation fails
   */
  private static validate(data: unknown): asserts data is IProfile {
    if (!data || typeof data !== "object") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Profile data must be a non-null object",
        400
      );
    }

    const profile = data as Record<string, unknown>;

    if (!profile.name || typeof profile.name !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Profile name is required and must be a string",
        400
      );
    }

    if (!profile.title || typeof profile.title !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Profile title is required and must be a string",
        400
      );
    }

    if (!profile.bio || typeof profile.bio !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Profile bio is required and must be a string",
        400
      );
    }

    if (!Array.isArray(profile.socialLinks)) {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "socialLinks must be an array",
        400
      );
    }

    if (!Array.isArray(profile.technologies)) {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "technologies must be an array",
        400
      );
    }
  }

  /**
   * Graceful constructor for partial/nullable data
   * Returns null if data is insufficient
   */
  static tryCreate(data: unknown): Profile | null {
    try {
      return new Profile(data as IProfile);
    } catch (error) {
      console.warn("Profile validation failed:", error);
      return null;
    }
  }

  /**
   * Get resume download URL or null if not available
   */
  getResumeUrl(): string | null {
    return this.resumeUrl;
  }

  /**
   * Get sorted social links by priority
   */
  getSocialLinks(): SocialLink[] {
    const priority: Record<string, number> = {
      github: 1,
      linkedin: 2,
      twitter: 3,
      email: 4,
    };
    return [...this.socialLinks].sort(
      (a, b) => (priority[a.platform] || 99) - (priority[b.platform] || 99)
    );
  }
}
