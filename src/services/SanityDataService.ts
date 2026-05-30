/**
 * SanityDataService
 * Implements IDataService interface using Sanity CMS as backend
 * Handles GROQ queries, data mapping to domain models, and error handling
 */

import { IDataService, type HomePage, type HomePageSection } from "@domain/interfaces/DataService";
import {
  Profile,
  Project,
  Section,
  type SocialLink,
  type SocialPlatform,
  type Technology,
  type SectionBackground,
  type SectionPadding,
  type SectionOverlay,
} from "@domain";
import {
  getSanityClient,
  checkSanityHealth,
  type SanityConfig,
} from "./sanityClient";
import {
  PROFILE_QUERY,
  PROJECTS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  ALL_PROJECT_SLUGS_QUERY,
  SECTIONS_QUERY,
  HOME_PAGE_QUERY,
} from "./sanityQueries";

/**
 * Raw Sanity document types before mapping to domain models
 */
function loc<T>(en: T, pt: T | undefined | null, locale: string): T {
  return locale === "pt" && pt != null ? pt : en;
}

interface SanityProfile {
  _id: string;
  name: string;
  title: string;
  title_pt?: string;
  bio: string;
  bio_pt?: string;
  aboutBio?: string;
  aboutBio_pt?: string;
  avatar?: {
    asset?: {
      url: string;
      lqip?: string;
    };
    alt?: string;
  };
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  resumeUrl?: string;
  technologies?: string[];
  pastExperience?: Array<{
    name: string;
    logo?: {
      asset?: { url: string; lqip?: string };
      alt?: string;
    };
  }>;
}

interface SanityProject {
  _id: string;
  title: string;
  title_pt?: string;
  subtitle?: string;
  subtitle_pt?: string;
  slug: {
    current: string;
  };
  description: string;
  description_pt?: string;
  mainImageSize?: string;
  mainImage?: {
    asset?: {
      _id?: string;
      url: string;
      lqip?: string;
    };
    assetRef?: string;
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    hotspot?: {
      x: number;
      y: number;
      height: number;
      width: number;
    };
    alt?: string;
  };
  technologies?: Array<{
    name: string;
    category: string;
  }>;
  link?: string;
  repository?: string;
  cardColor?: {
    bg?: string;
    fg?: string;
    border?: string;
  };
  cardStyle?: "large" | "small";
  mainImageCrop?: string;
  heroColor?: string;
  contentSections?: Array<{
    _type: string;
    _key: string;
    sectionLabel?: string;
    sectionLabel_pt?: string;
    heading?: string;
    body?: string;
    body_pt?: string;
    bullets?: unknown[];
    bullets_pt?: unknown[];
    bgColor?: string;
    textColor?: string;
    subtitle?: string;
    subtitle_pt?: string;
    caption?: string;
    caption_pt?: string;
    columns?: number;
    metric?: string;
    label?: string;
    alt?: string;
    image?: { asset?: { url: string; lqip?: string }; alt?: string };
    images?: Array<{ asset?: { url: string; lqip?: string }; alt?: string }>;
    cards?: Array<{ metric: string; label: string; label_pt?: string }>;
    videoUrl?: string;
    externalUrl?: string;
    poster?: { asset?: { url: string; lqip?: string }; alt?: string };
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
  }>;
  isProtected?: boolean;
  featured: boolean;
  publishedAt: string;
}

interface SanityProjectSlug {
  slug: {
    current: string;
  };
}

interface SanitySection {
  _id: string;
  uid: { current: string };
  title: string;
  title_pt?: string;
  subtitle?: string;
  subtitle_pt?: string;
  content?: unknown[];
  background?: {
    type?: string;
    color?: string;
    image?: {
      asset?: {
        url: string;
        lqip?: string;
      };
    };
    imageAlt?: string;
  };
  overlay?: boolean;
  padding?: string;
  order?: number;
}

const isSocialPlatform = (platform: string): platform is SocialPlatform => {
  return platform === "github" ||
    platform === "linkedin" ||
    platform === "twitter" ||
    platform === "email" ||
    platform === "instagram";
};

const normalizeCategory = (category: string): Technology["category"] => {
  if (category === "Frontend" || category === "Backend" || category === "DevOps") {
    return category;
  }

  return "Other";
};

/**
 * Maps Sanity profile document to domain Profile model
 * Handles null/missing fields gracefully
 */
function mapSanityProfileToModel(sanityProfile: SanityProfile, locale: string = "en"): Profile {
  const socialLinks: SocialLink[] = (sanityProfile.socialLinks || [])
    .filter((link): link is SocialLink => isSocialPlatform(link.platform))
    .map((link) => ({
      platform: link.platform,
      url: link.url,
    }));

  return new Profile({
    name: sanityProfile.name,
    title: loc(sanityProfile.title, sanityProfile.title_pt, locale),
    bio: loc(sanityProfile.bio, sanityProfile.bio_pt, locale),
    aboutBio: loc(sanityProfile.aboutBio || null, sanityProfile.aboutBio_pt, locale),
    avatar: sanityProfile.avatar
      ? {
          asset: {
            url: sanityProfile.avatar.asset?.url || "",
            alt: sanityProfile.avatar.alt || "",
            lqip: sanityProfile.avatar.asset?.lqip || "",
          },
          alt: sanityProfile.avatar.alt || "",
        }
      : null,
    socialLinks,
    resumeUrl: sanityProfile.resumeUrl || null,
    technologies: sanityProfile.technologies || [],
    pastExperience: (sanityProfile.pastExperience || []).map((exp) => ({
      name: exp.name,
      logo: {
        url: exp.logo?.asset?.url || "",
        alt: exp.logo?.alt || exp.name,
        lqip: exp.logo?.asset?.lqip || "",
      },
    })),
  });
}

/**
 * Maps Sanity project document to domain Project model
 * Handles null/missing fields gracefully
 */
function mapSanityProjectToModel(sanityProject: SanityProject, locale: string = "en"): Project {
  const technologies: Technology[] = (sanityProject.technologies || []).map((tech) => ({
    name: tech.name,
    category: normalizeCategory(tech.category),
  }));

  return new Project({
    id: sanityProject._id,
    title: loc(sanityProject.title, sanityProject.title_pt, locale),
    subtitle: loc(sanityProject.subtitle || null, sanityProject.subtitle_pt, locale),
    slug: sanityProject.slug.current,
    mainImageSize: (sanityProject.mainImageSize as "small" | "medium" | "large" | "full") || null,
    description: loc(sanityProject.description, sanityProject.description_pt, locale),
    mainImage: sanityProject.mainImage
      ? {
          asset: {
            id: sanityProject.mainImage.asset?._id,
            url: sanityProject.mainImage.asset?.url || "",
            alt: sanityProject.mainImage.alt || "",
            lqip: sanityProject.mainImage.asset?.lqip || "",
          },
          alt: sanityProject.mainImage.alt || "",
          lqip: sanityProject.mainImage.asset?.lqip || "",
          assetRef: sanityProject.mainImage.assetRef,
          crop: sanityProject.mainImage.crop,
          hotspot: sanityProject.mainImage.hotspot,
        }
      : null,
    mainImageCrop: (sanityProject.mainImageCrop as "top" | "center" | "bottom" | "full") || null,
    technologies,
    link: sanityProject.link || null,
    repository: sanityProject.repository || null,
    cardColor: sanityProject.cardColor?.bg
      ? {
          bg: sanityProject.cardColor.bg,
          fg: sanityProject.cardColor.fg || "#3d0038",
          border: sanityProject.cardColor.border || "#3d0038",
        }
      : null,
    cardStyle: sanityProject.cardStyle || "large",
    heroColor: sanityProject.heroColor || null,
    isProtected: !!sanityProject.isProtected,
    contentSections: (sanityProject.contentSections || []).map((s) => ({
      _type: s._type,
      _key: s._key,
      sectionLabel: loc(s.sectionLabel, s.sectionLabel_pt, locale),
      heading: s.heading,
      body: loc(s.body, s.body_pt, locale),
      bullets: loc(s.bullets as string[] | undefined, s.bullets_pt as string[] | undefined, locale),
      bgColor: s.bgColor,
      textColor: s.textColor,
      subtitle: loc(s.subtitle, s.subtitle_pt, locale),
      caption: loc(s.caption, s.caption_pt, locale),
      columns: s.columns,
      alt: s.alt,
      image: s.image,
      images: s.images,
      cards: s.cards?.map((c) => ({
        metric: c.metric,
        label: loc(c.label, c.label_pt, locale),
      })),
      videoUrl: s.videoUrl,
      externalUrl: s.externalUrl,
      poster: s.poster,
      autoplay: s.autoplay,
      loop: s.loop,
      muted: s.muted,
    })),
    featured: sanityProject.featured,
    publishedAt: new Date(sanityProject.publishedAt),
  });
}

const PADDING_MAP: Record<string, SectionPadding> = {
  "py-0": "none",
  "py-8": "small",
  "py-16": "medium",
  "py-24": "large",
  "py-32": "large",
};

function normalizePadding(raw?: string): SectionPadding {
  if (!raw) return "medium";
  return PADDING_MAP[raw] ?? "medium";
}

function normalizeOverlay(raw?: boolean): SectionOverlay {
  return raw ? "dark" : "none";
}

function mapSanitySectionToModel(doc: SanitySection, locale: string = "en"): Section {
  let background: SectionBackground | null = null;

  if (doc.background?.type === "color" && doc.background.color) {
    background = { type: "color", color: doc.background.color };
  } else if (doc.background?.type === "image" && doc.background.image?.asset?.url) {
    background = {
      type: "image",
      imageUrl: doc.background.image.asset.url,
      imageLqip: doc.background.image.asset.lqip || "",
      imageAlt: doc.background.imageAlt || "",
    };
  }

  return new Section({
    id: doc._id,
    uid: doc.uid.current,
    title: loc(doc.title, doc.title_pt, locale),
    subtitle: loc(doc.subtitle || null, doc.subtitle_pt, locale),
    content: doc.content || [],
    background,
    overlay: normalizeOverlay(doc.overlay),
    padding: normalizePadding(doc.padding),
    order: doc.order ?? 0,
  });
}

/**
 * SanityDataService: Production implementation of IDataService
 * Fetches data from Sanity CMS and maps to domain models
 * Includes error handling and graceful degradation
 */
export class SanityDataService implements IDataService {
  private config: SanityConfig;

  constructor(config: SanityConfig) {
    this.config = config;
  }

  /**
   * Retrieve portfolio owner's profile
   * @returns Profile or null if not found or fetch fails
   */
  async getProfile(locale: string = "en"): Promise<Profile | null> {
    try {
      const client = getSanityClient();
      const sanityProfile = await client.fetch<SanityProfile | null>(
        PROFILE_QUERY
      );

      if (!sanityProfile) {
        console.warn("SanityDataService: Profile not found in CMS");
        return null;
      }

      return mapSanityProfileToModel(sanityProfile, locale);
    } catch (error) {
      console.error("SanityDataService: Failed to fetch profile", error);
      return null; // Graceful degradation
    }
  }

  /**
   * Retrieve all published projects with optional filters
   * @param options Query options (featuredOnly, limit, sort)
   * @returns Array of Project objects (empty if none found)
   */
  async getProjects(options?: {
    featuredOnly?: boolean;
    limit?: number;
    sort?: "newest" | "oldest" | "featured";
    locale?: string;
  }): Promise<Project[]> {
    try {
      const client = getSanityClient();

      // Select query based on options
      let query = PROJECTS_QUERY;
      if (options?.featuredOnly) {
        query = FEATURED_PROJECTS_QUERY;
      }

      const sanityProjects = await client.fetch<SanityProject[]>(query);

      if (!Array.isArray(sanityProjects)) {
        console.warn("SanityDataService: Projects query returned non-array");
        return [];
      }

      // Map to domain models
      const l = options?.locale || "en";
      let projects = sanityProjects
        .map((sp) => Project.tryCreate(mapSanityProjectToModel(sp, l)))
        .filter((project): project is Project => project !== null);

      // Apply limit if specified
      if (options?.limit && options.limit > 0) {
        projects = projects.slice(0, options.limit);
      }

      // Apply sort if specified (query already orders by date)
      if (options?.sort === "oldest") {
        projects = projects.reverse();
      }

      return projects;
    } catch (error) {
      console.error("SanityDataService: Failed to fetch projects", error);
      return []; // Graceful degradation
    }
  }

  /**
   * Retrieve featured projects (subset of getProjects)
   * Used for homepage display
   * @param limit Max number of projects to return (default: 3)
   * @returns Array of featured Project objects
   */
  async getFeaturedProjects(limit: number = 3, locale: string = "en"): Promise<Project[]> {
    return this.getProjects({
      featuredOnly: true,
      limit,
      sort: "newest",
      locale,
    });
  }

  /**
   * Retrieve a single project by slug
   * @param slug Project slug (URL-friendly identifier)
   * @returns Project or null if not found
   */
  async getProjectBySlug(slug: string, locale: string = "en"): Promise<Project | null> {
    try {
      if (!slug || typeof slug !== "string") {
        console.warn("SanityDataService: Invalid slug provided");
        return null;
      }

      const client = getSanityClient();
      const sanityProject = await client.fetch<SanityProject | null>(
        PROJECT_BY_SLUG_QUERY,
        { slug }
      );

      if (!sanityProject) {
        console.warn(`SanityDataService: Project with slug "${slug}" not found`);
        return null;
      }

      return mapSanityProjectToModel(sanityProject, locale);
    } catch (error) {
      console.error(
        `SanityDataService: Failed to fetch project by slug "${slug}"`,
        error
      );
      return null; // Graceful degradation
    }
  }

  /**
   * Retrieve all project slugs for static generation
   * Used in generateStaticParams() for dynamic routes
   * @returns Array of slug strings
   */
  async getAllProjectSlugs(): Promise<string[]> {
    try {
      const client = getSanityClient();
      const slugData = await client.fetch<SanityProjectSlug[]>(
        ALL_PROJECT_SLUGS_QUERY
      );

      if (!Array.isArray(slugData)) {
        console.warn("SanityDataService: Slugs query returned non-array");
        return [];
      }

      return slugData
        .map((item) => item.slug?.current)
        .filter((slug) => slug !== undefined && slug !== null) as string[];
    } catch (error) {
      console.error("SanityDataService: Failed to fetch project slugs", error);
      return [];
    }
  }

  async getSections(uid?: string, locale: string = "en"): Promise<Section[]> {
    try {
      const client = getSanityClient();
      const sanitySections = await client.fetch<SanitySection[]>(SECTIONS_QUERY);

      if (!Array.isArray(sanitySections)) {
        return [];
      }

      let sections = sanitySections
        .map((doc) => Section.tryCreate(mapSanitySectionToModel(doc, locale)))
        .filter((s): s is Section => s !== null);

      if (uid) {
        sections = sections.filter((s) => s.uid === uid.toLowerCase());
      }

      return sections;
    } catch (error) {
      console.error("SanityDataService: Failed to fetch sections", error);
      return [];
    }
  }

  async getHomePage(): Promise<HomePage | null> {
    try {
      const client = getSanityClient();
      const data = await client.fetch<{ _id: string; sections?: HomePageSection[] } | null>(HOME_PAGE_QUERY);
      if (!data || !data.sections) return null;
      return { sections: data.sections };
    } catch (error) {
      console.error("SanityDataService: Failed to fetch home page", error);
      return null;
    }
  }

  async isReady(): Promise<boolean> {
    try {
      return await checkSanityHealth();
    } catch (error) {
      console.error("SanityDataService: Health check failed", error);
      return false;
    }
  }

  /**
   * Get current configuration (useful for debugging)
   */
  getConfig(): SanityConfig {
    return this.config;
  }
}

/**
 * Lazy-initialized singleton instance
 * Created on first access, reused for subsequent calls
 */
let serviceInstance: SanityDataService | null = null;

/**
 * Get or create the SanityDataService singleton
 * @param config Optional config override
 * @returns SanityDataService instance
 */
export function getSanityDataService(
  config?: SanityConfig
): SanityDataService {
  if (!serviceInstance) {
    try {
      const cfg = config || getSanityConfigFromEnv();
      serviceInstance = new SanityDataService(cfg);
    } catch (error) {
      console.error("Failed to initialize SanityDataService:", error);
      throw error;
    }
  }
  return serviceInstance;
}

/**
 * Get Sanity config from environment
 * Helper for creating service instances
 */
function getSanityConfigFromEnv(): SanityConfig {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

  return {
    projectId: projectId || "",
    dataset: dataset || "",
    apiVersion: apiVersion || "2024-01-15",
  };
}

/**
 * Reset service instance (useful for testing)
 */
export function resetSanityDataService(): void {
  serviceInstance = null;
}
