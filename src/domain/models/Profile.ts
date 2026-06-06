import { ProfileAvatar, SkillTag, FetchError, FetchErrorCode } from "../types";

export interface IProfile {
  name: string;
  title: string;
  bio: string;
  avatar: ProfileAvatar | null;
  greeting: string | null;
  heroName: string | null;
  ctaPrimaryLabel: string | null;
  ctaPrimaryHref: string | null;
  ctaSecondaryLabel: string | null;
  ctaSecondaryHref: string | null;
  resumeUrl: string | null;
  technologies: SkillTag[];
}

export class Profile implements IProfile {
  readonly name: string;
  readonly title: string;
  readonly bio: string;
  readonly avatar: ProfileAvatar | null;
  readonly greeting: string | null;
  readonly heroName: string | null;
  readonly ctaPrimaryLabel: string | null;
  readonly ctaPrimaryHref: string | null;
  readonly ctaSecondaryLabel: string | null;
  readonly ctaSecondaryHref: string | null;
  readonly resumeUrl: string | null;
  readonly technologies: SkillTag[];

  constructor(data: IProfile) {
    Profile.validate(data);
    this.name = data.name.trim();
    this.title = data.title.trim();
    this.bio = data.bio.trim();
    this.avatar = data.avatar;
    this.greeting = data.greeting;
    this.heroName = data.heroName;
    this.ctaPrimaryLabel = data.ctaPrimaryLabel;
    this.ctaPrimaryHref = data.ctaPrimaryHref;
    this.ctaSecondaryLabel = data.ctaSecondaryLabel;
    this.ctaSecondaryHref = data.ctaSecondaryHref;
    this.resumeUrl = data.resumeUrl;
    this.technologies = data.technologies;
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
}
