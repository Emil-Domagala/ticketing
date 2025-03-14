'use client';
import { z } from 'zod';

export const formAuthSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z
    .string()
    .min(4, { message: 'Password must be between 4 and 20 characters' })
    .max(20, { message: 'Password must be between 4 and 20 characters' }),
});

export type FormAuthSchema = z.infer<typeof formAuthSchema>;