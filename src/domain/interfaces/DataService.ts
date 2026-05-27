/**
 * DataService Interface
 * Abstraction contract for CMS data access.
 * Decouples domain logic from specific CMS implementations (Sanity, Contentful, etc).
 * This interface enables seamless swapping of CMS backends.
 */

import { Profile } from "../models/Profile";
import { Project } from "../models/Project";
import { Section } from "../models/Section";

export interface HomePageSection {
  _type: string;
  _key: string;
  greeting?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  heading?: string;
  body?: string;
  showResume?: boolean;
  showSkills?: boolean;
  maxProjects?: number;
  availabilityText?: string;
  showForm?: boolean;
  subtitle?: string;
  videoUrl?: string;
  externalUrl?: string;
  poster?: {
    asset: { url: string; lqip?: string };
    alt?: string;
  };
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface HomePage {
  sections: HomePageSection[];
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
  getProfile(): Promise<Profile | null>;

  /**
   * Retrieve all published projects.
   * Optionally filtered and sorted.
   * @param options - Query options (featured only, limit, sort)
   * @returns Array of Project objects (empty if none found)
   * @throws FetchError only in critical failures
   */
  getProjects(options?: {
    featuredOnly?: boolean;
    limit?: number;
    sort?: "newest" | "oldest" | "featured";
  }): Promise<Project[]>;

  /**
   * Retrieve featured projects (subset of getProjects).
   * Used for homepage display.
   * @param limit - Max number of projects to return (default: 3)
   * @returns Array of featured Project objects
   * @throws FetchError only in critical failures
   */
  getFeaturedProjects(limit?: number): Promise<Project[]>;

  /**
   * Retrieve a single project by slug.
   * @param slug - Project slug (URL-friendly identifier)
   * @returns Project or null if not found
   * @throws FetchError only in critical failures
   */
  getProjectBySlug(slug: string): Promise<Project | null>;

  getSections(uid?: string): Promise<Section[]>;

  getHomePage(): Promise<HomePage | null>;

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

  async getHomePage(): Promise<HomePage | null> {
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
