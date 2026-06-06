import { SocialLink, ProfileAvatar, ExperienceCompany, SkillTag, FetchError, FetchErrorCode } from "../types";

export interface IProfile {
  name: string;
  title: string;
  bio: string;
  avatar: ProfileAvatar | null;
  socialLinks: SocialLink[];
  resumeUrl: string | null;
  technologies: SkillTag[];
  pastExperience: ExperienceCompany[];
}

export class Profile implements IProfile {
  readonly name: string;
  readonly title: string;
  readonly bio: string;
  readonly avatar: ProfileAvatar | null;
  readonly socialLinks: SocialLink[];
  readonly resumeUrl: string | null;
  readonly technologies: SkillTag[];
  readonly pastExperience: ExperienceCompany[];

  constructor(data: IProfile) {
    Profile.validate(data);
    this.name = data.name.trim();
    this.title = data.title.trim();
    this.bio = data.bio.trim();
    this.avatar = data.avatar;
    this.socialLinks = data.socialLinks;
    this.resumeUrl = data.resumeUrl;
    this.technologies = data.technologies;
    this.pastExperience = data.pastExperience || [];
  }

  private static validate(data: unknown): asserts data is IProfile {
    if (!data || typeof data !== "object") {
      throw new FetchError(FetchErrorCode.INVALID_DATA, "Profile data must be a non-null object", 400);
    }
    const p = data as Record<string, unknown>;
    if (!p.name || typeof p.name !== "string")
      throw new FetchError(FetchErrorCode.INVALID_DATA, "Profile name is required", 400);
    if (!p.title || typeof p.title !== "string")
      throw new FetchError(FetchErrorCode.INVALID_DATA, "Profile title is required", 400);
    if (!p.bio || typeof p.bio !== "string")
      throw new FetchError(FetchErrorCode.INVALID_DATA, "Profile bio is required", 400);
    if (!Array.isArray(p.socialLinks))
      throw new FetchError(FetchErrorCode.INVALID_DATA, "socialLinks must be an array", 400);
    if (!Array.isArray(p.technologies))
      throw new FetchError(FetchErrorCode.INVALID_DATA, "technologies must be an array", 400);
  }

  static tryCreate(data: unknown): Profile | null {
    try {
      return new Profile(data as IProfile);
    } catch (error) {
      console.warn("Profile validation failed:", error);
      return null;
    }
  }

  getResumeUrl(): string | null {
    return this.resumeUrl;
  }

  getSocialLinks(): SocialLink[] {
    const priority: Record<string, number> = { github: 1, linkedin: 2, twitter: 3, email: 4 };
    return [...this.socialLinks].sort(
      (a, b) => (priority[a.platform] || 99) - (priority[b.platform] || 99)
    );
  }
}
