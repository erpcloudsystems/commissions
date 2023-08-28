// Copyright (c) 2019, Tech Station and contributors
// For license information, please see license.txt

frappe.ui.form.on("Closing Sales Commission",{
    onload: function(frm){
	if(frm.doc.docstatus != 1){
            var d = new Date();
            frm.set_value('from_date',new Date(d.getFullYear(),d.getMonth(),1));
            frm.set_value('to_date',new Date(d.getFullYear(), d.getMonth() + 1, 0));
    }
}
});

frappe.ui.form.on("Closing Sales Commission", {
  get_data: function(frm) {
	if(frm.doc.calculate_only_the_paid_bills == 1){
	cur_frm.refresh();
	cur_frm.clear_table("transaction");
	cur_frm.refresh_fields();
	var total = 0

    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.insert_data",
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
		total = total + r.message[i][3];
	}
		cur_frm.refresh();
		frm.set_value("paid_bills", total);
	}
    });
}
}
});

frappe.ui.form.on("Closing Sales Commission", {
  get_data: function(frm) {
	if(frm.doc.calculate_only_the_delivered_invoices ==1){
	cur_frm.refresh();
	cur_frm.clear_table("transaction");
	cur_frm.refresh_fields();
	var total = 0

    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.insert_data_DN",
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
		total = total + r.message[i][3];
	}
		cur_frm.refresh();
		frm.set_value("paid_bills", total);
	}
    });
}
}
});


frappe.ui.form.on("Closing Sales Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getQTY",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("unpaid_bills", r.message);
        }
    });
}
});

frappe.ui.form.on("Closing Sales Commission", {
  get_data: function(frm) {

    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getMT",
args: {
commission_template: frm.doc.commission_template
},
callback:function(r){
	var len=r.message.length;
	for (var i=0;i<len;i++){
//        console.log(r.message[i][0],r.message[i][1],r.message[i][2],r.message[i][3])
		var data = r.message[i][0] +" ("+ r.message[i][1] +"%) / "+ r.message[i][2] +" ("+ r.message[i][3] +"%)"
                frm.set_value("monthly_target", data);
		frm.set_value("monthly_target_temp", r.message[i][0]);
        }
	}
    });
}
});

frappe.ui.form.on("Closing Sales Commission", {
  get_data: function(frm) {
	if(frm.doc.paid_bills >= frm.doc.monthly_target_temp){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getCOMM",
args: {
commission_template: frm.doc.commission_template
},
callback:function(r){
	        frm.set_value("commission", r.message);
//		frm.set_value("closing_balance", (frm.doc.monthly_target_achieved * (r.message/100)));
        }
    });
}
}
});

frappe.ui.form.on("Closing Sales Commission", {
  get_data: function(frm) {
        if(frm.doc.paid_bills < frm.doc.monthly_target_temp){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getCOMM_LS",
args: {
commission_template: frm.doc.commission_template
},
callback:function(r){
                frm.set_value("commission", r.message);
//		frm.set_value("closing_balance", (frm.doc.monthly_target_achieved * (r.message/100)));
        }
    });
}
}
});

frappe.ui.form.on("Closing Sales Commission", {
  onload: function(frm) {
	if(frm.doc.docstatus != 1){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getCPB",
args: {
},
callback:function(r){
		frm.set_value("calculate_only_the_paid_bills",r.message);
	}
    });
}
}
});

frappe.ui.form.on("Closing Sales Commission", {
  onload: function(frm) {
        if(frm.doc.docstatus != 1){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getCDB",
args: {
},
callback:function(r){
		frm.set_value("calculate_only_the_delivered_invoices",r.message);
        }
    });
}
}
});

frappe.ui.form.on("Closing Sales Commission", {
  get_data: function(frm) {
	if(frm.doc.calculate_only_the_paid_bills == 1){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getPaid",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
                frm.set_value("monthly_target_achieved", r.message);
		frm.set_value("closing_balance", (r.message * (frm.doc.commission/100)));
        }
    });
}
	if(frm.doc.calculate_only_the_delivered_invoices == 1){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getDeliverd",
args: {
beneficiary: frm.doc.beneficiary,
type: frm.doc.type,
from_date: frm.doc.from_date,
to_date: frm.doc.to_date
},
callback:function(r){
               frm.set_value("monthly_target_achieved", r.message);
		frm.set_value("closing_balance", (r.message * (frm.doc.commission/100)));
        }
    });
}
}
});

frappe.ui.form.on("Closing Sales Commission", {
  get_data: function(frm) {
    frappe.call({
    "method": "commissions.commissions.doctype.closing_sales_commission.closing_sales_commission.getCB",
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

frappe.ui.form.on("Closing Sales Commission", "get_data", function(frm) {
 	if (frm.doc.type == "Sales Team Master"){
 		frappe.model.with_doc("Commission Balance", frm.doc.commission_balance, function() {
 		cur_frm.clear_table("cb_sales_team");
 		var tabletransfer = frappe.model.get_doc("Commission Balance", frm.doc.commission_balance);
 		$.each(tabletransfer.sales_team, function(index, row){
 			var d = frm.add_child("cb_sales_team");
 			d.name1 = row.name;
 		cur_frm.refresh_field("cb_sales_team");
//		frm.set_value("cb_value",frm.doc.closing_balance / a.length);
 		});
 		});
 	}
});


frappe.ui.form.on("Closing Sales Commission",{
    validate: function(frm){
        if(frm.doc.type == "Sales Team Master"){
           var a = frm.doc.cb_sales_team;
           frm.set_value("cb_value",frm.doc.closing_balance / a.length); 
    }
}
});
