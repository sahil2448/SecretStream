import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User // why to write "as User" here? --> it is used to assert the type of the user object.

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();
   try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages},{new:true}) // new:true is used to return the updated document

    if(!updatedUser){
        return Response.json({ success: false, message: "failed to update user to accept messages" }, { status: 401 })
    }
    return Response.json({ success: true, message: "User status updated to accept messages" }, { status: 200 })

    } catch (error) {
        console.log("failed to update user to accept messages", error)
        return Response.json({ success: false, message: "Failed to update user status to accept messages" }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User // why to write "as User" here? --> it is used to assert the type of the user object.

    if (!session || !session.user) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 401 })
    }

    const userId = user._id;
  try {
      const foundUser = await UserModel.findById(userId);
      if(!foundUser){
          return Response.json({ success: false, message: "User not found" }, { status: 404 })
      }
      return Response.json({ success: true,isAcceptingMessage:foundUser.isAcceptingMessage }, { status: 200 })
  } catch (error) {
      return Response.json({ success: false, message: "Failed to get user status to accept messages" }, { status: 500 })
  }
}