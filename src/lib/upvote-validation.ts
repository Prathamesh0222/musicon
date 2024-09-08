import { z } from "zod";

export const UpvoteSchema = z.object({
    streamId: z.string()
})

export type UpvoteInput = z.infer<typeof UpvoteSchema>