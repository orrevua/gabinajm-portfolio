/**
 * GET /api/profile
 * Returns portfolio owner profile information
 */

import { NextRequest, NextResponse } from "next/server";
import { getSanityDataService } from "@/src/services";

export const dynamic = "force-static";
export const revalidate = 3600; // ISR: 1 hour

interface ProfileResponse {
  name: string;
  title: string;
  bio: string;
  avatar?: {
    url: string;
    lqip: string;
    alt: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  resumeUrl?: string;
  technologies: string[];
}

interface SuccessResponse {
  success: true;
  data: ProfileResponse;
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * GET handler for profile
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  void request;
  try {
    const dataService = await getSanityDataService();
    const profile = await dataService.getProfile();

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error: "Profile information not available",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Map to response format
    const response: ProfileResponse = {
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      avatar:
        profile.avatar && profile.avatar.asset
          ? {
              url: profile.avatar.asset.url,
              lqip:
                profile.avatar.asset.lqip ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3C/svg%3E",
              alt: profile.avatar.alt || profile.name,
            }
          : undefined,
      socialLinks: profile.getSocialLinks(),
      resumeUrl: profile.getResumeUrl() || undefined,
      technologies: (profile.technologies || []).map((t) => t.name),
    };

    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching profile:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profile",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  void request;
  return NextResponse.json(null, { status: 204 });
}
