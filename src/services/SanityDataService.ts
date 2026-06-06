/**
 * SanityDataService
 * Implements IDataService interface using Sanity CMS as backend
 * Handles GROQ queries, data mapping to domain models, and error handling
 */

import { IDataService, type HomePage, type AboutPage } from "@domain/interfaces/DataService";
import {
  Profile,
  Project,
  Section,
  type SkillTag,
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
  SECTIONS_BY_PAGE_QUERY,
  HOME_PAGE_QUERY,
  ABOUT_PAGE_QUERY,
} from "./sanityQueries";

function buildFileUrl(assetId: string): string {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const parts = assetId.replace(/^file-/, "");
  const lastDash = parts.lastIndexOf("-");
  const hash = parts.slice(0, lastDash);
  const ext = parts.slice(lastDash + 1);
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${hash}.${ext}`;
}

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
  avatar?: {
    asset?: {
      url: string;
      lqip?: string;
    };
    alt?: string;
  };
  resumeUrl?: string;
  technologies?: Array<{
    name: string;
    icon?: { asset?: { url: string } };
    color?: string;
  }>;
}

interface SanityProject {
  _id: string;
  title: string;
  title_pt?: string;
  subtitle?: string;
  subtitle_pt?: string;
  excerpt?: string;
  excerpt_pt?: string;
  slug: {
    current: string;
  };
  description: unknown;
  description_pt?: unknown;
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
    icon?: { asset?: { url: string } };
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
    body?: unknown;
    body_pt?: unknown;
    bullets?: unknown[];
    bullets_pt?: unknown[];
    bgColor?: string;
    textColor?: string;
    subtitle?: unknown;
    subtitle_pt?: unknown;
    caption?: string;
    caption_pt?: string;
    columns?: number;
    imageAspectRatio?: string;
    imageFit?: string;
    metric?: string;
    label?: string;
    alt?: string;
    image?: { asset?: { url: string; lqip?: string; dimensions?: { width: number; height: number } }; alt?: string };
    images?: Array<{ asset?: { url: string; lqip?: string; dimensions?: { width: number; height: number } }; alt?: string; span?: number }>;
    cards?: Array<{ metric: string; label: string; label_pt?: string }>;
    videoUrl?: string;
    videoAssetId?: string;
    externalUrl?: string;
    poster?: { asset?: { url: string; lqip?: string }; alt?: string };
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    useCard?: boolean;
    noPadding?: boolean;
    textColumns?: Array<{
      heading?: string;
      heading_pt?: string;
      body?: unknown;
      body_pt?: unknown;
      useCard?: boolean;
      bgColor?: string;
      textColor?: string;
    }>;
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

interface SanityContentBlock {
  _type: string;
  _key: string;
  heading?: string;
  heading_pt?: string;
  body?: string;
  body_pt?: string;
  chips?: Array<{ label: string; label_pt?: string; color?: string }>;
  ctaLabel?: string;
  ctaLabel_pt?: string;
  ctaHref?: string;
  items?: Array<{ title: string; title_pt?: string; description: string; description_pt?: string }>;
  companies?: Array<{ name: string; url?: string; logo?: { asset?: { url: string; lqip?: string }; alt?: string } }>;
  links?: Array<{ platform: string; url: string }>;
  availabilityText?: string;
  availabilityText_pt?: string;
}

interface SanitySection {
  _id: string;
  uid: { current: string };
  sectionType?: string;
  title: string;
  title_pt?: string;
  subtitle?: string;
  subtitle_pt?: string;
  content?: unknown[];
  contentBlocks?: SanityContentBlock[];
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
  hasDropShadow?: boolean;
  padding?: string;
  order?: number;
}

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
  const technologies: SkillTag[] = (sanityProfile.technologies || []).map((t) => ({
    name: t.name,
    iconUrl: t.icon?.asset?.url,
    color: t.color,
  }));

  return new Profile({
    name: sanityProfile.name,
    title: loc(sanityProfile.title, sanityProfile.title_pt, locale),
    bio: loc(sanityProfile.bio, sanityProfile.bio_pt, locale),
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
    resumeUrl: sanityProfile.resumeUrl || null,
    technologies,
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
    iconUrl: tech.icon?.asset?.url,
  }));

  return new Project({
    id: sanityProject._id,
    title: loc(sanityProject.title, sanityProject.title_pt, locale),
    subtitle: loc(sanityProject.subtitle || null, sanityProject.subtitle_pt, locale),
    slug: sanityProject.slug.current,
    excerpt: loc(sanityProject.excerpt || null, sanityProject.excerpt_pt, locale),
    mainImageSize: (sanityProject.mainImageSize as "small" | "medium" | "large" | "full") || null,
    description: loc(sanityProject.description, sanityProject.description_pt, locale) as import("@domain").RichTextBody,
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
      body: loc(s.body, s.body_pt, locale) as import("@domain").RichTextBody | undefined,
      bullets: loc(s.bullets as string[] | undefined, s.bullets_pt as string[] | undefined, locale),
      bgColor: s.bgColor,
      textColor: s.textColor,
      subtitle: loc(s.subtitle, s.subtitle_pt, locale) as import("@domain").RichTextBody | undefined,
      caption: loc(s.caption, s.caption_pt, locale),
      columns: s.columns,
      imageAspectRatio: normalizeImageAspectRatio(s.imageAspectRatio),
      imageFit: normalizeImageFit(s.imageFit),
      alt: s.alt,
      image: s.image,
      images: s.images,
      cards: s.cards?.map((c) => ({
        metric: c.metric,
        label: loc(c.label, c.label_pt, locale),
      })),
      videoUrl: s.videoUrl || (s.videoAssetId ? buildFileUrl(s.videoAssetId) : undefined),
      externalUrl: s.externalUrl,
      poster: s.poster,
      autoplay: s.autoplay,
      loop: s.loop,
      muted: s.muted,
      useCard: s.useCard,
      noPadding: s.noPadding,
      textColumns: s.textColumns?.map((col) => ({
        heading: loc(col.heading, col.heading_pt, locale),
        body: loc(col.body, col.body_pt, locale) as import("@domain").RichTextBody | undefined,
        useCard: col.useCard,
        bgColor: col.bgColor,
        textColor: col.textColor,
      })),
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

function normalizeImageFit(raw?: string): "cover" | "contain" {
  return raw === "contain" ? "contain" : "cover";
}

function normalizeImageAspectRatio(raw?: string): "auto" | "214/100" | "3/4" | "1/1" | "16/9" | "4/1" | undefined {
  if (raw === "auto" || raw === "214/100" || raw === "3/4" || raw === "1/1" || raw === "16/9" || raw === "4/1") {
    return raw;
  }

  return undefined;
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

  const contentBlocks = (doc.contentBlocks ?? []).map((block) => ({
    _type: block._type,
    _key: block._key,
    heading: loc(block.heading, block.heading_pt, locale),
    body: loc(block.body, block.body_pt, locale),
    chips: block.chips?.map((c) => ({
      label: loc(c.label, c.label_pt, locale),
      color: c.color,
    })),
    ctaLabel: loc(block.ctaLabel, block.ctaLabel_pt, locale),
    ctaHref: block.ctaHref,
    items: block.items?.map((item) => ({
      title: loc(item.title, item.title_pt, locale),
      description: loc(item.description, item.description_pt, locale),
    })),
    companies: block.companies?.map((c) => ({
      name: c.name,
      url: c.url,
      logo: {
        url: c.logo?.asset?.url || "",
        alt: c.logo?.alt || c.name,
        lqip: c.logo?.asset?.lqip || "",
      },
    })),
    links: block.links,
    availabilityText: loc(block.availabilityText, block.availabilityText_pt, locale),
  }));

  const sectionType = (doc.sectionType === "past-experience" || doc.sectionType === "contact" || doc.sectionType === "values")
    ? doc.sectionType
    : "generic" as const;

  return new Section({
    id: doc._id,
    uid: doc.uid.current,
    sectionType,
    title: loc(doc.title, doc.title_pt, locale),
    subtitle: loc(doc.subtitle || null, doc.subtitle_pt, locale),
    content: doc.content || [],
    contentBlocks,
    background,
    overlay: normalizeOverlay(doc.overlay),
    hasDropShadow: typeof doc.hasDropShadow === "boolean" ? doc.hasDropShadow : true,
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

  async getSectionsByPage(page: string, locale: string = "en"): Promise<Section[]> {
    try {
      const client = getSanityClient();
      const sanitySections = await client.fetch<SanitySection[]>(
        SECTIONS_BY_PAGE_QUERY,
        { page }
      );

      if (!Array.isArray(sanitySections)) {
        return [];
      }

      return sanitySections
        .map((doc) => Section.tryCreate(mapSanitySectionToModel(doc, locale)))
        .filter((s): s is Section => s !== null);
    } catch (error) {
      console.error("SanityDataService: Failed to fetch sections by page", error);
      return [];
    }
  }

  async getAboutPage(locale: string = "en"): Promise<AboutPage | null> {
    try {
      const client = getSanityClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await client.fetch<any>(ABOUT_PAGE_QUERY);
      if (!data) return null;

      const bio = locale === "pt"
        ? (data.bio_pt?.length > 0 ? data.bio_pt : data.bio?.length > 0 ? data.bio : null)
        : (data.bio?.length > 0 ? data.bio : null);

      return {
        bioHeading: loc(data.bioHeading ?? null, data.bioHeading_pt, locale),
        bio,
        heroImage: data.heroImage?.asset?.url
          ? {
              asset: {
                url: data.heroImage.asset.url,
                alt: data.heroImage.alt || "",
                lqip: data.heroImage.asset.lqip || "",
              },
              alt: data.heroImage.alt || "",
            }
          : null,
        valuesHeading: loc(data.valuesHeading ?? null, data.valuesHeading_pt, locale),
        values: (data.values ?? []).map((v: { title: string; title_pt?: string; description: string; description_pt?: string }) => ({
          title: loc(v.title, v.title_pt, locale),
          description: loc(v.description, v.description_pt, locale),
        })),
        skillChips: (data.skillChips ?? []).map((c: { label: string; label_pt?: string; icon?: { asset?: { url: string } }; color: string }) => ({
          label: loc(c.label, c.label_pt, locale),
          iconUrl: c.icon?.asset?.url,
          color: c.color,
        })),
      };
    } catch (error) {
      console.error("SanityDataService: Failed to fetch about page", error);
      return null;
    }
  }

  async getHomePage(locale: string = "en"): Promise<HomePage | null> {
    try {
      const client = getSanityClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await client.fetch<any>(HOME_PAGE_QUERY);
      if (!data) return null;

      const hasFlat = data.greeting || data.aboutHeading || data.projectsHeading;
      if (hasFlat) {
        return {
          greeting: loc(data.greeting, data.greeting_pt, locale),
          ctaPrimaryLabel: loc(data.ctaPrimaryLabel, data.ctaPrimaryLabel_pt, locale),
          ctaPrimaryHref: data.ctaPrimaryHref,
          ctaSecondaryLabel: loc(data.ctaSecondaryLabel, data.ctaSecondaryLabel_pt, locale),
          ctaSecondaryHref: data.ctaSecondaryHref,
          aboutHeading: loc(data.aboutHeading, data.aboutHeading_pt, locale),
          aboutBody: loc(data.aboutBody, data.aboutBody_pt, locale),
          showResume: data.showResume,
          showSkills: data.showSkills,
          projectsHeading: loc(data.projectsHeading, data.projectsHeading_pt, locale),
          maxProjects: data.maxProjects,
          experienceHeading: loc(data.experienceHeading, data.experienceHeading_pt, locale),
          contactHeading: loc(data.contactHeading, data.contactHeading_pt, locale),
          contactSubtitle: loc(data.contactSubtitle, data.contactSubtitle_pt, locale),
          availabilityText: loc(data.availabilityText, data.availabilityText_pt, locale),
          showForm: data.showForm,
          videoHeading: loc(data.videoHeading, data.videoHeading_pt, locale),
          videoSubtitle: loc(data.videoSubtitle, data.videoSubtitle_pt, locale),
          videoUrl: data.videoUrl || (data.videoAssetId ? buildFileUrl(data.videoAssetId) : undefined),
          videoExternalUrl: data.videoExternalUrl,
          videoPoster: data.videoPoster,
          videoAutoplay: data.videoAutoplay,
          videoLoop: data.videoLoop,
          videoMuted: data.videoMuted,
        };
      }

      // backward compat: old sections[] array → flat
      const sections = data.sections || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const find = (type: string) => sections.find((s: any) => s._type === type);
      const hero = find("heroSection");
      const about = find("aboutSection");
      const projects = find("projectsSection");
      const experience = find("experienceSection");
      const contact = find("contactSection");
      const video = find("videoSection");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lfs = (s: any, field: string) => {
        if (!s) return undefined;
        return loc(s[field], s[`${field}_pt`], locale);
      };

      return {
        greeting: lfs(hero, "greeting"),
        ctaPrimaryLabel: lfs(hero, "ctaPrimaryLabel"),
        ctaPrimaryHref: hero?.ctaPrimaryHref,
        ctaSecondaryLabel: lfs(hero, "ctaSecondaryLabel"),
        ctaSecondaryHref: hero?.ctaSecondaryHref,
        aboutHeading: lfs(about, "heading"),
        aboutBody: lfs(about, "body"),
        showResume: about?.showResume,
        showSkills: about?.showSkills,
        projectsHeading: lfs(projects, "heading"),
        maxProjects: projects?.maxProjects,
        experienceHeading: lfs(experience, "heading"),
        contactHeading: lfs(contact, "heading"),
        contactSubtitle: lfs(contact, "subtitle"),
        availabilityText: lfs(contact, "availabilityText"),
        showForm: contact?.showForm,
        videoHeading: lfs(video, "heading"),
        videoSubtitle: lfs(video, "subtitle"),
        videoUrl: video?.videoUrl,
        videoExternalUrl: video?.externalUrl,
        videoPoster: video?.poster,
        videoAutoplay: video?.autoplay,
        videoLoop: video?.loop,
        videoMuted: video?.muted,
      };
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
