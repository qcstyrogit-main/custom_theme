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

    loginForm.dataset.bound = 'true';
    loginForm.addEventListener('submit', function (e) {
        const form = e.target;
        const loginButton = form.querySelector('button[type="submit"]');

        if (!loginButton) return;

        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';
    });
});
