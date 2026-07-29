import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'

const API = 'http://localhost:8000'

export default function Chat() {
  const [rooms, setRooms] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadRooms()
  }, [])

  const loadRooms = async () => {
    try {
      const res = await axios.get(`${API}/rooms/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRooms(res.data)
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        navigate('/login')
      }
    }
  }

  const handleJoinRoom = (room) => {
    setCurrentRoom(room)
  }

  const handleRoomCreated = (room) => {
    setRooms(prev => {
      const exists = prev.find(r => r.id === room.id)
      if (exists) return prev
      return [...prev, room]
    })
    setCurrentRoom(room)
  }

  return (
    <div className="app">
      <Sidebar
        rooms={rooms}
        currentRoom={currentRoom}
        onJoinRoom={handleJoinRoom}
        onRoomCreated={handleRoomCreated}
      />
      <ChatArea room={currentRoom} />
    </div>
  )
}