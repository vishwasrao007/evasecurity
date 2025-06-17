'use client'

import Message from '@/components/Message'
import TextAnimation from '@/components/TextAnimation'
import { type Role, useConversation } from '@11labs/react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { GitHub, X } from 'react-feather'
import { toast } from 'sonner'

export default function () {
  const { slug } = useParams()
  const [currentText, setCurrentText] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false)
  const loadConversation = () => {
    fetch(`/api/c?id=${slug}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.length > 0) {
          setMessages(
            res.map((i: any) => ({
              ...i,
              formatted: {
                text: i.content_transcript,
                transcript: i.content_transcript,
              },
            })),
          )
        }
      })
  }
  const conversation = useConversation({
    onError: (error: string) => { toast(error) },
    onConnect: () => { toast('Connected to ElevenLabs.') },
    onMessage: (props: { message: string; source: Role }) => {
      const { message, source } = props
      if (source === 'ai') setCurrentText(message)
      fetch('/api/c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slug,
          item: {
            type: 'message',
            status: 'completed',
            object: 'realtime.item',
            id: 'item_' + Math.random(),
            role: source === 'ai' ? 'assistant' : 'user',
            content: [{ type: 'text', transcript: message }],
          },
        }),
      }).then(loadConversation)
    },
  })
  const connectConversation = useCallback(async () => {
    toast('Setting up ElevenLabs...')
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const response = await fetch('/api/i', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (data.error) return toast(data.error)
      await conversation.startSession({ signedUrl: data.apiKey })
    } catch (error) {
      toast('Failed to set up ElevenLabs client :/')
    }
  }, [conversation])
  const disconnectConversation = useCallback(async () => {
    await conversation.endSession()
  }, [conversation])
  const handleStartListening = () => {
    if (conversation.status !== 'connected') connectConversation()
  }
  const handleStopListening = () => {
    if (conversation.status === 'connected') disconnectConversation()
    setCurrentText('')
  }
  useEffect(() => {
    return () => {
      disconnectConversation()
    }
  }, [slug])
  return (
    <>
      {/* <div className="fixed top-2 left-2 flex flex-row gap-x-2 items-center">
        <a href="index.html" target="_blank">
          <img loading="lazy" decoding="async" src="https://upload.wikimedia.org/wikipedia/commons/2/28/HDFC_Bank_Logo.svg" width="158" height="48" className="h-[30px] w-auto" alt="HDFC Bank Logo" />
        </a>
      </div> */}
      <TextAnimation currentText={currentText} isAudioPlaying={conversation.isSpeaking} onStopListening={handleStopListening} onStartListening={handleStartListening} />
    </>
  )
}
