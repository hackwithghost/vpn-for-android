import { z } from "zod";

// This is a UI-only demo, so no database tables are required.
export const demoSchema = z.object({
  status: z.enum(["disconnected", "connecting", "connected"]),
  server: z.string(),
});
