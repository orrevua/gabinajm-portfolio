/**
 * DataService Interface
 * Abstraction contract for CMS data access.
 * Decouples domain logic from specific CMS implementations (Sanity, Contentful, etc).
 * This interface enables seamless swapping of CMS backends.
 */

import { Profile } from "../models/Profile";
import { Project } from "../models/Project";
import { Section } from "../models/Section";
import type { PortableTextBlock, SocialLink, ProfileAvatar, SkillTag, ExperienceCompany } from "../types";

export interface HomePage {
  greeting?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  aboutHeading?: string;
  aboutBody?: string;
  showResume?: boolean;
  showSkills?: boolean;
  technologies?: SkillTag[];
  projectsHeading?: string;
  maxProjects?: number;
  experienceHeading?: string;
  pastExperience?: ExperienceCompany[];
  socialLinks?: SocialLink[];
  resumeUrl?: string;
  contactHeading?: string;
  contactSubtitle?: string;
  availabilityText?: string;
  showForm?: boolean;
  videoHeading?: string;
  videoSubtitle?: string;
  videoUrl?: string;
  videoExternalUrl?: string;
  videoPoster?: {
    asset: { url: string; lqip?: string };
    alt?: string;
  };
  videoAutoplay?: boolean;
  videoLoop?: boolean;
  videoMuted?: boolean;
}

export interface AboutPageValue {
  title: string;
  description: string;
}

export interface AboutPageSkillChip {
  label: string;
  iconUrl?: string;
  color: string;
}

export interface AboutPage {
  bioHeading: string | null;
  bio: PortableTextBlock[] | null;
  heroImage: ProfileAvatar | null;
  socialLinks: SocialLink[];
  resumeUrl: string | null;
  valuesHeading: string | null;
  values: AboutPageValue[];
  skillChips: AboutPageSkillChip[];
}

/**
 * Core data access service interface.
 * Implementations must handle:
 * - Fetching from configured CMS
 * - Mapping CMS data to domain models
 * - Error handling with graceful degradation
 * - Caching strategies (optional, per implementation)
 */
export interface IDataService {
  /**
   * Retrieve the portfolio owner's profile.
   * @returns Profile or null if not found/fetch fails
   * @throws FetchError only in critical failures
   */
  getProfile(locale?: string): Promise<Profile | null>;

  getProjects(options?: {
    featuredOnly?: boolean;
    limit?: number;
    sort?: "newest" | "oldest" | "featured";
    locale?: string;
  }): Promise<Project[]>;

  getFeaturedProjects(limit?: number, locale?: string): Promise<Project[]>;

  getProjectBySlug(slug: string, locale?: string): Promise<Project | null>;

  getSections(uid?: string, locale?: string): Promise<Section[]>;

  getSectionsByPage(page: string, locale?: string): Promise<Section[]>;

  getHomePage(): Promise<HomePage | null>;

  getAboutPage(locale?: string): Promise<AboutPage | null>;

  getAllProjectSlugs(): Promise<string[]>;

  isReady(): Promise<boolean>;
}

/**
 * Default no-op implementation for testing and graceful degradation.
 * Used as fallback when primary service fails.
 */
export class NullDataService implements IDataService {
  async getProfile(): Promise<Profile | null> {
    console.warn("NullDataService: getProfile() returning null");
    return null;
  }

  async getProjects(_options?: {
    featuredOnly?: boolean;
    limit?: number;
    sort?: "newest" | "oldest" | "featured";
  }): Promise<Project[]> {
    console.warn("NullDataService: getProjects() returning empty array");
    return [];
  }

  async getFeaturedProjects(_limit?: number): Promise<Project[]> {
    console.warn("NullDataService: getFeaturedProjects() returning empty array");
    return [];
  }

  async getProjectBySlug(_slug: string): Promise<Project | null> {
    console.warn("NullDataService: getProjectBySlug() returning null");
    return null;
  }

  async getSections(_uid?: string): Promise<Section[]> {
    console.warn("NullDataService: getSections() returning empty array");
    return [];
  }

  async getSectionsByPage(_page: string): Promise<Section[]> {
    return [];
  }

  async getHomePage(): Promise<HomePage | null> {
    return null;
  }

  async getAboutPage(_locale?: string): Promise<AboutPage | null> {
    return null;
  }

  async getAllProjectSlugs(): Promise<string[]> {
    console.warn("NullDataService: getAllProjectSlugs() returning empty array");
    return [];
  }

  async isReady(): Promise<boolean> {
    console.warn("NullDataService: isReady() returning false");
    return false;
  }
}
