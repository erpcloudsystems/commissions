// Copyright (c) 2016, Tech Station and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Pending Commission Balance"] = {
	"filters": [
		{
                    "fieldname": "type",
                    "label": __("Type"),
                    "fieldtype": "Select",
                    "options": "\nSales Person Master\nSales Team Master\nSales Partner Master\nDelegate\nShipping Company"
                }
	]
};
