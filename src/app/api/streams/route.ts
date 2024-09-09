import prisma from "@/config/prisma.config";
import { streamSchema } from "@/lib/stream-validation";
//@ts-expect-error type error
import { GetVideoDetails } from "youtube-search-api";

const YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

export async function POST(req: Request) {
    const body = streamSchema.parse(await req.json());
    try {
        const isYt = body.url.match(YT_REGEX);
        if (!isYt) {
            return Response.json({
                success: false,
                message: "Wrong URL format"
            }, {
                status: 411
            })
        }
        const extractedURL = body.url.split("?v=")[1];
        const search = await GetVideoDetails(extractedURL);

        const title = search.title;
        const thumbnails = search.thumbnail.thumbnails;

        thumbnails.sort((a: { width: number }, b: { width: number }) => a.width < b.width ? -1 : 1);
        const StreamURL = await prisma.stream.create({
            data: {
                userId: body.contentId,
                url: body.url,
                stream: "Youtube",
                extractedURL: extractedURL,
                title,
                midImg: (thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url) ?? "",
                largeImg: thumbnails[thumbnails.length - 1].url ?? ""
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

export async function GET() {
    try {
        const stream = await prisma.stream.findMany({
            select: {
                id: true,
                stream: true,
                extractedURL: true,
                url: true,
                userId: true
            }
        })
        return Response.json({
            success: true,
            data: stream
        })
    }
    catch (e) {
        console.error("Error getting stream", e);
        return Response.json({
            success: false,
            message: "Error getting stream"
        }, {
            status: 500
        })
    }
}