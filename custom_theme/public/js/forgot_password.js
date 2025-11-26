document.getElementById('reset-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;

    if (!email) {
        frappe.msgprint('Please enter your email.');
        return;
    }

    frappe.call({
        method: 'frappe.core.doctype.user.user.reset_password',
        args: { user: email },
        callback: function(r) {
            if (r.message) {
                frappe.msgprint('Password reset email sent.');
            }
        }
    });
});

// Back to login handled by inline onclick in button (optional: move to JS)
document.querySelector('.back-login').addEventListener('click', () => {
    window.location.href = '/login';
});
