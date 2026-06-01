/**
 * GET /api/projects
 * Returns all projects as JSON
 * Optional query params: sort=date-asc|date-desc, limit=N
 */

import { NextRequest, NextResponse } from "next/server";
import { getSanityDataService } from "@/src/services";
import { toPlainText } from "@/src/domain/types";

export const dynamic = "force-static";
export const revalidate = 3600; // ISR: 1 hour

interface ProjectResponse {
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
  data: ProjectResponse[];
  total: number;
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

/**
 * GET handler for projects list
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit") as string, 10)
      : undefined;
    const sortParam = searchParams.get("sort");
    const sort =
      sortParam === "date-asc"
        ? "oldest"
        : sortParam === "featured"
          ? "featured"
          : "newest";

    // Validate limit
    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid limit parameter. Must be between 1 and 100.",
          code: "INVALID_LIMIT",
        },
        { status: 400 }
      );
    }

    const dataService = await getSanityDataService();
    const projects = await dataService.getProjects({ sort });

    // Apply limit if provided
    const limitedProjects = limit ? projects.slice(0, limit) : projects;

    // Map to response format
    const response: ProjectResponse[] = limitedProjects.map((project) => ({
      _id: project.id,
      title: project.title,
      slug: project.slug,
      description: toPlainText(project.description),
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
    }));

    return NextResponse.json(
      {
        success: true,
        data: response,
        total: response.length,
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
    console.error("Error fetching projects:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
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
