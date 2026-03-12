const API = 'http://localhost:8000'
let socket = null
let currentRoomId = null
let typingTimeout = null
let username = localStorage.getItem('username')
let token = localStorage.getItem('token')

if (!token) window.location.href = 'index.html'

window.onload = async () => {
    await loadRooms()
    document.getElementById('user-name').textContent = username
    document.getElementById('user-avatar').textContent = username ? username[0].toUpperCase() : '?'
}

async function loadRooms() {
    const res = await fetch(`${API}/rooms/`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) {
        console.log('Failed to load rooms:', res.status)
        return
    }
    const rooms = await res.json()
    const list = document.getElementById('rooms-list')
    list.innerHTML = ''
    rooms.forEach(room => {
        const div = document.createElement('div')
        div.className = 'room-item'
        div.id = `room-${room.id}`
        div.innerHTML = `<span class="room-hash">#</span> ${room.name}`
        div.onclick = () => joinRoom(room)
        list.appendChild(div)
    })
}

async function createRoom() {
    const name = document.getElementById('room-name-input').value.trim()
    const description = document.getElementById('room-desc-input').value.trim()
    const is_private = document.getElementById('room-private').checked
    const password = document.getElementById('room-password-input').value.trim()

    if (!name) return
    if (is_private && !password) {
        alert('Please set a password for the private room!')
        return
    }

    const res = await fetch(`${API}/rooms/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, is_private, password })
    })

    if (res.ok) {
        const room = await res.json()
        hideCreateRoom()
        document.getElementById('room-name-input').value = ''
        document.getElementById('room-desc-input').value = ''
        if (is_private) {
            alert(`Private room created! 🎉\n\nShare the room name and password with friends to let them join!`)
        }
        await loadRooms()
        joinRoom(room)
    }
}

async function submitJoinPrivate() {
    const room_name = document.getElementById('join-code-input').value.trim()
    const password = document.getElementById('join-password-input').value.trim()

    if (!room_name || !password) {
        document.getElementById('join-error').textContent = 'Please enter both room name and password'
        return
    }

    const res = await fetch(`${API}/rooms/join-private`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ room_name, password })
    })

    if (res.ok) {
        const room = await res.json()
        hideJoinModal()
        joinRoom(room)
    } else {
        const data = await res.json()
        document.getElementById('join-error').textContent = data.detail || 'Invalid room name or password'
    }
}

function joinRoom(room) {
    document.querySelectorAll('.room-item').forEach(r => r.classList.remove('active'))
    const roomEl = document.getElementById(`room-${room.id}`)
    if (roomEl) roomEl.classList.add('active')
    document.getElementById('room-name').textContent = `# ${room.name}`
    document.getElementById('room-description').textContent = room.description || ''
    document.getElementById('message-input').disabled = false
    document.getElementById('send-btn').disabled = false
    document.getElementById('messages').innerHTML = ''
    if (socket) socket.close()
    currentRoomId = room.id
    connectWebSocket(room.id)
}

function connectWebSocket(roomId) {
    socket = new WebSocket(`ws://localhost:8000/ws/${roomId}?token=${token}`)

    socket.onopen = () => console.log('Connected to room', roomId)

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
            console.log('Message data:', data)  // add this line
            document.getElementById('messages').appendChild(createMessageElement(data, username))
            scrollToBottom()
        } else if (data.type === 'system') {
            document.getElementById('messages').appendChild(createSystemMessage(data.content))
            scrollToBottom()
        } else if (data.type === 'typing') {
            const indicator = document.getElementById('typing-indicator')
            indicator.textContent = `${data.username} is typing...`
            clearTimeout(typingTimeout)
            typingTimeout = setTimeout(() => indicator.textContent = '', 2000)
        } else if (data.type === 'reaction') {
            addReaction(data)
        } else if (data.type === 'delete_message') {
            const msgEl = document.getElementById(`msg-${data.message_id}`)
            if (msgEl) msgEl.remove()
        }
    }

    socket.onclose = () => console.log('Disconnected from room')
}

function sendMessage() {
    const input = document.getElementById('message-input')
    const content = input.value.trim()
    if (!content || !socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({ type: 'message', content }))
    input.value = ''
    input.focus()
}

function handleTyping() {
    if (!socket || socket.readyState !== WebSocket.OPEN) return
    socket.send(JSON.stringify({ type: 'typing' }))
}

function addReaction(data) {
    const reactionsDiv = document.getElementById(`reactions-${data.message_id}`)
    if (!reactionsDiv) return
    const existing = reactionsDiv.querySelector(`[data-emoji="${data.emoji}"]`)
    if (existing) {
        const count = parseInt(existing.dataset.count) + 1
        existing.dataset.count = count
        existing.textContent = `${data.emoji} ${count}`
    } else {
        const badge = document.createElement('div')
        badge.className = 'reaction-badge'
        badge.dataset.emoji = data.emoji
        badge.dataset.count = 1
        badge.textContent = `${data.emoji} 1`
        reactionsDiv.appendChild(badge)
    }
}

async function deleteMessage(messageId) {
    const res = await fetch(`${API}/rooms/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) console.log('Failed to delete message')
}