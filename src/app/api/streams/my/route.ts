import prisma from "@/config/prisma.config";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user) {
            return Response.json({
                success: false,
                message: "Unauthenticated"
            }, {
                status: 403,
            });
        }

        const streams = await prisma.stream.findMany({
            where: {
                userId: session?.user
            }
        });

        return Response.json({
            success: true,
            streams
        }, {
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching streams:", error);
        return Response.json({
            success: false,
            message: "Internal Server Error"
        }, {
            status: 500,
        });
    }
}