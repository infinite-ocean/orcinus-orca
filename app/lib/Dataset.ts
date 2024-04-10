import { z } from "zod";

const DatasetMetadataSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string(),
  refreshed_at: z.string(),
  from_date: z.string(),
  to_date: z.string(),
});

export const DatasetSchema = z.object({
  dataset: z.object({
    id: z.number().positive(),
    dataset_code: z.string(),
    database_code: z.string(),
    name: z.string(),
    description: z.string(),
    refreshed_at: z.string(),
    newest_available_date: z.string(),
    oldest_available_date: z.string(),
    column_names: z.array(z.string()),
    frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "annual"]),
    type: z.literal("Time Series"),
    premium: z.boolean(),
    limit: z.number().nullable(),
    transform: z
      .enum(["diff", "rdiff", "rdiff_from", "cumul", "normalize"])
      .nullable(),
    column_index: z.number().nonnegative().nullable(),
    start_date: z.string(),
    end_date: z.string(),
    data: z.array(
      z.array(z.union([z.string(), z.number(), z.boolean(), z.date()]))
    ),
    collapse: z
      .enum(["daily", "weekly", "monthly", "quarterly", "annual"])
      .nullable(),
    order: z.enum(["asc", "desc"]).nullable(),
    database_id: z.literal(118),
  }),
});

export const DatasetListSchema = z.object({
  completed: z.boolean(),
  datasets: z.array(DatasetMetadataSchema),
});

export type DatasetMetadataType = z.infer<typeof DatasetMetadataSchema>;
export type DatasetType = z.infer<typeof DatasetSchema>;
