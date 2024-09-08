import prisma from "@/config/prisma.config";
import { streamSchema } from "@/lib/stream-validation";

const YT_REGEX = new RegExp("https:\/\/www\.youtube\.com\/watch\?v=[\w-]+(&list=[\w-]+)?(&start_radio=\d)?(&ab_channel=[\w-]+)?")

export default async function POST(req: Request) {

    try {
        const body = streamSchema.parse(await req.json());
        const isYt = YT_REGEX.test(body.url);
        if (!isYt) {
            return Response.json({
                success: false,
                message: "Wrong URL format"
            }, {
                status: 411
            })
        }

        const extractedURL = body.url.split("?v=")[1];

        const StreamURL = await prisma.stream.create({
            data: {
                userId: body.contentId,
                url: body.url,
                stream: "Youtube",
                extractedURL
            }
        })

        return Response.json({
            success: true,
            message: "Stream added successfully",
            streamId: StreamURL.id
        })

    } catch (e) {
        console.error("Error adding stream", e);
        return Response.json({
            success: false,
            message: "Error adding stream"
        }, {
            status: 500
        })
    }
}