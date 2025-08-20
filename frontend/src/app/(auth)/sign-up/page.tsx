"use client";
import React, { use, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm,SubmitHandler } from "react-hook-form"
import * as z from "zod"
import {useDebounceValue} from "usehooks-ts"
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/signUpSchema";
import axios , {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Loader2} from "lucide-react"


const page = () => {

  const router = useRouter();
  
  const [username,setUsername] = useState('');
  const [usernameMessage,setUsernameMessage] = useState('');
  const [isCheckingUsername,setIsCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);
    const [debounceUsername] = useDebounceValue(username,300);
  
    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver:zodResolver(signUpSchema),
      defaultValues:{
        username:'',
        email:'',
        password:'',
      }
    })

    useEffect(()=>{
      const checkUsernameUnique = async() =>{
        if(debounceUsername){
          setIsCheckingUsername(true);
          setUsernameMessage('');
          try{
            const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`)
            console.log(response);
            setUsernameMessage(response.data.message);
          }catch(error){
            const axiosError = error as AxiosError<ApiResponse>;
            setUsernameMessage(axiosError.response?.data.message??"Error checking username");
          } finally{
            setIsCheckingUsername(false);
          }

        }
      }

      checkUsernameUnique();
    },[debounceUsername])

    const onSubmit = async(data:z.infer<typeof signUpSchema>) =>{
      setIsSubmitting(true);

      try {  
        const response = await axios.post<ApiResponse>("/api/sign-up",data);
        toast({
          title:'Success',
          message:response.data.message,
          duration:5000
        })

        router.replace(`/verify/${username}`)
        setIsSubmitting(false);
      } catch (error) {
        console.error("error in sign up",error)
        const axiosError = error as AxiosError<ApiResponse>;
        let errorMessage = axiosError.response?.data.message;
        toast({
          title:'Signup failed',
          message:errorMessage,
          variant:'destructive',

        })

        setIsSubmitting(false);
      }
      } 

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md space-y-8">
          <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Join Mystery Message
              </h1>
              <p className="mb-4">
                Sign up to start your anonymous adventure
              </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} onChange={(e)=>{
                        field.onChange(e)
                        setUsername(e.target.value)
                      }} />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    <p className={`text-sm ${usernameMessage === 'Looks perfect'?'text-green-500':'text-red-500' }`}>test : {usernameMessage}</p>
                    <FormMessage />
            </FormItem>
          )}
        />
        <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field}/>
                    </FormControl>
                    <FormMessage />
            </FormItem>
          )}
        />
        <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field}/>
                    </FormControl>
                    <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} >
          {
            isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait</>) : ("Sign Up")
          }
        </Button>
            </form>
          </Form>
          <div className="flex">
            <p>Already Member?</p>
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign-in</Link>
          </div>
      </div>
    </div>
  )
}

export default page
