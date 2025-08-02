import {z} from "zod";

export const messageSchema = z.object({
    content:z
    .string()
    .min(10,"Message must be atleast of 10 characters")
    .max(300,"Message must be less than 1000 characters")
}) 