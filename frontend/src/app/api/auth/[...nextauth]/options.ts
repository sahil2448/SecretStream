import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { toast } from "sonner";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            
            async authorize(credentials:any):Promise<any> {
                await dbConnect();

                try {
                    if (!credentials?.identifier || !credentials?.password) {
                        toast.error("Missing credentials");
                        throw new Error("Missing credentials");
                    }

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        toast.error("No user found with the given email");
                        throw new Error("No user found with the given email");
                    }

                    if (!user.isVerified) {
                        toast.error("Please verify your account first!");
                        throw new Error("Please verify your account first!");
                    }

                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password, 
                        user.password
                    );
                    
                    if (isPasswordCorrect) {
                        return {
                            _id: user._id?.toString(),
                            email: user.email,
                            username: user.username,
                            isVerified: user.isVerified,
                            isAcceptingMessage: user.isAcceptingMessage
                        };
                    } else {
                        toast.error("Incorrect password");
                        throw new Error("Incorrect password");
                    }
                } catch (err: any) {
                    toast.error(err.message);
                    throw new Error(err.message || "Authentication failed");
                }
            }
        })
    ],
    pages: {
        signIn: "/sign-in"
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
                session.user.username = token.username as string;
            }
            return session;
        },
        
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        }
    }
};
