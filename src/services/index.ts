/**
 * Services layer barrel exports
 * Centralizes all service types and implementations for clean imports
 */

// Sanity client
export {
  getSanityConfig,
  createSanityClient,
  getSanityClient,
  checkSanityHealth,
  resetSanityClient,
  type SanityConfig,
} from "./sanityClient";

// Sanity queries
export {
  PROFILE_QUERY,
  PROJECTS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
  ALL_PROJECT_SLUGS_QUERY,
  SECTIONS_QUERY,
} from "./sanityQueries";

// Sanity image helpers
export {
  buildSanityImageUrl,
  type SanityImageFit,
  type SanityImageOptions,
  type SanityImageSource,
} from "./sanityImage";

// Sanity data service
export {
  SanityDataService,
  getSanityDataService,
  resetSanityDataService,
} from "./SanityDataService";
