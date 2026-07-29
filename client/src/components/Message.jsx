export default function Message({ data, currentUsername, onDelete }) {
  const msgId = data.id || data.message_id
  const isOwner = data.username === currentUsername

  const time = new Date(data.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="message" id={`msg-${msgId}`}>
      <div className="msg-avatar">{data.username?.[0]?.toUpperCase()}</div>
      <div className="msg-body">
        <div className="msg-header">
          <span className="msg-username">{data.username}</span>
          <span className="msg-time">{time}</span>
          {isOwner && msgId && (
            <button
              className="btn-delete"
              onClick={() => onDelete(msgId)}
            >
              🗑️
            </button>
          )}
        </div>
        <div className="msg-content">{data.content}</div>
      </div>
    </div>
  )
}