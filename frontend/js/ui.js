function createMessageElement(data, currentUsername) {
    const div = document.createElement('div')
    const msgId = data.id || data.message_id
    div.className = 'message'
    div.id = `msg-${msgId || Date.now()}`

    const time = new Date(data.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })

    const isOwner = data.username === currentUsername
    const deleteBtn = isOwner && msgId ? `<button type="button" class="btn-delete" onclick="event.stopPropagation();deleteMessage(${msgId})">🗑️</button>` : ''

    div.innerHTML = `
        <div class="msg-avatar">${data.username[0].toUpperCase()}</div>
        <div class="msg-body">
            <div class="msg-header">
                <span class="msg-username">${data.username}</span>
                <span class="msg-time">${time}</span>
                ${deleteBtn}
            </div>
            <div class="msg-content">${data.content}</div>
            <div class="msg-reactions" id="reactions-${msgId || ''}"></div>
        </div>
    `
    return div
}

function createSystemMessage(content) {
    const div = document.createElement('div')
    div.className = 'system-message'
    div.textContent = content
    return div
}

function scrollToBottom() {
    const container = document.getElementById('messages')
    container.scrollTop = container.scrollHeight
}

function showCreateRoom() {
    document.getElementById('modal').style.display = 'flex'
}

function hideCreateRoom() {
    document.getElementById('modal').style.display = 'none'
    document.getElementById('room-private').checked = false
    document.getElementById('room-password-group').style.display = 'none'
    document.getElementById('room-password-input').value = ''
}

function togglePrivate() {
    const isPrivate = document.getElementById('room-private').checked
    document.getElementById('room-password-group').style.display = isPrivate ? 'block' : 'none'
}

function showJoinModal() {
    document.getElementById('join-modal').style.display = 'flex'
}

function hideJoinModal() {
    document.getElementById('join-modal').style.display = 'none'
    document.getElementById('join-code-input').value = ''
    document.getElementById('join-password-input').value = ''
    document.getElementById('join-error').textContent = ''
}

function insertEmoji(emoji) {
    const input = document.getElementById('message-input')
    input.value += emoji
    input.focus()
    toggleEmojiPicker()
}

function toggleEmojiPicker() {
    const picker = document.getElementById('emoji-picker')
    picker.style.display = picker.style.display === 'none' ? 'flex' : 'none'
}

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    window.location.href = 'index.html'
}