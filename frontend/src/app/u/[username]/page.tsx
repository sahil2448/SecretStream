"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'

export default function Page() {
  const params = useParams() as { username?: string }
  const username = params?.username ?? 'user'

  // local state
  const [inputContent, setInputContent] = useState<string>('')
  const [sending, setSending] = useState(false)
  const charLimit = 500

  // derived state (no useEffect required)
  const inputPresent = inputContent.trim().length > 0

  const handleSendMessage = async ({ username, content }: { username: string; content: string }) => {
    if (!content.trim()) return
    setSending(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', { username, content })
      console.log('response', response.data)
      setInputContent('')
      toast.success('Message sent successfully !')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error sending message')
    } finally {
      setSending(false)
    }
  }

  // allow Ctrl+Enter or Cmd+Enter to send
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && inputPresent && !sending) {
      e.preventDefault()
      handleSendMessage({ username, content: inputContent })
    }
  }

  return (
    <main className="min-h-screen flex items-top justify-center px-4 py-12">
      <div className="w-full max-w-4xl h-fit bg-transparent p-8 flex flex-col gap-5">
        <header className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Public profile link</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">Send an anonymous message to <span className="font-medium">@{username}</span></p>
        </header>

        <section className="flex flex-col gap-4">
          <label htmlFor="anon-message" className="sr-only">
            Anonymous message for @{username}
          </label>

          {/* textarea styled to match the Input component size while remaining responsive */}
          <textarea
            id="anon-message"
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value.slice(0, charLimit))}
            onKeyDown={handleKeyDown}
            placeholder={`Write your anonymous message here (max ${charLimit} characters)`}
            className="w-full min-h-[120px] sm:min-h-[140px] md:min-h-[100px] rounded-md border px-4 py-3 text-sm leading-relaxed resize-vertical focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary"
            aria-label={`Write an anonymous message to ${username}`}
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-xs text-muted-foreground">Tip: Press <span className="font-medium">Ctrl/Cmd + Enter</span> to send</div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">{inputContent.length}/{charLimit}</div>

              <Button
                onClick={() => handleSendMessage({ username, content: inputContent })}
                disabled={!inputPresent || sending}
                className="h-[44px] px-5"
              >
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </section>


        <div className='w-full shadow-sm border flex flex-col gap-3 rounded-sm p-5'>
          <h1 className='text-2xl font-semibold'>Messages</h1>
          <div className='flex flex-col gap-5 justify-center items-center '>
              <p className='border-1 w-full text-center rounded-xs py-2 hover:bg-slate-100 transition-all duration-200 cursor-pointer'>What’s a hobby you’ve recently started? </p>
              <p className='border-1 w-full text-center rounded-xs py-2 hover:bg-slate-100 transition-all duration-200 cursor-pointer'> If you could have dinner with any historical figure, who would it be? </p>
              <p className='border-1 w-full text-center rounded-xs py-2 hover:bg-slate-100 transition-all duration-200 cursor-pointer'> What’s a simple thing that makes you happy?</p>
          </div>
        </div>

      </div>
    </main>
  )
}
