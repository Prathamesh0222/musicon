import prisma from "@/config/prisma.config";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email ?? "",
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
        },
        {
          status: 403,
        }
      );
    }

    const streams = await prisma.stream.findMany({
      where: {
        userId: user.id,
      },
      include: {
        _count: {
          select: {
            Upvotes: true,
          },
        },
        Upvotes: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json({
      streams: streams.map(({ _count, ...rest }) => ({
        ...rest,
        upvotes: _count.Upvotes,
        haveUpvoted: rest.Upvotes.length ? true : false,
      })),
    });
  } catch (error) {
    console.error("Error fetching streams:", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
