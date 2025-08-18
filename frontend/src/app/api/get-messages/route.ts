import { User } from './../../../model/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function GET(request:Request){
     await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User // why to write "as User" here? --> it is used to assert the type of the user object.

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id); // Convert _id string to ObjectId

    try {
        const user = await UserModel.aggregate([
            {$match:{_id:userId}}, // match the user by _id
            {$unwind:"$messages"}, // unwind the messages array
            {$sort:{"messages.createdAt":-1}}, // sort the messages by createdAt
            {$group:{_id:"$_id",message:{$push:"$messages"}}} // group the messages by _id
        ]);

        if(!user || user.length==0){
            return Response.json({ success: false, message: "User not found" }, { status: 404 })
        }
        else{
            return Response.json({ success: true,messages:user[0].messages }, { status: 200 })
        }
    } catch (error) {
        console.log("failed to get messages",error);
        return Response.json({ success: false, message: "Failed to get messages" }, { status: 500 })
    }

}