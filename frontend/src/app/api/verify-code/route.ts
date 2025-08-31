import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {username,code} = await request.json(); 
        console.log(username,code)
        const decodedUsername = decodeURIComponent(username); // Decode URL-encoded username--> username with space will be converted to %20

        const user = await UserModel.findOne({username:decodedUsername})

        if(!user){
            return Response.json({success:false,message:"User not found"},{status:404})
        }

        const isValidCode = user.verifyCode === code;
        const isNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isNotExpired && isValidCode){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success:true,
                message:"Verification successful",
            },{status:200})
        } else if(!isNotExpired){
            return Response.json({
                success:false,
                message:"Vefication code has expired",      
            },{status:400})
        } else{
            return Response.json({
                success:false,
                message:"Invalid verification code",
            },{status:400})
        }
        
    }  catch (error) {
        console.error("Error Verifying code", error);
        return Response.json({success:false,message:"Error Verifying code"},{status:500})
    }
}