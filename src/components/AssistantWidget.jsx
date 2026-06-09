import { useState, useRef, useEffect, useCallback } from 'react'

const POSITIONS = [
  { id: 'ai-ml',        icon: '🤖', label: 'AI/ML Engineer',       desc: 'ML models, LLMs, RAG, fine-tuning' },
  { id: 'nlp',          icon: '🔬', label: 'NLP Researcher',        desc: 'Thesis, author profiling, transformers' },
  { id: 'fullstack',    icon: '⚡', label: 'Full-Stack Developer',   desc: 'FastAPI, React, system design' },
  { id: 'data-science', icon: '📊', label: 'Data Scientist',        desc: 'Analysis, metrics, experimental design' },
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
  const isMobile         = typeof window !== 'undefined' && window.innerWidth < 520

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
      setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${err.message || 'Connection error'}. Please try again.` }])
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

  // ── Styles ────────────────────────────────────────────────────────────────

  const panelW = isMobile ? 'calc(100vw - 32px)' : 380
  const panelR = isMobile ? 16 : 28

  const panel = {
    position: 'fixed', bottom: 28, right: panelR,
    width: panelW, height: 560,
    background: '#0d1224',
    border: '1px solid rgba(99,102,241,0.35)',
    borderRadius: 20,
    boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)',
    display: 'flex', flexDirection: 'column',
    zIndex: 9999, overflow: 'hidden',
    animation: 'widgetOpen 0.22s cubic-bezier(0.34,1.56,0.64,1)',
  }

  const msgBubble = (role) => ({
    maxWidth: '82%',
    padding: '10px 14px',
    borderRadius: role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
    background: role === 'user'
      ? 'linear-gradient(135deg,#6366f1,#a78bfa)'
      : 'rgba(255,255,255,0.06)',
    border: role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
    color: '#e2e8f0', fontSize: 13, lineHeight: 1.55,
    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
  })

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes widgetOpen {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes recordPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%      { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        @keyframes dot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>

      {/* ── Floating button ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Manar AI assistant"
          style={{
            position: 'fixed', bottom: 28, right: 28,
            width: 58, height: 58, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(99,102,241,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, zIndex: 9999, transition: 'transform 0.18s, box-shadow 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.75)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.55)' }}
        >
          💬
        </button>
      )}

      {/* ── Panel ── */}
      {isOpen && (
        <div style={panel}>

          {/* Header */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(99,102,241,0.08)',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#6366f1,#a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
            }}>🤖</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>Manar AI</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>
                {mode === 'interview' && interviewStarted ? `🎯 ${position?.label} Interview` : 'Ask me anything'}
              </div>
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'flex', gap: 3, background: 'rgba(0,0,0,0.35)', borderRadius: 9, padding: 3, flexShrink: 0 }}>
              {[['chat','💬 Chat'],['interview','🎯 Interview']].map(([m, label]) => (
                <button key={m} onClick={() => setMode(m)} style={{
                  background: mode === m ? 'linear-gradient(135deg,#6366f1,#a78bfa)' : 'transparent',
                  border: 'none', color: mode === m ? '#fff' : '#64748b',
                  padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                }}>{label}</button>
              ))}
            </div>

            <button onClick={() => { setIsOpen(false); stopSpeaking() }} style={{
              background: 'none', border: 'none', color: '#64748b',
              cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '0 0 0 4px', flexShrink: 0,
            }}>×</button>
          </div>

          {/* Body */}
          {mode === 'interview' && !interviewStarted ? (

            /* Position selector */
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <p style={{ color: '#64748b', fontSize: 12, textAlign: 'center', marginBottom: 14, marginTop: 4 }}>
                Select a role to simulate a real job interview
              </p>
              {POSITIONS.map(pos => (
                <button key={pos.id} onClick={() => startInterview(pos)} style={{
                  width: '100%', marginBottom: 10, cursor: 'pointer',
                  background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: 13, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                  transition: 'background 0.18s, border-color 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.07)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)' }}
                >
                  <span style={{ fontSize: 26 }}>{pos.icon}</span>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>{pos.label}</div>
                    <div style={{ color: '#64748b', fontSize: 11, marginTop: 1 }}>{pos.desc}</div>
                  </div>
                </button>
              ))}
            </div>

          ) : (
            <>
              {/* Messages */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '14px 14px 6px',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {messages.length === 0 && mode === 'chat' && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginBottom: 12 }}>
                      Ask me anything about Manar 👋
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {SUGGESTIONS.map(s => (
                        <button key={s} onClick={() => sendMessage({ role: 'user', content: s }, [], null)} style={{
                          background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)',
                          borderRadius: 10, padding: '8px 12px', color: '#94a3b8', fontSize: 12,
                          cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.16)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.07)'}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={msgBubble(msg.role)}>{msg.content}</div>
                  </div>
                ))}

                {isLoading && (
                  <div style={{ display: 'flex', gap: 5, padding: '10px 14px', alignItems: 'center' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: '50%', background: '#6366f1',
                        animation: `dot 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}/>
                    ))}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Interview end session bar */}
              {mode === 'interview' && interviewStarted && (
                <div style={{
                  textAlign: 'center', fontSize: 11, color: '#475569',
                  padding: '5px 0', borderTop: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(0,0,0,0.15)', flexShrink: 0,
                }}>
                  <button onClick={() => { setInterviewStarted(false); setMessages([]); setPosition(null); stopSpeaking() }}
                    style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 11 }}>
                    End session
                  </button>
                </div>
              )}

              {/* Input area */}
              <div style={{
                padding: '10px 12px',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', gap: 7, alignItems: 'flex-end',
                background: 'rgba(0,0,0,0.18)', flexShrink: 0,
              }}>
                {/* Speaker toggle (interview only) */}
                {mode === 'interview' && (
                  <button
                    onClick={isSpeaking ? stopSpeaking : undefined}
                    title={isSpeaking ? 'Click to stop' : 'AI voice active'}
                    style={{
                      background: isSpeaking ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isSpeaking ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 10, width: 36, height: 36,
                      cursor: isSpeaking ? 'pointer' : 'default',
                      color: isSpeaking ? '#a78bfa' : '#475569',
                      fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >{isSpeaking ? '🔊' : '🔇'}</button>
                )}

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === 'interview' ? 'Type your answer…' : 'Ask about Manar…'}
                  rows={1}
                  disabled={isLoading}
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                    padding: '8px 12px', color: '#e2e8f0', fontSize: 13,
                    resize: 'none', outline: 'none', fontFamily: 'system-ui,sans-serif',
                    maxHeight: 80, lineHeight: 1.5,
                  }}
                />

                {/* Mic button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading && !isRecording}
                  title={isRecording ? 'Stop recording' : 'Voice input'}
                  style={{
                    background: isRecording ? 'rgba(239,68,68,0.18)' : 'rgba(99,102,241,0.1)',
                    border: `1px solid ${isRecording ? 'rgba(239,68,68,0.6)' : 'rgba(99,102,241,0.3)'}`,
                    borderRadius: 10, width: 36, height: 36, cursor: 'pointer',
                    color: isRecording ? '#ef4444' : '#a78bfa', fontSize: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    animation: isRecording ? 'recordPulse 1s ease-in-out infinite' : 'none',
                  }}
                >🎤</button>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  style={{
                    background: input.trim() && !isLoading
                      ? 'linear-gradient(135deg,#6366f1,#a78bfa)'
                      : 'rgba(99,102,241,0.12)',
                    border: 'none', borderRadius: 10, width: 36, height: 36,
                    cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                    color: input.trim() && !isLoading ? '#fff' : '#475569',
                    fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >➤</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
