import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const applySchema = z.object({
  coverLetter: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: gigId } = await params;
    const body = await request.json();
    const { coverLetter } = applySchema.parse(body);

    // Check if gig exists
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
    });

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    // Check if already applied
    const existingApplication = await prisma.gigApplication.findFirst({
      where: {
        gigId,
        applicantId: session.user.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this gig" },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.gigApplication.create({
      data: {
        gigId,
        applicantId: session.user.id,
        coverLetter: coverLetter || null,
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("POST /api/gigs/[id]/apply:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
