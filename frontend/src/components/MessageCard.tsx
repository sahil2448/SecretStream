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
        <Card className="w-full text-center shadow-none dark py-4">
        <CardHeader>

            <CardTitle className="mb-2 text-3xl font-bold">
            Card Title
            </CardTitle>
             <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className="w-5 h-5" /></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=>handleDeleteConfirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            <CardDescription className="text-base text-muted-foreground">
            Card Description
            </CardDescription>
        </CardHeader>
        <CardContent className="mt-2 flex flex-row gap-2 justify-center">
            <p>Card Content</p>
        </CardContent>
        </Card>
    </div>
  )
}

export default MessageCard
