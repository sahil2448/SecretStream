import {z} from "zod";

export const verifySchema = z.object({
    verifyCode:z.string().min(6,"Verification code must be of 6 characters")
}) 