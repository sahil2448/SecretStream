import { z } from "zod";

export const usernameValidation = z.string().min(2,"username must be atleast of 2 characters").max(20,"username must be less than 20 characters").regex(/^[A-Za-z][A-Za-z0-9_]{2,15}$/,"username must be alphanumeric"); 

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Please enter a valid email address"}),
    password:z.string().min(6,"Password must be atleast of 8 characters")
})