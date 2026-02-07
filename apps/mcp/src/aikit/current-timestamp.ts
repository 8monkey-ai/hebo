import { z } from "zod";

export const currentTimestampTool = {
  name: "current_timestamp",
  config: {
    description: "Returns the current date and time in human-readable format",
    inputSchema: {
      timezone: z
        .string()
        .optional()
        .describe("IANA timezone (e.g., 'America/New_York'). Defaults to UTC."),
    },
  },
  handler: async ({ timezone = "UTC" }: { timezone?: string }) => {
    const now = new Date();
    const formatted = now.toLocaleString("en-US", {
      timeZone: timezone,
      dateStyle: "full",
      timeStyle: "long",
    });

    return {
      content: [
        {
          type: "text" as const,
          text: `${formatted} (${timezone})\nUnix: ${now.getTime()}`,
        },
      ],
    };
  },
};
