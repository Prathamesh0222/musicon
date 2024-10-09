import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/config/prisma.config";
import { UpvoteSchema } from "@/lib/upvote-validation";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const data = UpvoteSchema.parse(await req.json());

    const upvote = await prisma.upvotes.findUnique({
      where: {
        userId_streamId: {
          userId: session.user.id,
          streamId: data.streamId,
        },
      },
    });

    if (upvote) {
      return NextResponse.json(
        {
          message: "Already upvoted",
        },
        {
          status: 400,
        }
      );
    }

    const res = await prisma.upvotes.delete({
      where: {
        userId_streamId: {
          userId: session.user.id,
          streamId: data.streamId,
        },
      },
    });

    return NextResponse.json({
      message: "Done!",
      res,
    });
  } catch (e) {
    console.error("Error :", e);
    return NextResponse.json(
      {
        message: "Error while upvoting",
      },
      {
        status: 500,
      }
    );
  }
}
