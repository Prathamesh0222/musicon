import prisma from "@/config/prisma.config";
import { UpvoteSchema } from "@/lib/upvote-validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return Response.json({
            success: "false",
            message: "Unauthenticated"
        }, {
            status: 403
        })
    }
    const body = UpvoteSchema.parse(await req.json());
    try {


        await prisma.upvotes.delete({
            where: {
                userId_streamId: {
                    userId: session.user.id,
                    streamId: body.streamId,
                },
            },
        });

        return Response.json({
            success: true,
            message: "Upvote removed successfully",
        }, {
            status: 200
        })

    } catch (e) {
        console.error("Error removing upvote", e);
        return Response.json({
            success: false,
            message: "Error removing upvote"
        }, {
            status: 500
        })
    }
}