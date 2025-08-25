import { z } from "zod";

export const paginationInput = z.object({
  page: z.number().min(0).default(0),
  pageSize: z.number().min(1).max(100).default(10),
}).default({
  page: 0,
  pageSize: 10,
});
