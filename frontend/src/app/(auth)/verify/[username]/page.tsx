"use client";
import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifySchema } from "@/Schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import * as z from "zod";

const VerifyAccount = () => {
  const router = useRouter();
  const params = useParams();
  const username = params?.username as string | undefined;
  const decodedUsername = username ? decodeURIComponent(username) : null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    if (!decodedUsername) {
      toast.error("Missing username in URL.");
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("from verify-code--->",decodedUsername, data.code);
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: decodedUsername,
        code: data.code,
      });

      toast.success(response.data.message ?? "Account verified successfully");
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error verifying account:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const serverMessage = axiosError?.response?.data?.message;
      toast.error(serverMessage ?? "Error verifying the account");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster richColors />
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter code"
                      autoFocus
                      disabled={isSubmitting}
                      {...field}
                      value={field.value ?? ""} // ✅ prevents uncontrolled warning
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Verifying…" : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
