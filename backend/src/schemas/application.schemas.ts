import { z } from "zod";

const messageResponseSchema = z.object({
  message: z.string(),
});

export { messageResponseSchema };
