/**
 * GROQ Query Templates for Sanity
 * Centralizes all query definitions with image projections and error handling
 */

/**
 * Query: Fetch portfolio owner's profile
 * Includes avatar image with optimization fields (lqip, alt)
 */
export const PROFILE_QUERY = `
  *[_type == "profile"][0] {
    _id,
    name,
    title,
    title_pt,
    bio,
    bio_pt,
    aboutBio,
    aboutBio_pt,
    avatar {
      asset-> {
        _id,
        url,
        "lqip": metadata.lqip
      },
      alt
    },
    socialLinks[] {
      platform,
      url
    },
    resumeUrl,
    technologies[],
    pastExperience[] {
      name,
      logo {
        asset-> { _id, url, "lqip": metadata.lqip },
        alt
      }
    }
  }
`;

/**
 * Query: Fetch all published projects (with optional filters)
 * Includes main image with optimization fields (lqip, alt)
 * Ordered by publication date (newest first)
 */
export const PROJECTS_QUERY = `
  *[_type == "project" && !(_id in path('drafts.**'))] | order(publishedAt desc) {
    _id,
    title,
    title_pt,
    slug,
    description,
    description_pt,
    mainImage {
      asset-> {
        _id,
        url,
        "lqip": metadata.lqip
      },
      "assetRef": asset._ref,
      crop,
      hotspot,
      alt
    },
    technologies[] {
      name,
      category
    },
    link,
    repository,
    cardColor,
    cardStyle,
    mainImageCrop,
    "isProtected": defined(password),
    featured,
    publishedAt
  }
`;

/**
 * Query: Fetch featured projects only
 * Used for homepage display (limit via LIMIT_PARAM)
 * Ordered by publication date (newest first)
 */
export const FEATURED_PROJECTS_QUERY = `
  *[_type == "project" && featured == true && !(_id in path('drafts.**'))] | order(publishedAt desc) {
    _id,
    title,
    title_pt,
    slug,
    description,
    description_pt,
    mainImage {
      asset-> {
        _id,
        url,
        "lqip": metadata.lqip
      },
      "assetRef": asset._ref,
      crop,
      hotspot,
      alt
    },
    technologies[] {
      name,
      category
    },
    link,
    repository,
    cardColor,
    cardStyle,
    mainImageCrop,
    "isProtected": defined(password),
    featured,
    publishedAt
  }
`;

/**
 * Query: Fetch a single project by slug
 * Used for project detail page
 * Includes full metadata and image optimization
 */
export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug && !(_id in path('drafts.**'))][0] {
    _id,
    title,
    title_pt,
    subtitle,
    subtitle_pt,
    slug,
    description,
    description_pt,
    heroColor,
    mainImageSize,
    mainImage {
      asset-> {
        _id,
        url,
        "lqip": metadata.lqip
      },
      "assetRef": asset._ref,
      crop,
      hotspot,
      alt
    },
    technologies[] {
      name,
      category
    },
    contentSections[] {
      _type,
      _key,
      sectionLabel,
      sectionLabel_pt,
      heading,
      body,
      body_pt,
      bullets,
      bullets_pt,
      bgColor,
      textColor,
      subtitle,
      subtitle_pt,
      caption,
      caption_pt,
      columns,
      metric,
      label,
      alt,
      image {
        asset-> {
          _id,
          url,
          "lqip": metadata.lqip
        },
        alt
      },
      images[] {
        asset-> {
          _id,
          url,
          "lqip": metadata.lqip
        },
        alt
      },
      cards[] {
        metric,
        label,
        label_pt
      },
      "videoUrl": video.asset->url,
      externalUrl,
      poster {
        asset-> { _id, url, "lqip": metadata.lqip },
        alt
      },
      autoplay,
      loop,
      muted
    },
    link,
    repository,
    cardColor,
    cardStyle,
    mainImageCrop,
    "isProtected": defined(password),
    featured,
    publishedAt
  }
`;

/**
 * Query: Fetch all project slugs for static generation
 * Used in generateStaticParams() for dynamic routes
 * Minimal payload (only slugs needed)
 */
export const ALL_PROJECT_SLUGS_QUERY = `
  *[_type == "project" && !(_id in path('drafts.**'))] {
    slug
  }
`;

export const SECTIONS_QUERY = `
  *[_type == "section"] | order(order asc) {
    _id,
    uid,
    title,
    title_pt,
    subtitle,
    subtitle_pt,
    content[],
    background {
      type,
      color,
      image {
        asset-> {
          _id,
          url,
          "lqip": metadata.lqip
        }
      },
      imageAlt
    },
    overlay,
    padding,
    order
  }
`;

export const SECTION_BY_UID_QUERY = `
  *[_type == "section" && uid.current == $uid][0] {
    _id,
    uid,
    title,
    title_pt,
    subtitle,
    subtitle_pt,
    content[],
    background {
      type,
      color,
      image {
        asset-> {
          _id,
          url,
          "lqip": metadata.lqip
        }
      },
      imageAlt
    },
    overlay,
    padding,
    order
  }
`;

export const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0] {
    _id,
    sections[] {
      _type,
      _key,
      greeting,
      greeting_pt,
      ctaPrimaryLabel,
      ctaPrimaryLabel_pt,
      ctaPrimaryHref,
      ctaSecondaryLabel,
      ctaSecondaryLabel_pt,
      ctaSecondaryHref,
      heading,
      heading_pt,
      body,
      body_pt,
      showResume,
      showSkills,
      maxProjects,
      availabilityText,
      availabilityText_pt,
      showForm,
      subtitle,
      subtitle_pt,
      "videoUrl": video.asset->url,
      externalUrl,
      poster {
        asset-> { _id, url, "lqip": metadata.lqip },
        alt
      },
      autoplay,
      loop,
      muted
    }
  }
`;

export const PASSWORD_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] { password }
`;

export const PROFILE_LISTENER_QUERY = `*[_type == "profile"]`;

/**
 * Query listener params for real-time updates via ISR revalidation
 * GROQ subscription for project changes
 */
export const PROJECT_LISTENER_QUERY = `*[_type == "project"]`;
