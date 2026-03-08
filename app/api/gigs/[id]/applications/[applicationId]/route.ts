import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; applicationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: gigId, applicationId } = await params;
    const body = await request.json();
    const { status } = body; // "accepted" or "rejected"

    // Verify gig exists and user is the owner
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
    });

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    if (gig.posterId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Verify application exists
    const application = await prisma.gigApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Update application status
    const updatedApplication = await prisma.gigApplication.update({
      where: { id: applicationId },
      data: {
        status,
        respondedAt: new Date(),
      },
    });

    // If accepted, close the gig (no more applications accepted)
    if (status === "accepted") {
      await prisma.gig.update({
        where: { id: gigId },
        data: { status: "closed" },
      });
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error("PATCH /api/gigs/[id]/applications/[applicationId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
