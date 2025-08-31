import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

// NOTE: use a permissive type for the context to avoid Next.js type-definition mismatches
export async function DELETE(request: Request, context: any) {
  // extract and assert params shape
  const params = context?.params as { messageid?: string } | undefined;
  const messageId = params?.messageid;

  if (!messageId) {
    return NextResponse.json({ success: false, message: "Missing message id" }, { status: 400 });
  }

  await dbConnect();
  console.log("messageid at backend", messageId);

  // get session
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
  }

  // assert user type safely
  const user = session.user as { _id?: string } | undefined;
  if (!user?._id) {
    return NextResponse.json({ success: false, message: "Invalid user" }, { status: 401 });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(messageId);

    const updatedUser = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: objectId } } }
    );

    if (!updatedUser || updatedUser.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Failed to delete message or not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error in delete message:", err);
    return NextResponse.json({ success: false, message: "Failed to delete message" }, { status: 500 });
  }
}
