// Copyright (c) 2019, Tech Station and contributors
// For license information, please see license.txt

frappe.ui.form.on('Commission Setting', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on('Commission Setting', {
	calculate_only_the_paid_bills(frm) {
	    if(frm.doc.calculate_only_the_paid_bills){
		frm.set_value("calculate_only_the_delivered_invoices",0);
	}
	},
	calculate_only_the_delivered_invoices(frm) {
	    if(frm.doc.calculate_only_the_delivered_invoices){
		frm.set_value("calculate_only_the_paid_bills",0);
	}
	}
});
