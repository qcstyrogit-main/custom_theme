import frappe
from frappe.www.login import login as frappe_login

def custom_login():
    result = frappe_login()
    frappe.local.response["redirect_to"] = "/app/home"
    return result
