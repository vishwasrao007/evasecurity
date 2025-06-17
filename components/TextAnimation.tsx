'use client'

import { useTypingEffect } from '@/components/useTypingEffect'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

type AIState = 'idle' | 'listening' | 'speaking'

interface Props {
  onStartListening?: () => void
  onStopListening?: () => void
  isAudioPlaying?: boolean
  currentText: string
}

export default function AiTalkingAnimation({ onStartListening, onStopListening, isAudioPlaying, currentText }: Props) {
  const [aiState, setAiState] = useState<AIState>('idle')
  const animatedCurrentText = useTypingEffect(currentText && currentText.trim().length > 0 ? currentText : 'Hi Good Morning! How may I help you?', 20)
  const displayedText = useTypingEffect('Click the circle to start the conversation', 20)

  const handleCircleClick = () => {
    if (aiState === 'listening' || aiState === 'speaking') {
      onStopListening?.()
    } else if (!isAudioPlaying) {
      onStartListening?.()
    }
  }

  useEffect(() => {
    if (isAudioPlaying) setAiState('speaking')
    else if (aiState === 'speaking' && currentText) setAiState('listening')
    else setAiState('idle')
  }, [isAudioPlaying, currentText])

  // Add effect to handle auto-stop after "Have a wonderful day!"
  useEffect(() => {
    if (currentText.toLowerCase().includes('have a wonderful day!')) {
      // Wait for 1 second after the message is complete
      const timer = setTimeout(() => {
        if (aiState === 'speaking' || aiState === 'listening') {
          // First stop
          onStopListening?.()
          setAiState('idle')
          
          // Second stop after a small delay
          setTimeout(() => {
            onStopListening?.()
            setAiState('idle')
          }, 200)
        }
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [currentText, onStopListening, aiState])

  useEffect(() => {
    const timer = setTimeout(() => {
      onStartListening?.()
      setAiState('listening')
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-between shadow-xl h-[100vh] overflow-hidden" style={{ minHeight: '100vh' }}>
     
      <div className='cont' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh', width: '100vw', maxWidth: 440, position: 'relative', overflow: 'hidden', borderRadius: '45px' }}>
        {/* Background Gradient */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'radial-gradient(223.36% 111.8% at 50% 100%, #E8DDFF 0%, #71B6E4 40.5%, #687FDE 69.5%, #3A59D6 100%)',
            filter: 'blur(12px)',
            zIndex: -1,
            borderRadius: '55px'
          }}
        />
        <div className="absolute top-5 z-10" style={{ right: '1.225rem' }}>
          <img src="/close.svg" alt="Close" className="h-8" />
        </div>
        {/* Top Section */}
        <div className="flex flex-col items-center w-full pt-[3.2rem] z-10">
          {aiState === 'idle' && (
            <div className="flex flex-col items-center w-4/5 mx-auto text-center">
              <span className="text-white text-base font-medium">Welcome to HDFC Bank!</span>
              <span className="text-[52px] font-extrabold text-white leading-none">
                <span className="text-[#AEE2FF]">I'm EVA</span>
              </span>
              <span className="text-white text-xl font-medium">Your all new AI Assistant</span>
            </div>
          )}
          <div className="relative flex items-center justify-center mb-0 md:mb-[88px]">
            <div
              className="rounded-full p-2"
              onClick={handleCircleClick}
              style={{ width: 350, height: 300 }}
        >
          <img
                src={aiState === 'listening' ? '/eva.gif' : aiState === 'speaking' ? '/eva.gif' : '/eva.gif'}
            alt={aiState === 'listening' ? 'AI is listening' : aiState === 'speaking' ? 'AI is speaking' : 'AI is idle'}
                style={{ width: 600, height: 400 }}
                className="rounded-full object-cover"
          />
            </div>
          </div>
          {/* Animated Eva's voice text replaces greeting/help text below Eva image */}
          <div className="flex flex-col items-center w-4/5 mx-auto text-center">
            {animatedCurrentText.split(/(?<=[.?!])\s+/).map((sentence, idx) => {
              const trimmedSentence = sentence.trim();
              const lowerSentence = trimmedSentence.toLowerCase();
              
              // Check for specific phrases
              const isQuestion = trimmedSentence.endsWith('?');
              const isPrompt = lowerSentence.includes('please enter') || lowerSentence.includes('kindly provide');
              const startsWithPleaseTellMe = lowerSentence.startsWith('please tell me');
              const startsWithPleaseSayYour = lowerSentence.startsWith('please say your');
              const startsWithPleaseConfirm = lowerSentence.startsWith('please confirm');
              const isHaveWonderfulDay = lowerSentence === 'have a wonderful day!';

              // Combine all conditions
              const shouldBeBold = isQuestion || isPrompt || startsWithPleaseTellMe || 
                                 startsWithPleaseSayYour || startsWithPleaseConfirm || 
                                 isHaveWonderfulDay;

              return shouldBeBold ? (
                <span key={idx} className="block text-2xl font-bold text-white">{trimmedSentence}</span>
              ) : (
                <span key={idx} className="block text-base font-normal text-white">{trimmedSentence}</span>
              );
            })}
          </div>
      </div>
        {/* Bottom Listening Box */}
        <div className="w-full px-2 pb-2 pt-2">
          <div className="bg-white flex flex-col items-center justify-center w-full min-h-[180px] h-[180px] p-2" style={{ borderRadius: '43px' }}>
            <div className="flex items-center gap-2 mb-1">
              {aiState === 'listening' && <span className="text-[#5B7FFF] font-semibold text-lg">Listening...</span>}
      </div>
            {/* Start and End Buttons moved inside white box */}
            <div className="flex flex-col justify-center mt-auto w-full">
              <div className="flex-1 flex justify-center">
                <img
                  src={
                    aiState === 'listening'
                      ? '/blob-listening.gif'
                      : aiState === 'speaking'
                      ? '/blob-answering.gif'
                      : '/blob-static.gif'
                  }
                  alt="Start"
                  width={100}
                  height={100}
                  className={`cursor-pointer ${aiState === 'listening' || aiState === 'speaking' ? 'pointer-events-none' : ''}`}
          onClick={() => {
            if (!isAudioPlaying) {
              onStartListening?.()
              setAiState('listening')
            }
          }}
                />
              </div>
              <div className="flex-1 flex justify-end pr-[6px] pb-[6px]">
                <img
                  src="/end-call.svg"
                  alt="End"
                  width={30}
                  height={30}
                  className={`cursor-pointer ${aiState === 'idle' ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => {
            if (aiState === 'listening' || aiState === 'speaking') {
              onStopListening?.()
              setAiState('idle')
            }
          }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .cont {
          width: 100vw;
          max-width: 440px;
        }
        @media (min-width: 768px) {
          .cont {
            width: 440px;
          }
          video[src="/eva-bg.mp4"] {
            border-radius: 55px;
          }
        }
      `}</style>
    </div>
  )
}
