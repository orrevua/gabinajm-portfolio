/**
 * Domain Model: Profile
 * Represents the portfolio owner's professional profile.
 * Validated and immutable at runtime.
 */

import { ProfileAvatar, FetchError, FetchErrorCode } from "../types";

export interface IProfile {
  name: string;
  title: string;
  bio: string;
  avatar: ProfileAvatar | null;
}

/**
 * Profile domain model with validation logic
 */
export class Profile implements IProfile {
  readonly name: string;
  readonly title: string;
  readonly bio: string;
  readonly avatar: ProfileAvatar | null;

  constructor(data: IProfile) {
    Profile.validate(data);
    this.name = data.name.trim();
    this.title = data.title.trim();
    this.bio = data.bio.trim();
    this.avatar = data.avatar;
  }

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
  }

  static tryCreate(data: unknown): Profile | null {
    try {
      return new Profile(data as IProfile);
    } catch (error) {
      console.warn("Profile validation failed:", error);
      return null;
    }
  }
}
