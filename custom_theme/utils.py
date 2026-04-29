import frappe
from custom_theme import __version__ as APP_VERSION
import datetime
import os

NO_STORE_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
}

def log_debug(msg):
    # Log to a file for debugging
    try:
        log_path = os.path.join(frappe.get_site_path(), "..", "..", "logs", "custom_debug.log")
        with open(log_path, "a") as f:
            f.write(f"{datetime.datetime.now()} - {frappe.local.site} - {msg}\n")
    except Exception:
        pass

def get_cookie_name():
    # Robust check for site name
    site = frappe.local.site or ""
    if "erp.qcstyro.com" in site:
        return "sid_v15"
    return "sid_v16"

def before_request():
    cookie_name = get_cookie_name()
    log_debug(f"before_request: site={frappe.local.site}, cookie_name={cookie_name}, cookies={list(frappe.request.cookies.keys())}")
    
    if cookie_name != "sid":
        custom_sid = frappe.request.cookies.get(cookie_name)
        if custom_sid and custom_sid != "Guest":
            log_debug(f"Found custom_sid={custom_sid[:10]}...")
            frappe.local.form_dict.sid = custom_sid
            # Also try to set it in session if it's already there
            if hasattr(frappe.local, "session"):
                frappe.local.session.sid = custom_sid

def after_request(response=None):
    if not response:
        return response

    request = getattr(frappe.local, "request", None)
    path = getattr(request, "path", "") or ""
    method = getattr(request, "method", "") or ""

    cookie_name = get_cookie_name()
    
    if cookie_name != "sid" and hasattr(frappe.local, "cookie_manager"):
        from urllib.parse import quote
        
        # Check if sid is in the manager
        if "sid" in frappe.local.cookie_manager.cookies:
            opts = frappe.local.cookie_manager.cookies.pop("sid")
            log_debug(f"after_request: Renaming sid to {cookie_name}, value={opts.get('value')[:10]}...")
            
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
            # Clear standard sid
            response.set_cookie("sid", "", expires=0, domain=".qcstyro.com")

        # Sync other cookies
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
