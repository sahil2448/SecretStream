import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request){
    await dbConnect();
        const session = await getServerSession(authOptions);
        const user:User = session?.user as User // why to write "as User" here? --> it is used to assert the type of the user object.

        if(!session || !session.user){
            return Response.json({success:false,message:"Not Authenticated"},{status:401})
        }

        const userId = user._id ;
        const {acceptMessages} = await request.json();

        try {
            
        } catch (error) {
            console.log("failed to update user to accept messages",error)
    }
}