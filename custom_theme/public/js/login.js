document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.toggle-password').forEach((toggle) => {
        toggle.addEventListener('click', function () {
            const pwd = this.closest('.form-row')?.querySelector('input');
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

    const chat = document.getElementById('chat-bubble');
    if (chat) chat.style.display = 'none';

    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    if (loginForm.dataset.bound === 'true') return;

    function showLoginError(message) {
        const errorBox = document.getElementById('login-error');
        const loginButton = loginForm.querySelector('button[type="submit"]');

        if (errorBox) {
            errorBox.textContent = message || 'Invalid login credentials.';
            errorBox.style.display = 'block';
        }

        if (loginButton) {
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    }

    function getRedirectTarget(result) {
        const formRedirect = loginForm.querySelector('input[name="redirect-to"]')?.value;

        if (result?.home_page) return result.home_page;
        if (result?.redirect_to) return result.redirect_to;
        if (formRedirect) return formRedirect;

        return '/app';
    }

    loginForm.dataset.bound = 'true';
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const loginButton = form.querySelector('button[type="submit"]');
        const errorBox = document.getElementById('login-error');

        if (!loginButton) return;

        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
        if (errorBox) errorBox.style.display = 'none';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
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

            const loginSucceeded =
                response.ok &&
                result &&
                result.message === 'Logged In';

            if (!loginSucceeded) {
                showLoginError(result?.message);
                return;
            }

            window.location.assign(getRedirectTarget(result));
        } catch (err) {
            showLoginError('Login failed. Please try again.');
        }
    });
});
