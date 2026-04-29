import frappe
from custom_theme import __version__ as APP_VERSION
import datetime

NO_STORE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
}

def get_cookie_name():
    # Detect version and site to determine the unique cookie name
    # Site erp.qcstyro.com (v15) and erpdev.qcstyro.com (v16)
    if frappe.local.site == "erp.qcstyro.com":
        return "sid_v15"
    # Assuming the other site is the v16 one
    return "sid_v16"

def before_request():
    cookie_name = get_cookie_name()
    if cookie_name != "sid":
        # If the browser sent our unique cookie, copy it to 'sid' so Frappe core can find it
        custom_sid = frappe.request.cookies.get(cookie_name)
        if custom_sid:
            # We set it in form_dict and also in request.cookies just in case
            frappe.form_dict.sid = custom_sid

def after_request(response=None):
    if not response:
        return response

    request = getattr(frappe.local, "request", None)
    path = getattr(request, "path", "") or ""
    method = getattr(request, "method", "") or ""

    # Resolve session conflict by renaming 'sid' cookie
    cookie_name = get_cookie_name()
    if cookie_name != "sid" and hasattr(frappe.local, "cookie_manager"):
        if "sid" in frappe.local.cookie_manager.cookies:
            opts = frappe.local.cookie_manager.cookies.pop("sid")
            
            # Manually set the cookie on the response object with the shared domain
            from urllib.parse import quote
            response.set_cookie(
                cookie_name,
                quote((opts.get("value") or "").encode("utf-8")),
                expires=opts.get("expires"),
                secure=opts.get("secure"),
                httponly=opts.get("httponly"),
                samesite=opts.get("samesite"),
                max_age=opts.get("max_age"),
                domain=".qcstyro.com"
            )
            
            # Also ensure other common cookies use the shared domain to avoid conflicts
            for key in ["user_id", "full_name", "system_user", "user_image"]:
                if key in frappe.local.cookie_manager.cookies:
                    c_opts = frappe.local.cookie_manager.cookies.pop(key)
                    response.set_cookie(
                        key,
                        quote((c_opts.get("value") or "").encode("utf-8")),
                        expires=c_opts.get("expires"),
                        secure=c_opts.get("secure"),
                        httponly=c_opts.get("httponly"),
                        samesite=c_opts.get("samesite"),
                        max_age=c_opts.get("max_age"),
                        domain=".qcstyro.com"
                    )

    if path.startswith("/login"):
        headers = frappe.local.response.setdefault("headers", {})
        headers.update(NO_STORE_HEADERS)

        if (
            method == "GET"
            and frappe.session.user == "Guest"
            and hasattr(frappe.local, "cookie_manager")
        ):
            login_cookies = ["full_name", "user_id", "sid", cookie_name, "user_image", "system_user"]
            frappe.local.cookie_manager.delete_cookie(login_cookies)

    return response

def get_asset_version():
    return APP_VERSION
