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
    if frappe.local.site == "erp.qcstyro.com":
        return "sid_v15"
    return "sid_v16"

def before_request():
    cookie_name = get_cookie_name()
    if cookie_name != "sid":
        # If the browser sent our unique cookie, copy it to 'sid' so Frappe core can find it
        custom_sid = frappe.request.cookies.get(cookie_name)
        
        # Only set if it's a real session hash, not 'Guest'
        # This allows Frappe's normal guest handling to take over if needed
        if custom_sid and custom_sid != "Guest":
            frappe.form_dict.sid = custom_sid
            # Also set it in local to be sure
            if hasattr(frappe.local, "session_obj"):
                frappe.local.session_obj.sid = custom_sid

def after_request(response=None):
    if not response:
        return response

    request = getattr(frappe.local, "request", None)
    path = getattr(request, "path", "") or ""
    method = getattr(request, "method", "") or ""

    # Resolve session conflict by renaming 'sid' cookie
    cookie_name = get_cookie_name()
    
    if cookie_name != "sid" and hasattr(frappe.local, "cookie_manager"):
        from urllib.parse import quote
        
        # Check if Frappe set a 'sid' cookie
        if "sid" in frappe.local.cookie_manager.cookies:
            opts = frappe.local.cookie_manager.cookies.pop("sid")
            
            # Manually set the cookie on the response object with the shared domain
            # Use .qcstyro.com for cross-subdomain compatibility
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
            
            # Also ensure we clear the standard 'sid' to avoid any confusion
            response.set_cookie("sid", "", expires=0, domain=".qcstyro.com")

        # Also rename/set other relevant cookies to use the shared domain
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
            # Only delete if we are purely a Guest visiting the login page
            login_cookies = ["full_name", "user_id", "sid", cookie_name, "user_image", "system_user"]
            frappe.local.cookie_manager.delete_cookie(login_cookies)

    return response

def get_asset_version():
    return APP_VERSION
