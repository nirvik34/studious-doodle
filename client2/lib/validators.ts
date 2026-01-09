import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = loginSchema.extend({
    name: z.string().min(2, "Name must be at least 2 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const profileSchema = z.object({
    age: z.coerce.number().min(18).max(120),
    gender: z.enum(["male", "female", "other"]),
    systolicBP: z.coerce.number().min(70).max(250),
    diastolicBP: z.coerce.number().min(40).max(150),
    bmi: z.coerce.number().min(10).max(60),
    hasHypertension: z.boolean().default(false),
    hasHeartDisease: z.boolean().default(false),
    hasDiabetes: z.boolean().default(false),
    smokingStatus: z.enum(["never", "former", "current"]),
    activityLevel: z.enum(["sedentary", "moderate", "active"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
