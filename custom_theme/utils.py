import frappe


NO_STORE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
}


def after_request(response=None):
    request = getattr(frappe.local, "request", None)
    path = getattr(request, "path", "") or ""

    if path.startswith("/login"):
        headers = frappe.local.response.setdefault("headers", {})
        headers.update(NO_STORE_HEADERS)

    return response
