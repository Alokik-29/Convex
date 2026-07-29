import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Message from './Message'

const API = 'http://localhost:8000'
const WS = 'ws://localhost:8000'

export default function ChatArea({ room }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const socketRef = useRef(null)
  const typingTimeout = useRef(null)
  const bottomRef = useRef(null)
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  const emojis = ['👍', '❤️', '😂', '🔥', '😮', '😢', '🎉', '👀']

  useEffect(() => {
    if (!room) return
    connectWebSocket(room.id)
    return () => {
      if (socketRef.current) socketRef.current.close()
    }
  }, [room])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const connectWebSocket = (roomId) => {
    if (socketRef.current) socketRef.current.close()
    setMessages([])

    const ws = new WebSocket(`${WS}/ws/${roomId}?token=${token}`)
    socketRef.current = ws

    ws.onopen = () => console.log('Connected to room', roomId)

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'message') {
        setMessages(prev => [...prev, data])
      } else if (data.type === 'system') {
        setMessages(prev => [...prev, { ...data, isSystem: true }])
      } else if (data.type === 'typing') {
        setTyping(`${data.username} is typing...`)
        clearTimeout(typingTimeout.current)
        typingTimeout.current = setTimeout(() => setTyping(''), 2000)
      } else if (data.type === 'delete_message') {
        setMessages(prev => prev.filter(m => (m.id || m.message_id) !== data.message_id))
      }
    }

    ws.onclose = () => console.log('Disconnected')
  }

  const sendMessage = () => {
    const content = input.trim()
    if (!content || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return
    socketRef.current.send(JSON.stringify({ type: 'message', content }))
    setInput('')
  }

  const handleTyping = () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return
    socketRef.current.send(JSON.stringify({ type: 'typing' }))
  }

  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`${API}/rooms/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.log('Failed to delete message')
    }
  }

  const insertEmoji = (emoji) => {
    setInput(prev => prev + emoji)
    setShowEmoji(false)
  }

  if (!room) {
    return (
      <div className="chat-area">
        <div className="empty-state">
          <div className="icon">💬</div>
          <p>Select a room to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <div>
          <h2># {room.name}</h2>
          {room.description && <p className="room-desc">{room.description}</p>}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg, i) =>
          msg.isSystem ? (
            <div key={i} className="system-message">{msg.content}</div>
          ) : (
            <Message
              key={msg.id || i}
              data={msg}
              currentUsername={username}
              onDelete={handleDelete}
            />
          )
        )}
        <div ref={bottomRef} />
      </div>

      <div className="typing-indicator">{typing}</div>

      <div className="input-area">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder={`Message #${room.name}...`}
            value={input}
            onChange={(e) => { setInput(e.target.value); handleTyping() }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage() } }}
          />
          <div className="emoji-picker-btn" onClick={() => setShowEmoji(!showEmoji)}>😊</div>
        </div>
        <button className="btn-send" onClick={sendMessage}>↑</button>
      </div>

      {showEmoji && (
        <div className="emoji-picker">
          {emojis.map(emoji => (
            <span key={emoji} onClick={() => insertEmoji(emoji)}>{emoji}</span>
          ))}
        </div>
      )}
    </div>
  )
}