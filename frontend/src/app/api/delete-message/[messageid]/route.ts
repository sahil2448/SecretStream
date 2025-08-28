// import { messages } from '@/messages.json';
import { User } from '../../../../model/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { toast } from 'sonner';


export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
     await dbConnect();

     const messageId = params.messageid;
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User // why to write "as User" here? --> it is used to assert the type of the user object.

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }

    try {
        const updatedUser = await UserModel.updateOne({_id:user._id},{$pull:{messages:{_id:messageId}}});

        if(updatedUser.modifiedCount == 0){
            return Response.json({ success: false, message: "Failed to delete message" }, { status: 500 })
        }

        toast.success("Message deleted successfully !")
        return Response.json({ success: true, message: "Message deleted successfully" }, { status: 200 })

    } catch (error) {
        console.log(error,"Error in delete message");
        return Response.json({ success: false, message: "Failed to delete message" }, { status: 500 })
    }



}