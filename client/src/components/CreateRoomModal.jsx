import { useState } from 'react'
import axios from 'axios'

const API = 'https://convex-backend-6vq8.onrender.com'

export default function CreateRoomModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  const handleCreate = async () => {
    if (!name.trim()) return
    if (isPrivate && !password.trim()) {
      setError('Please set a password for private room')
      return
    }

    try {
      const res = await axios.post(`${API}/rooms/`, {
        name, description, is_private: isPrivate, password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (isPrivate) {
        alert(`Private room created! 🎉\n\nShare the room name + password with friends to let them join!`)
      }

      onCreated(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create room')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create a Room</h3>

        <div className="input-group">
          <label>Room Name</label>
          <input
            type="text"
            placeholder="e.g. general"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Description</label>
          <input
            type="text"
            placeholder="What's this room about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="toggle-group">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <span>Private Room</span>
          </label>
        </div>

        {isPrivate && (
          <div className="input-group">
            <label>Room Password</label>
            <input
              type="password"
              placeholder="Set a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <div className="modal-buttons">
          <button className="btn-primary" onClick={handleCreate}>Create</button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}