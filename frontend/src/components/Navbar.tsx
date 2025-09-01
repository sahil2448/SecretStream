"use client"
import React from 'react'
import Link from 'next/link'
import { useSession,signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
// import { useRouter } from 'next/router'



function Navbar() {
    const {data:session} = useSession()
    // const router = useRouter();
    const user:User = session?.user as User
  return (
   <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row md:px-20 justify-between items-center">
        <Link href="/"  className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </Link>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto cursor-pointer bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100  cursor-pointer text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>

  )
}

export default Navbar
