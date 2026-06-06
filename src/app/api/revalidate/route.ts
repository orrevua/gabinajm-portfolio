import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATION_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const type = body?._type as string | undefined;

    if (type === "profile" || type === "homePage" || type === "aboutPage") {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/about");
    } else if (type === "project") {
      revalidatePath("/");
      if (body?.slug?.current) {
        revalidatePath(`/projects/${body.slug.current}`);
      }
    } else if (type === "section") {
      revalidatePath("/");
      revalidatePath("/about");
    } else {
      revalidatePath("/", "layout");
      revalidatePath("/");
      revalidatePath("/about");
    }

    return NextResponse.json({ revalidated: true, type });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
