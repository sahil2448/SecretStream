// import { messages } from '@/messages.json';
import { User } from '../../../../model/User';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { toast } from 'sonner';
import { NextResponse } from 'next/server';


export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
     await dbConnect();
     const messageId = params.messageid;
     console.log("messageid at backend",messageId);
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User // why to write "as User" here? --> it is used to assert the type of the user object.

    if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
    }

    try {

        const updatedUser = await UserModel.updateOne({_id:user._id},{$pull:{messages:{_id:new mongoose.Types.ObjectId(messageId)}}});

        if(updatedUser.modifiedCount == 0){
      return NextResponse.json({ success: false, message: "Failed to delete message" }, { status: 500 });
        }

    return NextResponse.json({ success: true, message: "Message deleted successfully" }, { status: 200 });

    } catch (error) {
        console.log(error,"Error in delete message");
    return NextResponse.json({ success: false, message: "Failed to delete message" }, { status: 500 });
    }

}