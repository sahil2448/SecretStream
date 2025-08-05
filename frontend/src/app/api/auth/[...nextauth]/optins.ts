import { CredentialsProvider } from './../../../../../node_modules/next-auth/src/providers/credentials';
import { AuthOptions } from './../../../../../node_modules/next-auth/core/types.d';
import { NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions={
    providers:[
        // CredentialsProvider({
            
        // })
    ]
}