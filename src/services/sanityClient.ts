/**
 * Sanity Client Initialization
 * Handles SDK setup with environment validation and connection health checks
 */

import { createClient, type ClientConfig } from "@sanity/client";
import { FetchError, FetchErrorCode } from "@domain/types";

/**
 * Validated Sanity configuration from environment variables
 */
export interface SanityConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  token?: string;
}

/**
 * Validates and retrieves Sanity configuration from environment
 * @throws FetchError if required env vars are missing
 */
export function getSanityConfig(): SanityConfig {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId) {
    throw new FetchError(
      FetchErrorCode.INTERNAL_ERROR,
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable",
      500
    );
  }

  if (!dataset) {
    throw new FetchError(
      FetchErrorCode.INTERNAL_ERROR,
      "Missing NEXT_PUBLIC_SANITY_DATASET environment variable",
      500
    );
  }

  if (!apiVersion) {
    throw new FetchError(
      FetchErrorCode.INTERNAL_ERROR,
      "Missing NEXT_PUBLIC_SANITY_API_VERSION environment variable",
      500
    );
  }

  return { projectId, dataset, apiVersion, token };
}

/**
 * Creates and returns a configured Sanity client instance
 * Environment variables must be set before calling this function
 * @throws FetchError if configuration is invalid
 */
export function createSanityClient(): ReturnType<typeof createClient> {
  const config = getSanityConfig();

  const clientConfig: ClientConfig = {
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: process.env.NODE_ENV === "production",
    token: config.token,
  };

  return createClient(clientConfig);
}

/**
 * Lazy-initialized Sanity client instance
 * Created on first access, reused for subsequent calls
 */
let sanityClientInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the Sanity client singleton
 * @throws FetchError if client initialization fails
 */
export function getSanityClient(): ReturnType<typeof createClient> {
  if (!sanityClientInstance) {
    try {
      sanityClientInstance = createSanityClient();
    } catch (error) {
      console.error("Failed to initialize Sanity client:", error);
      throw error;
    }
  }
  return sanityClientInstance;
}

/**
 * Health check: Verify Sanity connection is available
 * Attempts to fetch a minimal query to validate:
 * - Network connectivity
 * - Authentication (if token required)
 * - Schema availability
 * @returns true if connection is healthy
 * @throws FetchError if health check fails
 */
export async function checkSanityHealth(): Promise<boolean> {
  try {
    const client = getSanityClient();
    const result = await client.fetch('*[_type == "profile"][0] { _id }', {});

    if (!result) {
      console.warn("Sanity health check: profile document not found (schema may be empty)");
      return true; // Schema exists, just no data yet
    }

    console.warn("Sanity health check passed");
    return true;
  } catch (error) {
    console.error("Sanity health check failed:", error);
    throw new FetchError(
      FetchErrorCode.NETWORK_ERROR,
      "Failed to connect to Sanity CMS",
      503
    );
  }
}

/**
 * Reset client instance (useful for testing)
 */
export function resetSanityClient(): void {
  sanityClientInstance = null;
}
