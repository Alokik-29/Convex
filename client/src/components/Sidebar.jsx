import { useState } from 'react'
import CreateRoomModal from './CreateRoomModal'
import JoinPrivateModal from './JoinPrivateModal'

export default function Sidebar({ rooms, currentRoom, onJoinRoom, onRoomCreated }) {
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)
  const username = localStorage.getItem('username')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    window.location.href = '/login'
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-small">Con<span>vex</span></div>
      </div>

      <div className="sidebar-section">
        <p className="section-label">Rooms</p>

        {rooms.map(room => (
          <div
            key={room.id}
            className={`room-item ${currentRoom?.id === room.id ? 'active' : ''}`}
            onClick={() => onJoinRoom(room)}
          >
            <span className="room-hash">#</span>
            {room.name}
          </div>
        ))}

        <button className="btn-create-room" onClick={() => setShowCreate(true)}>
          + New Room
        </button>
        <button className="btn-join-private" onClick={() => setShowJoin(true)}>
          🔒 Join Private
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{username?.[0]?.toUpperCase()}</div>
          <span>{username}</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>↩</button>
      </div>

      {showCreate && (
        <CreateRoomModal
          onClose={() => setShowCreate(false)}
          onCreated={(room) => {
            onRoomCreated(room)
            setShowCreate(false)
          }}
        />
      )}

      {showJoin && (
        <JoinPrivateModal
          onClose={() => setShowJoin(false)}
          onJoined={(room) => {
            onJoinRoom(room)
            setShowJoin(false)
          }}
        />
      )}
    </div>
  )
}