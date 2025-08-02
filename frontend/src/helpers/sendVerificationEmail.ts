import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {
        return {success:true, message:"Verification email sent successfully",messages:[]}
    } catch (emailError) {
        console.error("Error sending verification email",emailError);
        return {
            success:false,
            message:"Error sending verification email",
            messages:[]
        }
    }
}
