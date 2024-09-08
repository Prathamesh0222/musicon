import { z } from "zod";

export const streamSchema = z.object({
    url: z.string(),
    contentId: z.string()
})

export type streamInput = z.infer<typeof streamSchema>;