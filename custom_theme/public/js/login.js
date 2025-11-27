// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const pwd = this.previousElementSibling; // assumes input is just before toggle
        const svgUse = this.querySelector('use');
        const text = this.querySelector('.text-muted');

        if (pwd.type === 'password') {
            pwd.type = 'text';
            svgUse.setAttribute('href', '#es-line-eye-off');
            text.innerText = 'Hide';
        } else {
            pwd.type = 'password';
            svgUse.setAttribute('href', '#es-line-eye');
            text.innerText = 'Show';
        }
    });
});

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const loginButton = form.querySelector('button[type="submit"]');
    const usernameInput = form.querySelector('#usr');
    const passwordInput = form.querySelector('#pwd');

    // Reset previous error styles
    usernameInput.style.borderColor = '';
    passwordInput.style.borderColor = '';
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    const data = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: data,
            credentials: 'same-origin'
        });

        let result;
        try {
            result = await response.json();
        } catch {
            result = null;
        }

        if (result && result.home_page) {
            // Successful login
            window.location.href = result.home_page;
        } else {
            // Invalid login
            loginButton.textContent = 'Invalid Login. Try Again.';
            loginButton.disabled = false;

            // Highlight inputs with red border
            usernameInput.style.borderColor = 'red';
            passwordInput.style.borderColor = 'red';

            // Revert button and borders after 3 seconds
            setTimeout(() => {
                loginButton.textContent = 'Login';
                usernameInput.style.borderColor = '';
                passwordInput.style.borderColor = '';
            }, 3000);
        }
    } catch (err) {
        // Network/server error
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
});


document.addEventListener("DOMContentLoaded", function() {
    const chat = document.getElementById("chat-bubble");
    if(chat) chat.style.display = "none";
});

