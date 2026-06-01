/**
 * Domain Model: Project
 * Represents a portfolio project with all metadata.
 * Validated and immutable at runtime.
 */

import {
  Technology,
  ProjectImage,
  ContentSection,
  FetchError,
  FetchErrorCode,
  type RichTextBody,
} from "../types";

export interface IProject {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  description: RichTextBody;
  mainImage: ProjectImage | null;
  mainImageSize: "small" | "medium" | "large" | "full" | null;
  mainImageCrop?: "top" | "center" | "bottom" | "full" | null;
  technologies: Technology[];
  link: string | null;
  repository: string | null;
  cardColor: { bg: string; fg: string; border: string } | null;
  cardStyle: "large" | "small";
  heroColor: string | null;
  contentSections: ContentSection[];
  isProtected: boolean;
  featured: boolean;
  publishedAt: Date;
}

export class Project implements IProject {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string | null;
  readonly slug: string;
  readonly description: RichTextBody;
  readonly mainImage: ProjectImage | null;
  readonly mainImageSize: "small" | "medium" | "large" | "full" | null;
  readonly mainImageCrop: "top" | "center" | "bottom" | "full" | null;
  readonly technologies: Technology[];
  readonly link: string | null;
  readonly repository: string | null;
  readonly cardColor: { bg: string; fg: string; border: string } | null;
  readonly cardStyle: "large" | "small";
  readonly heroColor: string | null;
  readonly contentSections: ContentSection[];
  readonly isProtected: boolean;
  readonly featured: boolean;
  readonly publishedAt: Date;

  constructor(data: IProject) {
    Project.validate(data);
    this.id = data.id;
    this.title = data.title.trim();
    this.subtitle = data.subtitle ? data.subtitle.trim() : null;
    this.slug = data.slug.trim().toLowerCase();
    this.description = typeof data.description === "string" ? data.description.trim() : data.description;
    this.mainImage = data.mainImage;
    this.mainImageSize = data.mainImageSize || "large";
    this.mainImageCrop = data.mainImageCrop || null;
    this.technologies = data.technologies;
    this.link = data.link ? data.link.trim() : null;
    this.repository = data.repository ? data.repository.trim() : null;
    this.cardColor = data.cardColor || null;
    this.cardStyle = data.cardStyle || "large";
    this.heroColor = data.heroColor || null;
    this.contentSections = data.contentSections || [];
    this.isProtected = !!data.isProtected;
    this.featured = data.featured;
    this.publishedAt = new Date(data.publishedAt);
  }

  /**
   * Validates project data structure and constraints
   * @throws FetchError if validation fails
   */
  private static validate(data: unknown): asserts data is IProject {
    if (!data || typeof data !== "object") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Project data must be a non-null object",
        400
      );
    }

    const project = data as Record<string, unknown>;

    if (!project.id || typeof project.id !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Project id is required and must be a string",
        400
      );
    }

    if (!project.title || typeof project.title !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Project title is required and must be a string",
        400
      );
    }

    if (!project.slug || typeof project.slug !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Project slug is required and must be a string",
        400
      );
    }

    if (!project.description) {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "Project description is required",
        400
      );
    }

    if (!Array.isArray(project.technologies)) {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "technologies must be an array",
        400
      );
    }

    if (!(project.publishedAt instanceof Date) && typeof project.publishedAt !== "string") {
      throw new FetchError(
        FetchErrorCode.INVALID_DATA,
        "publishedAt must be a valid Date or ISO string",
        400
      );
    }
  }

  /**
   * Graceful constructor for partial/nullable data
   * Returns null if data is insufficient
   */
  static tryCreate(data: unknown): Project | null {
    try {
      return new Project(data as IProject);
    } catch (error) {
      console.warn("Project validation failed:", error);
      return null;
    }
  }

  /**
   * Check if project is live (has link or repository)
   */
  isLive(): boolean {
    return !!(this.link || this.repository);
  }

  /**
   * Get primary project URL (link or repository)
   */
  getPrimaryUrl(): string | null {
    return this.link || this.repository;
  }

  /**
   * Get formatted publication date
   */
  getFormattedDate(locale: string = "en-US"): string {
    return this.publishedAt.toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
    });
  }

  /**
   * Get unique technology names
   */
  getTechnologyNames(): string[] {
    return [...new Set(this.technologies.map((t) => t.name))];
  }

  /**
   * Check if project contains a specific technology
   */
  hasTechnology(techName: string): boolean {
    return this.technologies.some(
      (t) => t.name.toLowerCase() === techName.toLowerCase()
    );
  }
}
