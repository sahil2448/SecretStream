"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { set } from 'mongoose'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'

function Page() {
    const [inputPresent, setInputPresent] = useState(false);
    const [inputContent,setInput] = useState("");

  const params = useParams();
  useEffect(()=>{
    if(inputContent.length > 0){
      setInputPresent(true);
    } else{
      setInputPresent(false);
    }
  },[inputContent,inputPresent])

  const {username} = params

  const handleSendMessage  = async({username,content})=>{
    try {
         const response = await axios.post<ApiResponse>(`/api/send-message`,{username,content})
          console.log("response",response.data);
          toast.success("Message sent successfully !")
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message");
    }

  }

  return (
    <div className='px-10 py-10 flex flex-col gap-10 justify-center items-center'>
      <div>      
        <p className='font-bold text-4xl'>      
          Public profile link
      </p>  
      </div>

    <div className=' flex flex-col justify-center gap-3'>
      <p>Send Anonymous message to @{username}</p>
      <Input onChange={(e)=>setInput(e.target.value)} className='h-[100px] w-[50vw]  align-text-top' type="text" placeholder="write your anonymous messages her" />
    </div>

    <div>
      <Button onClick={()=>handleSendMessage({username,content:inputContent})} className='w-[80px] h-auto cursor-pointer' disabled={!inputPresent}>Send</Button>
    </div>

    </div>
  )
}

export default Page
