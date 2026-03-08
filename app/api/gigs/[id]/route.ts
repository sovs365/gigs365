import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  try {
    const gig = await prisma.gig.findUnique({
      where: { id },
      include: {
        poster: { select: { id: true, name: true, bio: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!gig) return NextResponse.json({ error: "Gig not found" }, { status: 404 });

    // Get current user's application if logged in
    let application = null;
    if (session?.user?.id) {
      application = await prisma.gigApplication.findFirst({
        where: {
          gigId: id,
          applicantId: session.user.id,
        },
      });
    }

    return NextResponse.json({
      gig: {
        ...gig,
        application: application ? { id: application.id, status: application.status } : null,
      },
    });
  } catch (err) {
    console.error("GET /api/gigs/[id]:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const gig = await prisma.gig.findUnique({ where: { id } });
  if (!gig) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (gig.posterId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.gig.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
