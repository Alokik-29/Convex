function showTab(tab, e) {
    document.getElementById('login-tab').style.display = tab === 'login' ? 'block' : 'none'
    document.getElementById('register-tab').style.display = tab === 'register' ? 'block' : 'none'
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'))
    e.target.classList.add('active')
}

async function register() {
    const username = document.getElementById('reg-username').value
    const email = document.getElementById('reg-email').value
    const password = document.getElementById('reg-password').value

    const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    })

    const data = await response.json()
    if (response.ok) {
        alert('Registered successfully! Please login.')
        showTab('login')
    } else {
        document.getElementById('register-error').textContent = data.detail
    }
}

async function login() {
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `username=${email}&password=${password}`
    })

    const data = await response.json()
    if (response.ok) {
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('email', email)
    localStorage.setItem('username', email.split('@')[0])
    window.location.href = 'chat.html'
    } else {
        document.getElementById('login-error').textContent = data.detail
    }
}