import { z } from 'zod'

export const registerUserSchema = z.object({
  email: z.email('Please enter a valid email address'),

  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters'),
})

export const loginUserSchema = z.object({
  email: z.email('Please enter a valid email address'),

  password: z
    .string()
    .min(1, 'Password is required'),
})