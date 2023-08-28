from __future__ import unicode_literals
import frappe
from frappe import msgprint, _

def execute(filters=None):
	columns = get_column()
	data = get_data(filters)
	return columns,data

def get_column():
	return [_("Name") + ":Link/Commission Balance:150",
			_("Type") + ":Data:150",
			_("Beneficiary") + ":Data:150",
			_("Employee") + ":Data:150",
			_("Partner") + ":Date:150",
			_("Balance") + ":Currency:150"]

def get_data(filters):
	if filters.get("type"):
		type = filters.get("type")
		invoice = frappe.db.sql("""select name,type,beneficiary,employee,customer,balance from `tabCommission Balance` 
				where balance != 0 and type = '%s';"""%(type), as_list=1)
		return invoice
