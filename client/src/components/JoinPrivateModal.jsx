import { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function JoinPrivateModal({ onClose, onJoined }) {
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  const handleJoin = async () => {
    if (!roomName.trim() || !password.trim()) {
      setError('Please enter both room name and password')
      return
    }

    try {
      const res = await axios.post(`${API}/rooms/join-private`, {
        room_name: roomName,
        password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onJoined(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid room name or password')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>🔒 Join Private Room</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
          Enter the room name and password
        </p>

        <div className="input-group">
          <label>Room Name</label>
          <input
            type="text"
            placeholder="e.g. secret"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter room password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="modal-buttons">
          <button className="btn-primary" onClick={handleJoin}>Join</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}