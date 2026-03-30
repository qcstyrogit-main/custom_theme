// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach((toggle) => {
    toggle.addEventListener('click', function () {
        const pwd = this.closest('.form-row')?.querySelector('input');
        const svgUse = this.querySelector('use');
        const text = this.querySelector('.text-muted');

        if (!pwd) return;

        if (pwd.type === 'password') {
            pwd.type = 'text';
            if (text) text.innerText = 'Hide';
        } else {
            pwd.type = 'password';
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
    window.location.replace(target);
}

document.addEventListener('DOMContentLoaded', function () {
    const chat = document.getElementById('chat-bubble');
    if (chat) chat.style.display = 'none';

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    if (loginForm.dataset.bound === 'true') return;

    loginForm.dataset.bound = 'true';
    let isSubmitting = false;

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (isSubmitting) return;

        const form = e.target;
        const loginButton = form.querySelector('button[type="submit"]');
        const usernameInput = form.querySelector('#usr');
        const passwordInput = form.querySelector('#pwd');

        if (!loginButton || !usernameInput || !passwordInput) return;

        isSubmitting = true;
        form.dataset.submitting = 'true';
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

            isSubmitting = false;
            form.dataset.submitting = 'false';
            showLoginError(loginButton, usernameInput, passwordInput);
        } catch (err) {
            console.error('Login error:', err);
            isSubmitting = false;
            form.dataset.submitting = 'false';
            showLoginError(loginButton, usernameInput, passwordInput);
        }
    });
});
