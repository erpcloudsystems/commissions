frappe.ui.form.on("Sales Invoice", {
  onload: function(frm) {
        if(frm.doc.docstatus != 1){
    frappe.call({
    "method": "commissions.commissions.doctype.closing_delivery_commission.closing_delivery_commission.getBEN",
args: {
},
callback:function(r){
                frm.set_value("contact_the_customer_to_a_seller",r.message);
        }
    });
}
}
});

frappe.ui.form.on("Sales Invoice", {
  customer_name: function(frm) {
if(frm.doc.contact_the_customer_to_a_seller == 1){
    frappe.call({
    "method": "commissions.commissions.doctype.commission_template.commission_template.getData",
args: {
customer: frm.doc.customer_name
},
callback:function(r){
                frm.set_value("type", r.message[0][0]);
                frm.set_value("beneficiary", r.message[0][1]);
        }
    });
}
}
});

frappe.ui.form.on('Sales Invoice', 'validate', function(frm) {
    var dn = frm.doc.items;
    for (var j in dn){
    if(dn[j].delivery_note){
        frm.set_value("delivery","Delivered");
    }
    }
});
