import { useState, useRef, useEffect, useCallback } from 'react'
import Icon from './Icon'

const POSITIONS = [
  { id: 'ai-ml',        icon: 'cpu', label: 'AI/ML Engineer',       desc: 'ML models, LLMs, RAG, fine-tuning' },
  { id: 'nlp',          icon: 'flask', label: 'NLP Researcher',        desc: 'Thesis, author profiling, transformers' },
  { id: 'fullstack',    icon: 'zap', label: 'Full-Stack Developer',   desc: 'FastAPI, React, system design' },
  { id: 'data-science', icon: 'chart', label: 'Data Scientist',        desc: 'Analysis, metrics, experimental design' },
]

const SUGGESTIONS = [
  "What projects has Manar built?",
  "Tell me about his thesis research",
  "What's his tech stack?",
  "What are his strongest skills?",
]

export default function AssistantWidget() {
  const [isOpen, setIsOpen]               = useState(false)
  const [mode, setMode]                   = useState('chat')       // 'chat' | 'interview'
  const [position, setPosition]           = useState(null)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [messages, setMessages]           = useState([])
  const [input, setInput]                 = useState('')
  const [isLoading, setIsLoading]         = useState(false)
  const [isRecording, setIsRecording]     = useState(false)
  const [isSpeaking, setIsSpeaking]       = useState(false)

  const messagesEndRef   = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef   = useRef([])
  const currentAudioRef  = useRef(null)
  const inputRef         = useRef(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Reset on mode switch
  useEffect(() => {
    setMessages([])
    setInterviewStarted(false)
    setPosition(null)
    setInput('')
    stopSpeaking()
  }, [mode])

  // ── API calls ────────────────────────────────────────────────────────────

  const callChat = useCallback(async (msgs, positionId) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: msgs, mode, position: positionId }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Server error ${res.status}`)
    }
    const data = await res.json()
    return data.content
  }, [mode])

  const sendMessage = useCallback(async (userMsg, currentMsgs, positionId) => {
    const updatedMsgs = userMsg ? [...currentMsgs, userMsg] : currentMsgs
    if (userMsg) setMessages(updatedMsgs)
    setIsLoading(true)
    try {
      const content = await callChat(updatedMsgs, positionId)
      const aiMsg = { role: 'assistant', content }
      const finalMsgs = [...updatedMsgs, aiMsg]
      setMessages(finalMsgs)
      if (mode === 'interview') speak(content)
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `${err.message || 'Connection error'}. Please try again.` }])
    } finally {
      setIsLoading(false)
    }
  }, [callChat, mode])

  // ── Send / handle input ──────────────────────────────────────────────────

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    sendMessage({ role: 'user', content: text }, messages, position?.id)
  }, [input, isLoading, messages, position, sendMessage])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // ── Interview start ──────────────────────────────────────────────────────

  const startInterview = useCallback((pos) => {
    setPosition(pos)
    setInterviewStarted(true)
    setMessages([])
    sendMessage(null, [], pos.id)   // AI opens the interview
  }, [sendMessage])

  // ── Voice recording ──────────────────────────────────────────────────────

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioChunksRef.current = []
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        await transcribeAndSend(blob)
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
    } catch {
      alert('Microphone access denied. Please allow mic access to use voice input.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const transcribeAndSend = async (blob) => {
    setIsLoading(true)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio: base64, mimeType: 'audio/webm' }),
      })
      const { text } = await res.json()
      if (text?.trim()) {
        const userMsg = { role: 'user', content: text }
        const snap = messages   // snapshot before state update
        setMessages(prev => [...prev, userMsg])
        await sendMessage(null, [...snap, userMsg], position?.id)
      }
    } catch {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  // ── TTS ──────────────────────────────────────────────────────────────────

  const speak = async (text) => {
    stopSpeaking()
    setIsSpeaking(true)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      currentAudioRef.current = audio
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url) }
      audio.onerror = () => setIsSpeaking(false)
      audio.play()
    } catch {
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null }
    setIsSpeaking(false)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes widgetOpen {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>

      {/* ── Floating button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Manar AI assistant"
          className="fixed bottom-7 right-7 flex items-center gap-2.5 pl-4 pr-5 py-3.5 bg-accent hover:bg-accent-dim text-paper rounded-full shadow-lg hover:shadow-xl hover:scale-105 z-[9999] transition-all"
        >
          <Icon name="message" size={20} />
          <span className="font-medium text-sm whitespace-nowrap">Ask AI about Manar</span>
        </button>
      )}

      {/* ── Panel ── */}
      {isOpen && (
        <div
          className="fixed bottom-7 right-4 sm:right-7 w-[calc(100vw-32px)] sm:w-[380px] h-[560px] bg-paper-raised border border-line flex flex-col z-[9999] overflow-hidden"
          style={{ animation: 'widgetOpen 0.18s ease-out' }}
        >

          {/* Header */}
          <div className="px-3.5 py-3 border-b border-line flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 shrink-0 bg-accent text-paper flex items-center justify-center">
              <Icon name="bot" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-ink font-semibold text-sm">Manar AI</div>
              <div className="text-ink-faint text-[11px] font-mono">
                {mode === 'interview' && interviewStarted ? `${position?.label} Interview` : 'Ask me anything'}
              </div>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-0.5 border border-line shrink-0">
              {[['chat', 'Chat'], ['interview', 'Interview']].map(([m, label]) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-2.5 py-1 text-[11px] font-mono transition-colors ${mode === m ? 'bg-accent text-paper' : 'text-ink-faint'}`}>
                  {label}
                </button>
              ))}
            </div>

            <button onClick={() => { setIsOpen(false); stopSpeaking() }}
              className="text-ink-faint hover:text-ink text-xl leading-none pl-1 shrink-0">×</button>
          </div>

          {/* Body */}
          {mode === 'interview' && !interviewStarted ? (

            /* Position selector */
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-ink-faint text-xs text-center mb-4 mt-1">
                Select a role to simulate a real job interview
              </p>
              {POSITIONS.map(pos => (
                <button key={pos.id} onClick={() => startInterview(pos)}
                  className="w-full mb-2.5 border border-line hover:border-accent/50 p-3 flex items-center gap-3 text-left transition-colors"
                >
                  <span className="text-accent shrink-0"><Icon name={pos.icon} size={22} /></span>
                  <div>
                    <div className="text-ink font-medium text-sm">{pos.label}</div>
                    <div className="text-ink-faint text-xs mt-0.5">{pos.desc}</div>
                  </div>
                </button>
              ))}
            </div>

          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3.5 pt-3.5 pb-1.5 flex flex-col gap-2.5">
                {messages.length === 0 && mode === 'chat' && (
                  <div className="mt-4">
                    <p className="text-ink-faint text-xs text-center mb-3">
                      Ask me anything about Manar
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTIONS.map(s => (
                        <button key={s} onClick={() => sendMessage({ role: 'user', content: s }, [], null)}
                          className="border border-line hover:border-accent/50 px-3 py-2 text-ink-dim text-xs text-left transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-word ${
                      msg.role === 'user' ? 'bg-accent text-paper' : 'bg-paper border border-line text-ink'
                    }`}>{msg.content}</div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-1.5 px-3.5 py-2.5 items-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent"
                        style={{ animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Interview end session bar */}
              {mode === 'interview' && interviewStarted && (
                <div className="text-center text-[11px] py-1 border-t border-line shrink-0">
                  <button onClick={() => { setInterviewStarted(false); setMessages([]); setPosition(null); stopSpeaking() }}
                    className="text-accent">
                    End session
                  </button>
                </div>
              )}

              {/* Input area */}
              <div className="px-3 py-2.5 border-t border-line flex gap-1.5 items-end shrink-0">
                {/* Speaker toggle (interview only) */}
                {mode === 'interview' && (
                  <button
                    onClick={isSpeaking ? stopSpeaking : undefined}
                    title={isSpeaking ? 'Click to stop' : 'AI voice active'}
                    className={`border w-9 h-9 flex items-center justify-center shrink-0 ${
                      isSpeaking ? 'border-accent/50 text-accent cursor-pointer' : 'border-line text-ink-faint cursor-default'
                    }`}
                  ><Icon name={isSpeaking ? 'volumeOn' : 'volumeOff'} size={15} /></button>
                )}

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === 'interview' ? 'Type your answer…' : 'Ask about Manar…'}
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 bg-paper border border-line text-ink text-[13px] px-3 py-2 outline-none focus:border-accent resize-none font-sans"
                  style={{ maxHeight: 80, lineHeight: 1.5 }}
                />

                {/* Mic button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading && !isRecording}
                  title={isRecording ? 'Stop recording' : 'Voice input'}
                  className={`border w-9 h-9 flex items-center justify-center shrink-0 transition-colors ${
                    isRecording ? 'border-accent/60 text-accent bg-accent/10' : 'border-line text-ink-dim'
                  }`}
                ><Icon name="mic" size={15} /></button>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`w-9 h-9 flex items-center justify-center shrink-0 transition-colors ${
                    input.trim() && !isLoading ? 'bg-accent text-paper' : 'bg-paper border border-line text-ink-faint'
                  }`}
                ><Icon name="send" size={14} /></button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
