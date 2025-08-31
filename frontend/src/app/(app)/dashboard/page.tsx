// "use client";
// import {MessageCard} from "@/components/MessageCard";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Message } from "@/model/User";
// import { AcceptMessageSchema } from "@/Schemas/acceptMessageSchema";
// import { ApiResponse } from "@/types/ApiResponse";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Separator } from "@radix-ui/react-separator";
// import axios, { AxiosError } from "axios";
// import { Loader2, RefreshCcw } from "lucide-react";
// import { User } from "next-auth";
// import { useSession } from "next-auth/react";
// import React, { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// export default function DashboardPage() {

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);

//   const handleDeleteMessage = (messageId: string) => {
//     setMessages(messages.filter((message) => message._id !== messageId))
//   }

//   const { data: session } = useSession();

//   console.log("printing session--->", useSession());

//   const form = useForm({
//     resolver: zodResolver(AcceptMessageSchema)
//   })

//   const { register, watch, setValue } = form;

//   const acceptMessages = watch('acceptMessages');

//   const fetchAcceptMessage = useCallback(async () => {
//     setIsSwitchLoading(true);
//     try {
//       const response = await axios.get("/api/accept-messages");
//       setValue('acceptMessages', response.data.isAcceptingMessage);
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast.error(axiosError.response?.data.message ?? "Error accepting messages");
//     } finally {
//       setIsSwitchLoading(false);
//     }
//   }, [setValue])

//   const fetchMessages = useCallback(async (refresh: boolean = false) => {
//     setIsLoading(true)
//     setIsSwitchLoading(false);
//     try {
//       const response = await axios.get(`/api/get-messages`)
//       console.log("response from dashboard",response.data)
//       setMessages(response.data.messages || []);

//       if (refresh) {
//         toast.info("Showing latest messages !")
//       }

//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast.info(axiosError.response?.data.message ?? "Error fetching messages");
//     } finally {
//       setIsLoading(false);
//       setIsSwitchLoading(false);
//     }
//   }, [setIsLoading, setMessages])


//   useEffect(() => {
//     if (!session || !session.user) return
//     fetchMessages();
//     fetchAcceptMessage();
//   }, [session, setValue, fetchAcceptMessage, fetchMessages])

//   // handle switch change
//   const handleSwitchChange = async () => {
//     try {
//       await axios.post(`/api/accept-messages`, {
//         acceptMessages: !acceptMessages
//       })
//       setValue('acceptMessages', !acceptMessages)
//       toast.success("Message status updated successfully !")

//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>;
//       toast.error(axiosError.response?.data.message ?? "Error updating message status");
//     }

//   }
//   // const {username:User} = session?.user as User
//   // console.log(User)

//   // TODO: do more research


//   // const {data:session} = useSession()
//   const user: User = session?.user as User
//   const baseUrl = `${window.location.protocol}/${window.location.host}`
//   console.log(baseUrl)
//   const profileUrl = `${baseUrl}/u/${user?.username}`
//   // const profileUrl = `${baseUrl}/u/`

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(profileUrl)
//     toast.success("Copied to clipboard !")
//   }

//   // if(!session || !session.user) return <div>Please login to view this page</div>

//   return (<div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//     <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

//     <div className="mb-4">
//       <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
//       <div className="flex items-center">
//         <Input
//           type="text"
//           value={profileUrl}
//           disabled
//           className="input input-bordered w-full p-2 mr-2"
//         />
//         <Button onClick={copyToClipboard}>Copy</Button>
//       </div>
//     </div>

//     <div className="mb-4">
//       <Switch
//         {...register('acceptMessages')}
//         checked={acceptMessages}
//         onCheckedChange={handleSwitchChange}
//         className="cursor-pointer"
//         disabled={isSwitchLoading}
//       />
//       <span className="ml-2">
//         Accept Messages: {acceptMessages ? 'On' : 'Off'}
//       </span>
//     </div>
//     <Separator />

//     <Button
//       className="mt-4"
//       variant="outline"
//       onClick={(e) => {
//         e.preventDefault();
//         fetchMessages(true);
//       }}
//     >
//       {isLoading ? (
//         <Loader2 className="h-4 w-4 animate-spin" />
//       ) : (
//         <RefreshCcw className="h-4 w-4" />
//       )}
//     </Button>
//     <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//       {messages.length > 0 ? (
//         messages.map((message, index) => (
//           <MessageCard
//             key={message._id as string}
//             message={message}
//             onMessageDelete={handleDeleteMessage}
//           />
//         ))
//       ) : (
//         <p>No messages to display.</p>
//       )}
//     </div>
//   </div>)
// }


"use client";

import React, { useCallback, useEffect, useState } from "react";
import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/Schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function DashboardPage() {
  const { data: session } = useSession();
  // NOTE: session may be undefined on first render
  const user = session?.user as User | undefined;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // profileUrl is built on the client to avoid `window` during SSR/prerender
  const [profileUrl, setProfileUrl] = useState<string>("");

  // Form setup (switch)
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  // Safe delete handler (functional update to avoid stale closure)
  const handleDeleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => String(m._id) !== String(messageId)));
  }, []);

  // Fetch whether the user accepts messages
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-messages");
      setValue("acceptMessages", Boolean(response.data.isAcceptingMessage));
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error fetching accept message status");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  // Fetch messages from server
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get("/api/get-messages");
        // Ensure we always set an array
        setMessages(response.data?.messages ?? []);
        if (refresh) toast.info("Showing latest messages !");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(axiosError.response?.data.message ?? "Error fetching messages");
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    []
  );

  // On session available, load data
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Build profileUrl on client only (avoids window in SSR)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user?.username) {
      setProfileUrl("");
      return;
    }
    // Use // between protocol and host
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    setProfileUrl(`${baseUrl}/u/${user.username}`);
  }, [user?.username]);

  // Switch change handler
  const handleSwitchChange = async () => {
    try {
      await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success("Message status updated successfully !");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? "Error updating message status");
    }
  };

  const copyToClipboard = () => {
    if (!profileUrl || typeof navigator === "undefined") {
      toast.error("Profile URL not available");
      return;
    }
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => toast.success("Copied to clipboard !"))
      .catch(() => toast.error("Failed to copy"));
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <Input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register("acceptMessages")}
          checked={Boolean(acceptMessages)}
          onCheckedChange={handleSwitchChange}
          className="cursor-pointer"
          disabled={isSwitchLoading}
        />
        <span className="ml-2">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => {
            const id = String((message as any)._id ?? "");
            return (
              <MessageCard
                key={id}
                message={message}
                onMessageDelete={(mid: string) => handleDeleteMessage(mid)}
              />
            );
          })
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}
