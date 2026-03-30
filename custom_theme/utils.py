import frappe


NO_STORE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
}

LOGIN_COOKIES = ["full_name", "user_id", "sid", "user_image", "system_user"]


def after_request(response=None):
    request = getattr(frappe.local, "request", None)
    path = getattr(request, "path", "") or ""
    method = getattr(request, "method", "") or ""

    if path.startswith("/login"):
        headers = frappe.local.response.setdefault("headers", {})
        headers.update(NO_STORE_HEADERS)

        # Mirror the one browser action JS cannot do: expire HttpOnly auth cookies
        # so a fresh login page is not stuck behind stale session state after restarts.
        if method == "GET" and hasattr(frappe.local, "cookie_manager"):
            frappe.local.cookie_manager.delete_cookie(LOGIN_COOKIES)

    return response
