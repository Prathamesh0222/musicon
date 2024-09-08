import prisma from "@/config/prisma.config";
import { UpvoteSchema } from "@/lib/upvote-validation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return Response.json({
            success: false,
            message: ""
        })
    }

    const body = await UpvoteSchema.parse(await req.json());
    try {
        await prisma.upvotes.create({
            data: {
                streamId: body.streamId,
                userId: session.user
            }
        })

        return Response.json({
            success: true,
            message: "Upvote added successfully"
        }, {
            status: 200
        })
    } catch (e) {
        console.error("Error adding upvote", e);
        return Response.json({
            success: false,
            message: "Error adding upvote"
        }, {
            status: 500
        })
    }
}