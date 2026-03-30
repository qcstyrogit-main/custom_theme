// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach((toggle) => {
    toggle.addEventListener('click', function () {
        const pwd = this.previousElementSibling;
        const svgUse = this.querySelector('use');
        const text = this.querySelector('.text-muted');

        if (!pwd) return;

        if (pwd.type === 'password') {
            pwd.type = 'text';
            if (svgUse) svgUse.setAttribute('href', '#es-line-eye-off');
            if (text) text.innerText = 'Hide';
        } else {
            pwd.type = 'password';
            if (svgUse) svgUse.setAttribute('href', '#es-line-eye');
            if (text) text.innerText = 'Show';
        }
    });
});

function showLoginError(loginButton, usernameInput, passwordInput) {
    loginButton.textContent = 'Invalid Login. Try Again.';
    loginButton.disabled = false;

    usernameInput.style.borderColor = 'red';
    passwordInput.style.borderColor = 'red';

    setTimeout(() => {
        loginButton.textContent = 'Login';
        usernameInput.style.borderColor = '';
        passwordInput.style.borderColor = '';
    }, 3000);
}

function getRedirectTarget(result) {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get('redirect-to');

    if (redirectParam) return redirectParam;
    if (result?.home_page) return result.home_page;
    if (result?.redirect_to) return result.redirect_to;

    // v16 usually uses /app, v15 commonly uses /desk
    return '/app';
}

async function redirectAfterLogin(result) {
    const target = getRedirectTarget(result);
    window.location.href = target;

    // fallback for setups where /app is not the correct post-login route
    setTimeout(() => {
        if (
            window.location.pathname === '/login' ||
            window.location.pathname === '/' ||
            window.location.pathname.includes('login')
        ) {
            window.location.href = '/desk';
        }
    }, 1500);
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const loginButton = form.querySelector('button[type="submit"]');
    const usernameInput = form.querySelector('#usr');
    const passwordInput = form.querySelector('#pwd');

    usernameInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    const data = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: data,
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json'
            }
        });

        let result = null;
        try {
            result = await response.json();
        } catch (err) {
            result = null;
        }

        console.log('Login response:', result);

        const hasServerError =
            result?.exc ||
            result?.exception ||
            result?.message === 'Invalid login credentials';

        if (response.ok && !hasServerError) {
            await redirectAfterLogin(result);
            return;
        }

        showLoginError(loginButton, usernameInput, passwordInput);
    } catch (err) {
        console.error('Login error:', err);
        showLoginError(loginButton, usernameInput, passwordInput);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const chat = document.getElementById('chat-bubble');
    if (chat) chat.style.display = 'none';
});