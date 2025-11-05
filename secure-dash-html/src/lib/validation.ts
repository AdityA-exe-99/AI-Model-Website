import { z } from 'zod';

export const scanSchema = z.object({
  text: z.string()
    .trim()
    .min(10, 'Email text must be at least 10 characters')
    .max(20000, 'Email text must be less than 20,000 characters'),
  model: z.union([
    z.literal('nb'),
    z.literal('lr'),
    z.literal('both')
  ])
});

export type ScanInput = z.infer<typeof scanSchema>;

export function toUserMessage(err: any): string {
  if (err?.message) return err.message;
  if (err?.error === 'ValidationError') return 'Please check your input and try again.';
  if (err?.error === 'ServerError') return 'Server error. Please try again later.';
  return 'Something went wrong. Please try again.';
}
