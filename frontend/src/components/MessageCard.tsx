"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"

type MessageCardProps = {
    message:Message;
    onMessage:(messageId:string)=>void
}



function MessageCard({message,onMessageDelete}:MessageCardProps) {
  const handleDeleteConfirm = async() =>{
  const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
  toast.success("Message Deleted Successfully !")

  onMessageDelete(message._id)

}
  return (
    <div>
        <Card className="w-full text-center shadow-none light py-4">
        <CardHeader>

            <CardTitle className="mb-2 text-3xl font-bold">
            <p>{message}</p>
            </CardTitle>
             <AlertDialog>
      <AlertDialogTrigger asChild className="w-10 self-end h-10 cursor-pointer">
        <Button variant="destructive">X</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

        </CardHeader>
        </Card>
    </div>
  )
}

export default MessageCard
