"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'

export default function Page() {
  const params = useParams() as { username?: string }
  const username = params?.username ?? 'user'

  const [inputContent, setInputContent] = useState<string>('')
  const [sending, setSending] = useState(false)
  const charLimit = 500
  const inputPresent = inputContent.trim().length > 0

  // NEW: suggestions state and loading
  const [suggestions, setSuggestions] = useState<string[]>([
    "What’s a hobby you’ve recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What’s a simple thing that makes you happy?"
  ])
  const [suggestLoading, setSuggestLoading] = useState(false)

  const handleSendMessage = async ({ username, content }: { username: string; content: string }) => {
    if (!content.trim()) return
    setSending(true)
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', { username, content })
      console.log('response', response.data)
      setInputContent('')
      toast.success('Message sent successfully !')
    } catch (er) {
        const error = er as AxiosError<{ message?: string }>;
        toast.error(error.response?.data?.message ?? "Error sending message");
        console.error("Error sending message:", error.message);
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && inputPresent && !sending) {
      e.preventDefault()
      handleSendMessage({ username, content: inputContent })
    }
  }

  // NEW: fetch suggestions from our Next.js API
  const fetchSuggestions = async () => {
    try {
      setSuggestLoading(true)
      const res = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })
      const data = await res.json()
      if (res.ok && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions)
      } else {
        console.error('Suggest API error:', data)
        toast.error('Could not fetch suggestions')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error fetching suggestions')
    } finally {
      setSuggestLoading(false)
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
                className="h-[44px] px-5 cursor-pointer"
              >
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </section>
          <div> <Button className='cursor-pointer' onClick={fetchSuggestions}>
              {suggestLoading ? 'Loading...' : 'Suggest-messages'}
            </Button></div>
           
        <div className='w-full shadow-sm border flex flex-col gap-3 rounded-sm p-5'>
            <h1 className='text-2xl font-semibold'>Messages</h1>
          <div className='flex flex-col gap-5 justify-center items-center '>
            {suggestions.map((s, i) => (
              <p
                key={i}
                onClick={() => setInputContent(s)}
                className='border-1 w-full text-center rounded-xs py-2 hover:bg-slate-100 transition-all duration-200 cursor-pointer'
                title="Click to insert into the textarea"
              >
                {s}
              </p>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
