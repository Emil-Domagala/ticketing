import { z } from 'zod';

export const formAuthSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z
    .string()
    .min(4, { message: 'Password must be between 4 and 20 characters' })
    .max(20, { message: 'Password must be between 4 and 20 characters' }),
});

export type FormAuthSchema = z.infer<typeof formAuthSchema>;
