// Copyright (c) 2020, Tech Station and contributors
// For license information, please see license.txt

frappe.ui.form.on('Closing Cars Commission', {
	// refresh: function(frm) {

	// }
});

frappe.ui.form.on("Closing Drivers Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_cars_commission.closing_cars_commission.getCB",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type
},
callback:function(r){
                frm.set_value("commission_balance",r.message);
        }
    });
}
});

frappe.ui.form.on("Closing Cars Commission",{
    onload: function(frm){
	if(frm.doc.docstatus == 0){
            var d = new Date();
            frm.set_value('from_date',new Date(d.getFullYear(),d.getMonth(),1));
            frm.set_value('to_date',new Date(d.getFullYear(), d.getMonth() + 1, 0));
//	    frm.save()
    }
}
});

frappe.ui.form.on("Closing Cars Commission", {
  get_data: function(frm) {
	cur_frm.refresh();
	cur_frm.clear_table("transaction");
	cur_frm.refresh_fields();
	var total = 0

    frappe.call({
    "method": "commissions.commissions.doctype.closing_cars_commission.closing_cars_commission.insert_data",
args: {
beneficiary: frm.doc.beneficiary,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
	var len=r.message.length;
	for (var i=0;i<len;i++){
	        var row = frm.add_child("transaction");
		row.mode_of_payment = r.message[i][0]
		row.date = r.message[i][1];
		row.transaction_number = r.message[i][2];
		row.paid_amount = r.message[i][3];
		row.created_by = r.message[i][4];
	}
		cur_frm.refresh();
	}
    });
}
});


frappe.ui.form.on("Closing Cars Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_cars_commission.closing_cars_commission.getCODorder",
args: {
beneficiary: frm.doc.beneficiary,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("number_of_orders_collected", r.message);
        }
    });
}
});

frappe.ui.form.on("Closing Cars Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_cars_commission.closing_cars_commission.getDELDC",
args: {
beneficiary: frm.doc.beneficiary
},
callback:function(r){
		frm.set_value("commission",r.message);
		frm.set_value("closing_balance", (frm.doc.number_of_orders_collected*r.message));
        }
    });
}
});

