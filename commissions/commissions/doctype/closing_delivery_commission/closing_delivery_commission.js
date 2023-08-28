// Copyright (c) 2019, Tech Station and contributors
// For license information, please see license.txt


frappe.ui.form.on('Closing Delivery Commission', {
	type: function(frm) {
		frm.set_value("beneficiary","");
	}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getCB",
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

frappe.ui.form.on("Closing Delivery Commission",{
    onload: function(frm){
	if(frm.doc.docstatus == 0){
            var d = new Date();
            frm.set_value('from_date',new Date(d.getFullYear(),d.getMonth(),1));
            frm.set_value('to_date',new Date(d.getFullYear(), d.getMonth() + 1, 0));
//	    frm.save()
    }
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
	cur_frm.refresh();
	cur_frm.clear_table("transaction");
	cur_frm.refresh_fields();
	var total = 0

    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.insert_data",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
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



frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getPaidOrder",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
	        frm.set_value("number_of_orders_delivered", r.message);
        }
    });
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getCANOrder",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("number_of_failed_orders", r.message);
        }
    });
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getCODorder",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("number_of_orders_collected", r.message);
        }
    });
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
	if(frm.doc.type == "Delegate"){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getDELDC",
args: {
beneficiary: frm.doc.beneficiary
},
callback:function(r){
                frm.set_value("delivery_commission", r.message);
frm.set_value("closing_balance", (frm.doc.number_of_orders_delivered*r.message)+(frm.doc.number_of_orders_collected*frm.doc.collection_commission));
        }
    });
}
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
        if(frm.doc.type == "Delegate"){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getDELCC",
args: {
beneficiary: frm.doc.beneficiary
},
callback:function(r){
        frm.set_value("collection_commission", r.message);
frm.set_value("closing_balance", (frm.doc.number_of_orders_delivered*frm.doc.delivery_commission)+(frm.doc.number_of_orders_collected*r.message))
        }
    });
}
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
        if(frm.doc.type == "Shipping Company"){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getSHPDC",
args: {
beneficiary: frm.doc.beneficiary
},
callback:function(r){
                frm.set_value("delivery_commission", r.message);
frm.set_value("closing_balance", (frm.doc.number_of_orders_delivered*r.message)+(frm.doc.number_of_orders_collected*frm.doc.collection_commission));
        }
    });
}
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
        if(frm.doc.type == "Shipping Company"){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getSHPCC",
args: {
beneficiary: frm.doc.beneficiary
},
callback:function(r){
	frm.set_value("collection_commission", r.message);
frm.set_value("closing_balance", (frm.doc.number_of_orders_delivered*frm.doc.delivery_commission)+(frm.doc.number_of_orders_collected*r.message));
        }
    });
}
}
});


frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
        if(frm.doc.type == "Delegate"){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getDELDelayOrder",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("number_of_orders_delay", r.message);
        }
    });
}
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
        if(frm.doc.type == "Delegate"){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getDELRejOrder",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("number_of_orders_rejected", r.message);
        }
    });
}
}
});


frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
        if(frm.doc.type == "Shipping Company"){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getSHPDelayOrder",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("number_of_orders_delay", r.message);
        }
    });
}
}
});

frappe.ui.form.on("Closing Delivery Commission", {
  get_data: function(frm) {
        if(frm.doc.type == "Shipping Company"){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getSHPRejOrder",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("number_of_orders_rejected", r.message);
        }
    });
}
}
});
