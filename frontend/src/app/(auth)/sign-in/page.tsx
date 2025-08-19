"use client";
import React, { use, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {useDebounceValue} from "usehooks-ts"
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const page = () => {

  const router = useRouter();
  
  const [username,setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);
    const decounceUsername = useDebounceValue(username,300);
  

  return (

    <div>page
    </div>
  )
}

export default page