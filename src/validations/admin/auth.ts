import z from 'zod'


export const loginSchema = z.object({
    email: z.string().email('Invalid Email'),
    password: z.string().min(3, { message: 'Password must be atleast minimum 3 characters' })
})