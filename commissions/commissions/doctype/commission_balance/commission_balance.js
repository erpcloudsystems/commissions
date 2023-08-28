// Copyright (c) 2019, Tech Station and contributors
// For license information, please see license.txt

frappe.ui.form.on('Commission Balance', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on('Commission Balance', {
    "onload": function(frm) {
		if(!frm.doc.__islocal){
		   frm.get_field("sales_team").grid.only_sortable();
		   $(".grid-add-row").hide();
		   frm.disable_save();
		}
}
});

/*frappe.ui.form.on("Commission Balance",{
	onload: function(frm) {
	    if(frm.doc.type == "Sales Team Master"){
		$.each(frm.doc.sales_team || [], function(i, v) {
			frappe.model.set_value(v.doctype, v.name, "total_commission", (frm.doc.balance / frm.doc.sales_team.length).toFixed(2));
//			frappe.model.set_value(v.doctype, v.name, "balance", (v.total_commission - v.paid));
		});
		frm.save();
	}
	}
});
*/
