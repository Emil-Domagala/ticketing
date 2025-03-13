import { z } from 'zod';

export const formSingupSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(4).max(20),
});
