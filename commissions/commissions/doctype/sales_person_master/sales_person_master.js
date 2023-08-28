// Copyright (c) 2019, Tech Station and contributors
// For license information, please see license.txt

frappe.ui.form.on('Sales Person Master', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on("Sales Person Master", "onload", function(frm) {
    cur_frm.set_query("commission_template", function() {
        return {
            "filters": {
                "enable": 1
            }
        };
    });
});
