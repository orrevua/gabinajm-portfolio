/**
 * GET /api/projects/[slug]
 * Returns a single project by slug
 */

import { NextRequest, NextResponse } from "next/server";
import { getSanityDataService } from "@/src/services";

export const dynamic = "force-static";
export const revalidate = 3600; // ISR: 1 hour

interface ProjectDetailResponse {
  _id: string;
  title: string;
  slug: string;
  description: string;
  mainImage?: {
    url: string;
    lqip: string;
    alt: string;
  };
  technologies: string[];
  link?: string;
  repository?: string;
  featured: boolean;
  publishedAt: string;
}

interface SuccessResponse {
  success: true;
  data: ProjectDetailResponse;
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * Generate static parameters for all project slugs
 */
export async function generateStaticParams() {
  try {
    const dataService = await getSanityDataService();
    const slugs = await dataService.getAllProjectSlugs();

    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

/**
 * GET handler for single project
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse>> {
  void request;
  try {
    const { slug } = await params;

    // Validate slug
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid slug parameter",
          code: "INVALID_SLUG",
        },
        { status: 400 }
      );
    }

    const dataService = await getSanityDataService();
    const project = await dataService.getProjectBySlug(slug);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: `Project with slug "${slug}" not found`,
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Map to response format
    const response: ProjectDetailResponse = {
      _id: project.id,
      title: project.title,
      slug: project.slug,
      description: project.description,
      mainImage:
        project.mainImage && project.mainImage.asset
          ? {
              url: project.mainImage.asset.url,
              lqip:
                project.mainImage.asset.lqip ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E",
              alt: project.mainImage.alt || project.title,
            }
          : undefined,
      technologies: project.getTechnologyNames(),
      link: project.link || undefined,
      repository: project.repository || undefined,
      featured: project.featured,
      publishedAt: project.publishedAt.toISOString(),
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
    console.error("Error fetching project:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project",
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
  return NextResponse.json(
    { message: "OK" },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
