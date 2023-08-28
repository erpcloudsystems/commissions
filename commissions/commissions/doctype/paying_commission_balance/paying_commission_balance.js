// Copyright (c) 2019, Tech Station and contributors
// For license information, please see license.txt

frappe.ui.form.on('Paying Commission Balance', {
	type: function(frm) {
		frm.set_value("beneficiary", "");
		frm.set_value("available_balance", "");
	},
	beneficiary: function(frm) {
		if(frm.doc.type == "Sales Team Master"){
		frm.set_df_property('employee',  'reqd',1);
                frm.set_value("employee", "");
        }
	},
	onload: function(frm) {
                if(frm.doc.type == "Sales Team Master"){
                frm.set_df_property('employee',  'reqd',1);
        }
        }

});

frappe.ui.form.on("Paying Commission Balance", {
  beneficiary: function(frm) {
	if(frm.doc.type != "Sales Team Master"){
    frappe.call({
    "method": "commissions.commissions.doctype.paying_commission_balance.paying_commission_balance.getBalance",
args: {
type : frm.doc.type,
beneficiary : frm.doc.beneficiary
},
callback:function(r){
		var len=r.message.length;
			for (var i=0;i<len;i++){
				frm.set_value("commission_balance", r.message[i][0]);
	        		frm.set_value("available_balance", r.message[i][1]);
        }
	}
    });
}
}
});

frappe.ui.form.on("Paying Commission Balance", {
  employee: function(frm) {
        if(frm.doc.type == "Sales Team Master"){
    frappe.call({
    "method": "commissions.commissions.doctype.paying_commission_balance.paying_commission_balance.getBalanceST",
args: {
type : frm.doc.type,
beneficiary : frm.doc.beneficiary,
employee : frm.doc.employee
},
callback:function(r){
                var len=r.message.length;
                        for (var i=0;i<len;i++){
				frm.set_value("cb", r.message[i][0]);
                                frm.set_value("commission_balance", r.message[i][1]);
                                frm.set_value("available_balance", r.message[i][2]);
        }
        }
    });
}
}
});

frappe.ui.form.on('Paying Commission Balance', {
        amount: function(frm) {
                if(frm.doc.amount > frm.doc.available_balance){
			frappe.throw("Amount Should Not Be Greater Than Available Balance");
}
        }
});

frappe.ui.form.on('Paying Commission Balance', {
        validate: function(frm) {
                if(frm.doc.amount > frm.doc.available_balance){
                        frappe.throw("Amount Should Not Be Greater Than Available Balance");
			validated = false;
}
        }
});

frappe.ui.form.on("Paying Commission Balance", "mode_of_payment", function(frm) {
    cur_frm.set_query("account_paid_from", function() {
        return {
            "filters": {
                "account_type": frm.doc.mode_of_payment,
                "is_group": 0
            }
        };
    });
});

frappe.ui.form.on("Paying Commission Balance", "onload", function(frm) {
    cur_frm.set_query("account_paid_to", function() {
        return {
            "filters": {
                "account_type": "Payable",
                "is_group": 0
            }
        };
    });
});

