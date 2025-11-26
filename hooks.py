app_name = "custom_theme"
app_title = "Custom Theme"
app_publisher = "QC Styro"
app_description = "Polished login, forgot password, and register pages with dark mode and animations"
app_version = "1.0.0"

# Add this
app_include_js = []
app_include_css = []

# Add route for forgot password
website_route_rules = [
    {"from_route": "/forgot-password", "to_route": "custom_theme/forgot-password"}
]