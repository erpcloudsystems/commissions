# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "commissions"
app_title = "Commissions"
app_publisher = "Tech Station"
app_description = "App for Sales Person Commision"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "developers@techstation.com.eg"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/commissions/css/commissions.css"
# app_include_js = "/assets/commissions/js/commissions.js"

# include js, css files in header of web template
# web_include_css = "/assets/commissions/css/commissions.css"
# web_include_js = "/assets/commissions/js/commissions.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

doctype_js = {
	"Quotation" : "public/js/quotation.js",
	"Sales Order" : "public/js/sales_order.js",
	"Sales Invoice" : "public/js/sales_invoice.js"
}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "commissions.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "commissions.install.before_install"
# after_install = "commissions.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "commissions.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

doc_events = {
	"Payment Entry": {
		"on_submit": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.updateMOP"
	},
	"Delivery Note": {
                "before_submit": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.updateDNSI" 
        }
}

fixtures = [
    {
        "doctype": "Property Setter",
        "filters": [
            [
                "name",
                "in",
                [
			"Sales Order-sales_team_section_break-hidden",
			"Sales Order-section_break1-hidden",
			"Sales Order-sales_partner-hidden",
			"Sales Order-commission_rate-hidden",
			"Sales Order-total_commission-hidden",
			"Sales Invoice-sales_team_section_break-hidden",
			"Sales Invoice-section_break2-hidden",
			"Sales Invoice-sales_partner-hidden",
			"Sales Invoice-commission_rate-hidden",
			"Sales Invoice-total_commission-hidden",
			"Delivery Note-sales_partner-hidden",
			"Delivery Note-commission_rate-hidden",
			"Delivery Note-total_commission-hidden",
			"Customer-sales_team_section_break-hidden",
			"Customer-sales_team_section-hidden"
		]
	   ]
	]
    },
    {
        "doctype": "Custom Field",
        "filters": [
            [
                "name",
                "in",
                [
			"Sales Order-commission_section",
                        "Sales Order-type",
			"Sales Order-beneficiary",
			"Sales Order-is_car",
			"Sales Order-is_driver",
			"Sales Order-contact_the_customer_to_a_seller",
			"Sales Invoice-commission_section",
			"Sales Invoice-type",
			"Sales Invoice-beneficiary",
			"Sales Invoice-contact_the_customer_to_a_seller",
			"Quotation-commission",
			"Quotation-type",
			"Quotation-beneficiary",
			"Quotation-contact_the_customer_to_a_seller",
			"Sales Invoice-calculated",
			"Sales Invoice-mode_of_payment",
			"Delivery Note-type",
			"Delivery Note-beneficiary",
			"Sales Invoice-delivery",
			"Customer-commission",
			"Customer-type",
			"Customer-beneficiary",
			"Sales Order-is_cdc"
                ]
           ]
        ]
    }
]

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"commissions.tasks.all"
# 	],
# 	"daily": [
# 		"commissions.tasks.daily"
# 	],
# 	"hourly": [
# 		"commissions.tasks.hourly"
# 	],
# 	"weekly": [
# 		"commissions.tasks.weekly"
# 	]
# 	"monthly": [
# 		"commissions.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "commissions.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "commissions.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "commissions.task.get_dashboard_data"
# }

