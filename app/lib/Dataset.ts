import { z } from "zod";

const FREDDatasetSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string(),
  refreshed_at: z.string(),
  from_date: z.string(),
  to_date: z.string(),
});

export const FREDDatasetsSchema = z.object({
  completed: z.boolean(),
  datasets: z.array(FREDDatasetSchema),
});

export type FREDDataset = z.infer<typeof FREDDatasetSchema>;
